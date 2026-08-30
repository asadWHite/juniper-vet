import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { appointments, reviews } from "@/db/schema";
import { getSessionUser, newId } from "@/lib/auth";
import { body, fail, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

// GET ?doctor=<id> → approved, public
export async function GET(req: Request) {
  const url = new URL(req.url);
  const doctorId = url.searchParams.get("doctor");
  try {
    const rows = doctorId
      ? await db
          .select()
          .from(reviews)
          .where(and(eq(reviews.doctorId, doctorId), eq(reviews.approved, true)))
          .orderBy(desc(reviews.createdAt))
      : await db.select().from(reviews).where(eq(reviews.approved, true)).orderBy(desc(reviews.createdAt));
    return ok({ reviews: rows });
  } catch (err) {
    console.error("[reviews GET]", err);
    return fail("Reviews could not be loaded.", 500);
  }
}

// POST { appointmentId, rating, comment } — only for your own completed visits
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return fail("Please sign in.", 401);

  const data = await body<{ appointmentId?: string; rating?: number; comment?: string }>(req);
  if (!data?.appointmentId) return fail("Missing appointment.", 422);
  const rating = Number(data.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return fail("Please choose a rating from 1 to 5.", 422, "validation");
  const comment = (data.comment ?? "").trim();
  if (comment.length < 10)
    return fail("A few more words, please — at least 10 characters.", 422, "validation");

  try {
    const rows = await db
      .select()
      .from(appointments)
      .where(and(eq(appointments.id, data.appointmentId), eq(appointments.userId, user.id)))
      .limit(1);
    const appt = rows[0];
    if (!appt) return fail("Appointment not found.", 404);
    if (appt.status !== "completed")
      return fail("Reviews can only be left after a completed visit.", 409, "not_completed");

    const existing = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(eq(reviews.appointmentId, appt.id))
      .limit(1);
    if (existing.length)
      return fail("You have already reviewed this visit.", 409, "duplicate");

    await db.insert(reviews).values({
      id: newId(),
      appointmentId: appt.id,
      userId: user.id,
      doctorId: appt.doctorId,
      rating,
      comment,
      authorLabel: `${user.fullName} · VERIFIED VISIT`,
      approved: false, // becomes public once the clinic approves it
    });
    return ok({ ok: true, message: "Thank you — your review is saved and will appear once approved." }, { status: 201 });
  } catch (err) {
    console.error("[reviews POST]", err);
    return fail("The review could not be saved.", 500);
  }
}
