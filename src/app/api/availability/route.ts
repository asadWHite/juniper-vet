import { ensureSeed } from "@/lib/seed";
import { getDaySlots, getDayStrip, getNextSlots } from "@/lib/availability-data";
import { fail, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") ?? "";
  const doctorId = url.searchParams.get("doctor") ?? "";
  const serviceId = url.searchParams.get("service") ?? "";

  try {
    await ensureSeed();

    if (kind === "next") {
      if (!serviceId) return fail("Missing service.", 422);
      const next = await getNextSlots(serviceId);
      return ok({ next });
    }

    if (!doctorId || !serviceId) return fail("Missing doctor or service.", 422);

    if (kind === "days") {
      const days = await getDayStrip(doctorId, serviceId);
      return ok({ days });
    }

    if (kind === "slots") {
      const date = url.searchParams.get("date") ?? "";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fail("Missing or invalid date.", 422);
      const slots = await getDaySlots(doctorId, serviceId, date);
      return ok({ slots });
    }

    return fail("Unknown request.", 400);
  } catch (err) {
    console.error("[availability]", err);
    return fail("Availability could not be loaded right now.", 500);
  }
}
