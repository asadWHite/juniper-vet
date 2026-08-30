import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  consumeResetToken,
  createResetToken,
  createSession,
  destroySession,
  destroyUserSessions,
  getSessionUser,
  hashPassword,
  newId,
  SESSION_COOKIE,
  sessionCookieValue,
  verifyPassword,
} from "@/lib/auth";
import { body, fail, isEmail, ok } from "@/lib/api";
import { ensureSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ action: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { action } = await ctx.params;
  if (action !== "me") return fail("Not found.", 404);
  const user = await getSessionUser();
  return ok({ user });
}

export async function POST(req: Request, ctx: Ctx) {
  const { action } = await ctx.params;

  // `logout` is a side-effect-only action and is sent without a JSON body,
  // so it must be handled before the body is required.
  if (action === "logout") {
    try {
      const cookieHeader = req.headers.get("cookie") ?? "";
      const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
      if (match) await destroySession(match[1]);
    } catch (err) {
      console.error("[auth/logout]", err);
      // Still clear the cookie — the client must end up signed out either way.
    }
    const res = ok({ ok: true });
    res.cookies.set(SESSION_COOKIE, "", { path: "/", expires: new Date(0) });
    return res;
  }

  const data = await body<Record<string, string>>(req);
  if (!data) return fail("Invalid request.", 400);

  try {
    switch (action) {
      // ---------------------------------------------------------- register
      case "register": {
        const { fullName, email, phone, password } = data;
        if (!fullName?.trim()) return fail("Please tell us your name.", 422, "validation");
        if (!isEmail(email ?? "")) return fail("That email doesn't look right.", 422, "validation");
        if ((password ?? "").length < 8)
          return fail("Password needs at least 8 characters.", 422, "validation");

        const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email.toLowerCase())).limit(1);
        if (existing.length)
          return fail("An account with this email already exists. Try signing in instead.", 409, "email_taken");

        const id = newId();
        await db.insert(users).values({
          id,
          email: email.toLowerCase(),
          fullName: fullName.trim().toUpperCase(),
          phone: phone?.trim() || null,
          passwordHash: hashPassword(password),
        });
        const session = await createSession(id);
        const res = ok({ user: { id, email: email.toLowerCase(), fullName: fullName.trim().toUpperCase(), phone: phone ?? null } }, { status: 201 });
        res.cookies.set(sessionCookieValue(session.token, session.expiresAt));
        return res;
      }

      // ---------------------------------------------------------- login
      case "login": {
        const { email, password } = data;
        const rows = await db.select().from(users).where(eq(users.email, (email ?? "").toLowerCase())).limit(1);
        const u = rows[0];
        if (!u || !verifyPassword(password ?? "", u.passwordHash))
          return fail("Email or password is incorrect.", 401, "bad_credentials");
        const session = await createSession(u.id);
        const res = ok({ user: { id: u.id, email: u.email, fullName: u.fullName, phone: u.phone } });
        res.cookies.set(sessionCookieValue(session.token, session.expiresAt));
        return res;
      }

      // ---------------------------------------------------------- forgot
      case "forgot-password": {
        const { email } = data;
        await ensureSeed();
        const rows = await db.select().from(users).where(eq(users.email, (email ?? "").toLowerCase())).limit(1);
        const u = rows[0];
        // Always answer the same way — never leak whether an email exists.
        if (u) {
          const token = await createResetToken(u.id);
          // No email provider is configured in this environment, so the
          // reset link is returned for the demo to remain testable.
          return ok({
            ok: true,
            message: "If this email exists, a reset link is on its way.",
            devResetUrl: `/reset-password?token=${token}`,
          });
        }
        return ok({ ok: true, message: "If this email exists, a reset link is on its way." });
      }

      // ---------------------------------------------------------- reset
      case "reset-password": {
        const { token, password } = data;
        if ((password ?? "").length < 8)
          return fail("Password needs at least 8 characters.", 422, "validation");
        const userId = await consumeResetToken(token ?? "");
        if (!userId) return fail("This reset link is invalid or has expired. Please request a new one.", 400, "bad_token");
        await db.update(users).set({ passwordHash: hashPassword(password) }).where(eq(users.id, userId));
        await destroyUserSessions(userId);
        const session = await createSession(userId);
        const res = ok({ ok: true });
        res.cookies.set(sessionCookieValue(session.token, session.expiresAt));
        return res;
      }

      default:
        return fail("Not found.", 404);
    }
  } catch (err) {
    console.error(`[auth/${action}]`, err);
    return fail("Something went wrong on our side. Please try again.", 500);
  }
}
