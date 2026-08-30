import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  destroyUserSessions,
  createSession,
  getSessionUser,
  hashPassword,
  sessionCookieValue,
  verifyPassword,
} from "@/lib/auth";
import { body, fail, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

// PATCH { type: "profile" | "password", ... }
export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) return fail("Please sign in.", 401);
  const data = await body<Record<string, string>>(req);
  if (!data) return fail("Invalid request.", 400);

  try {
    if (data.type === "profile") {
      if (!data.fullName?.trim()) return fail("Name cannot be empty.", 422, "validation");
      await db
        .update(users)
        .set({ fullName: data.fullName.trim().toUpperCase(), phone: data.phone?.trim() || null })
        .where(eq(users.id, user.id));
      return ok({ ok: true });
    }

    if (data.type === "password") {
      const rows = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
      const u = rows[0];
      if (!u || !verifyPassword(data.current ?? "", u.passwordHash))
        return fail("The current password is incorrect.", 401, "bad_credentials");
      if ((data.next ?? "").length < 8)
        return fail("The new password needs at least 8 characters.", 422, "validation");
      await db.update(users).set({ passwordHash: hashPassword(data.next) }).where(eq(users.id, user.id));
      await destroyUserSessions(user.id);
      const session = await createSession(user.id);
      const res = ok({ ok: true });
      res.cookies.set(sessionCookieValue(session.token, session.expiresAt));
      return res;
    }

    return fail("Unknown update type.", 400);
  } catch (err) {
    console.error("[account PATCH]", err);
    return fail("The account could not be updated.", 500);
  }
}
