import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { body, fail, ok } from "@/lib/api";
import { todayISO } from "@/lib/dates";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const user = await getSessionUser();
  if (!user) return fail("Please sign in.", 401);

  const { id } = await ctx.params;
  const data = await body<{ action?: string }>(req);
  if (data?.action !== "cancel") return fail("Unsupported action.", 400);

  try {
    const rows = await db
      .select()
      .from(appointments)
      .where(and(eq(appointments.id, id), eq(appointments.userId, user.id)))
      .limit(1);
    const appt = rows[0];
    if (!appt) return fail("Appointment not found.", 404);
    if (appt.status === "cancelled") return fail("This appointment is already cancelled.", 409);
    if (appt.status === "completed") return fail("Completed visits cannot be cancelled.", 409);
    if (appt.date < todayISO()) return fail("Past appointments can no longer be cancelled.", 409);

    await db.update(appointments).set({ status: "cancelled" }).where(eq(appointments.id, id));
    return ok({ ok: true });
  } catch (err) {
    console.error("[appointments PATCH]", err);
    return fail("The appointment could not be cancelled right now.", 500);
  }
}
