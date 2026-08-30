"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Heart,
  Pencil,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import type { AppointmentCard, PetVm, SessionUser } from "@/types";
import { humanLong, humanShort } from "@/lib/dates";
import { Stars } from "@/components/ui/bits";

// ---------------------------------------------------------------- pets
const SPECIES_OPTS = [
  ["dog", "DOG"],
  ["cat", "CAT"],
  ["rabbit", "RABBIT"],
  ["bird", "BIRD"],
  ["other", "OTHER"],
] as const;

export function PetsManager({ initial }: { initial: PetVm[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PetVm | null>(null);

  return (
    <>
      <div className="grid grid-cols-12 gap-5">
        {initial.map((p) => (
          <div key={p.id} className="col-span-12 border border-line sm:col-span-6 xl:col-span-4">
            <Link href={`/account/pets/${p.id}`} className="img-zoom block overflow-hidden" aria-label={p.name}>
              <img src={p.photoUrl ?? undefined} alt={p.name} className="aspect-[4/3] w-full object-cover" loading="lazy" />
            </Link>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[17px] font-extrabold uppercase tracking-tight">{p.name}</p>
                  <p className="label mt-1.5 !text-[8.5px] text-stone">
                    {p.species.toUpperCase()}
                    {p.breed ? ` · ${p.breed}` : ""}
                    {p.ageLabel ? ` · ${p.ageLabel}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Edit ${p.name}`}
                  onClick={() => {
                    setEditing(p);
                    setOpen(true);
                  }}
                  className="flex h-9 w-9 items-center justify-center border border-line text-stone transition-colors hover:border-ink hover:text-ink"
                >
                  <Pencil size={13} strokeWidth={1.75} aria-hidden />
                </button>
              </div>
              <Link href={`/appointment?species=${p.species}`} className="link-arrow mt-4 !text-[9px]">
                BOOK FOR {p.name} <ArrowRight size={12} strokeWidth={2} aria-hidden />
              </Link>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="col-span-12 flex min-h-[220px] flex-col items-center justify-center gap-3 border border-dashed border-line text-stone transition-colors hover:border-ink hover:text-ink sm:col-span-6 xl:col-span-4"
        >
          <span className="flex h-12 w-12 items-center justify-center border border-current">
            <Plus size={18} strokeWidth={1.75} aria-hidden />
          </span>
          <span className="label !text-[9px]">ADD A COMPANION</span>
        </button>
      </div>

      {open && (
        <PetModal
          initial={editing}
          onClose={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

function PetModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: PetVm | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [f, setF] = useState({
    name: initial?.name ?? "",
    species: initial?.species ?? "dog",
    breed: initial?.breed ?? "",
    sex: initial?.sex ?? "",
    birthDate: "",
    weightKg: initial?.weightKg ?? "",
    notes: initial?.notes ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(initial ? `/api/pets/${initial.id}` : "/api/pets", {
        method: initial ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, birthDate: f.birthDate || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error?.message ?? "Could not save.");
        return;
      }
      onSaved();
    } catch {
      setError("The connection dropped. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!initial) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/pets/${initial.id}`, { method: "DELETE" });
      if (res.ok) onSaved();
      else setError("Could not remove this pet right now.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/45 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={initial ? `Edit ${initial.name}` : "Add a companion"}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-step-in max-h-[92svh] w-full max-w-xl overflow-y-auto border border-line bg-cream p-6 sm:p-9">
        <div className="flex items-start justify-between">
          <h2 className="text-[20px] font-extrabold uppercase tracking-tight">
            {initial ? `EDIT ${initial.name}` : "NEW COMPANION"}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center border border-line hover:border-ink">
            <X size={15} strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        <form onSubmit={save} className="mt-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="pn" className="field">NAME *</label>
              <input id="pn" className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value.toUpperCase() })} required />
            </div>
            <div>
              <label htmlFor="ps" className="field">SPECIES *</label>
              <select id="ps" className="input" value={f.species} onChange={(e) => setF({ ...f, species: e.target.value })}>
                {SPECIES_OPTS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pb" className="field">BREED</label>
              <input id="pb" className="input" value={f.breed} onChange={(e) => setF({ ...f, breed: e.target.value.toUpperCase() })} />
            </div>
            <div>
              <label htmlFor="px" className="field">SEX</label>
              <select id="px" className="input" value={f.sex} onChange={(e) => setF({ ...f, sex: e.target.value })}>
                <option value="">—</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
              </select>
            </div>
            <div>
              <label htmlFor="pd" className="field">BIRTH DATE</label>
              <input id="pd" type="date" className="input" value={f.birthDate} onChange={(e) => setF({ ...f, birthDate: e.target.value })} />
            </div>
            <div>
              <label htmlFor="pw" className="field">WEIGHT (KG)</label>
              <input id="pw" className="input" value={f.weightKg} onChange={(e) => setF({ ...f, weightKg: e.target.value })} inputMode="decimal" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="pnotes" className="field">NOTES — ALLERGIES, TEMPERAMENT…</label>
              <textarea id="pnotes" className="input min-h-[90px]" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-5 border border-alert/40 bg-[#f5e9e6] px-4 py-3 text-[13px] font-semibold text-alert">
              {error}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={busy} className="btn btn-dark">
              {busy ? "SAVING…" : initial ? "SAVE CHANGES" : "ADD COMPANION"}
            </button>
            {initial && (
              confirmDel ? (
                <button type="button" onClick={remove} disabled={busy} className="btn border-alert text-alert hover:bg-alert hover:text-cream">
                  <Trash2 size={13} strokeWidth={1.75} aria-hidden /> CONFIRM REMOVAL
                </button>
              ) : (
                <button type="button" onClick={() => setConfirmDel(true)} className="btn btn-ghost !text-stone hover:!text-alert hover:!border-alert">
                  REMOVE
                </button>
              )
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- appointments
const FILTERS = ["UPCOMING", "COMPLETED", "CANCELLED"] as const;

export function AppointmentsManager({ initial }: { initial: AppointmentCard[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("UPCOMING");
  const [reviewFor, setReviewFor] = useState<AppointmentCard | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const lists = useMemo(
    () => ({
      UPCOMING: initial.filter((a) => a.status === "booked"),
      COMPLETED: initial.filter((a) => a.status === "completed"),
      CANCELLED: initial.filter((a) => a.status === "cancelled" || a.status === "no_show"),
    }),
    [initial]
  );
  const list = lists[filter];

  async function cancel(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      if (res.ok) router.refresh();
      else {
        const d = await res.json();
        alert(d?.error?.message ?? "Could not cancel this appointment.");
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter appointments">
        {FILTERS.map((f) => (
          <button key={f} type="button" role="tab" aria-selected={filter === f} data-active={filter === f} onClick={() => setFilter(f)} className="chip">
            {f} <span className="tabular text-stone">{lists[f].length}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {list.length === 0 && (
          <div className="border border-dashed border-line px-8 py-14 text-center">
            <p className="label !text-[9px] text-stone">NOTHING HERE YET</p>
            <Link href="/appointment" className="btn btn-dark mt-6">
              BOOK A VISIT <ArrowRight size={13} strokeWidth={2} aria-hidden />
            </Link>
          </div>
        )}
        {list.map((a) => (
          <article key={a.id} className="grid grid-cols-12 items-center gap-5 border border-line bg-paper p-4 sm:p-5">
            <img src={a.petPhoto ?? ""} alt={a.petName} loading="lazy" className="col-span-3 aspect-square w-full object-cover sm:col-span-2 lg:col-span-1" />
            <div className="col-span-9 sm:col-span-4 lg:col-span-4">
              <p className="text-[16px] font-extrabold uppercase tracking-tight">{a.petName}</p>
              <p className="label mt-1 !text-[8.5px] text-stone">{a.serviceName}</p>
              <p className="mt-2.5 flex items-center gap-2 text-[11.5px] font-bold tracking-[0.1em] text-ink/75">
                <Calendar size={12} strokeWidth={1.75} aria-hidden />
                {humanShort(a.date)} · {a.startTime} — {a.endTime} · {a.doctorName}
              </p>
            </div>
            <div className="col-span-6 sm:col-span-3 lg:col-span-3">
              <span
                className={`inline-block px-3 py-1.5 text-[9px] font-bold tracking-[0.18em] ${
                  a.status === "booked"
                    ? "bg-forest text-cream"
                    : a.status === "completed"
                      ? "border border-line text-stone"
                      : "strike text-stone"
                }`}
              >
                {a.status === "booked" ? "UPCOMING" : a.status.toUpperCase().replace("_", " ")}
              </span>
              {a.review && (
                <div className="mt-2.5">
                  <Stars rating={a.review.rating} size={11} />
                  <p className="label mt-1 !text-[8px] text-stone">YOUR REVIEW — PENDING APPROVAL OR PUBLISHED</p>
                </div>
              )}
            </div>
            <div className="col-span-6 flex flex-wrap justify-end gap-2.5 sm:col-span-3 lg:col-span-4">
              {a.status === "completed" && !a.hasReview && (
                <button type="button" onClick={() => setReviewFor(a)} className="btn btn-ghost !px-4 !py-2.5 !text-[9px]">
                  <Star size={12} strokeWidth={1.75} aria-hidden /> LEAVE A REVIEW
                </button>
              )}
              {a.status === "booked" && (
                <button
                  type="button"
                  onClick={() => cancel(a.id)}
                  disabled={busyId === a.id}
                  className="btn btn-ghost !px-4 !py-2.5 !text-[9px] hover:!border-alert hover:!text-alert"
                >
                  {busyId === a.id ? "CANCELLING…" : "CANCEL"}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {reviewFor && (
        <ReviewModal
          appointment={reviewFor}
          onClose={() => setReviewFor(null)}
          onSaved={() => {
            setReviewFor(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

function ReviewModal({
  appointment,
  onClose,
  onSaved,
}: {
  appointment: AppointmentCard;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId: appointment.id, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error?.message ?? "Could not save the review.");
        return;
      }
      onSaved();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/45 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Review visit with ${appointment.doctorName}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-step-in w-full max-w-lg border border-line bg-cream p-6 sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="label !text-[8.5px] text-stone">{appointment.serviceName} · {humanLong(appointment.date)}</p>
            <h2 className="mt-2 text-[20px] font-extrabold uppercase tracking-tight">HOW WAS {appointment.doctorName}?</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-10 w-10 shrink-0 items-center justify-center border border-line hover:border-ink">
            <X size={15} strokeWidth={1.75} aria-hidden />
          </button>
        </div>

        <form onSubmit={save} className="mt-7">
          <div role="radiogroup" aria-label="Rating" className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onClick={() => setRating(n)}
                className={`flex h-12 w-12 items-center justify-center border transition-all ${
                  rating >= n ? "border-ink bg-ink text-cream" : "border-line hover:border-ink"
                }`}
              >
                <Star size={17} strokeWidth={1.5} className={rating >= n ? "fill-cream" : ""} aria-hidden />
              </button>
            ))}
          </div>
          <div className="mt-6">
            <label htmlFor="rc" className="field">YOUR WORDS *</label>
            <textarea
              id="rc"
              className="input min-h-[110px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="HOW DID IT GO FOR YOU AND YOUR COMPANION?"
              required
              minLength={10}
            />
          </div>
          {error && (
            <p role="alert" className="mt-5 border border-alert/40 bg-[#f5e9e6] px-4 py-3 text-[13px] font-semibold text-alert">
              {error}
            </p>
          )}
          <div className="mt-7 flex items-center gap-4">
            <button type="submit" disabled={busy} className="btn btn-dark">
              {busy ? "SAVING…" : "SUBMIT REVIEW"}
            </button>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone">
              PUBLISHED AFTER CLINIC APPROVAL
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- favorites
export function FavoriteButton({
  doctorId,
  initial,
  loggedIn,
}: {
  doctorId: string;
  initial: boolean;
  loggedIn: boolean;
}) {
  const router = useRouter();
  const [on, setOn] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!loggedIn) {
      router.push("/login?next=/account/favorites");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId }),
      });
      if (res.ok) {
        const d = await res.json();
        setOn(!!d.favorite);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={on}
      aria-label={on ? "Remove from saved doctors" : "Save doctor"}
      className={`flex h-11 w-11 items-center justify-center border transition-all ${
        on ? "border-ink bg-ink text-cream" : "border-line hover:border-ink"
      }`}
    >
      <Heart size={16} strokeWidth={1.75} className={on ? "fill-cream" : ""} aria-hidden />
    </button>
  );
}

// ---------------------------------------------------------------- settings
export function SettingsForms({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [profile, setProfile] = useState({ fullName: user.fullName, phone: user.phone ?? "" });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pMsg, setPMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setPMsg(null);
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "profile", ...profile }),
    });
    const d = await res.json();
    if (res.ok) {
      setPMsg({ ok: true, text: "Profile saved." });
      router.refresh();
    } else setPMsg({ ok: false, text: d?.error?.message ?? "Could not save." });
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (pw.next !== pw.confirm) {
      setPwMsg({ ok: false, text: "The two new passwords don't match." });
      return;
    }
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "password", current: pw.current, next: pw.next }),
    });
    const d = await res.json();
    if (res.ok) {
      setPwMsg({ ok: true, text: "Password updated." });
      setPw({ current: "", next: "", confirm: "" });
    } else setPwMsg({ ok: false, text: d?.error?.message ?? "Could not update password." });
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <form onSubmit={saveProfile}>
        <h2 className="text-[18px] font-extrabold uppercase tracking-tight">PROFILE</h2>
        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="sn" className="field">FULL NAME</label>
            <input id="sn" className="input" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value.toUpperCase() })} />
          </div>
          <div>
            <label htmlFor="sp" className="field">PHONE</label>
            <input id="sp" className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </div>
          <div>
            <label className="field">EMAIL — CANNOT BE CHANGED HERE</label>
            <p className="border border-line-soft bg-sand/50 px-4 py-3.5 text-[14px] font-semibold text-stone">{user.email}</p>
          </div>
        </div>
        {pMsg && <Msg {...pMsg} />}
        <button type="submit" className="btn btn-dark mt-7">SAVE PROFILE</button>
      </form>

      <form onSubmit={savePassword}>
        <h2 className="text-[18px] font-extrabold uppercase tracking-tight">PASSWORD</h2>
        <div className="mt-6 space-y-5">
          <div>
            <label htmlFor="pc" className="field">CURRENT PASSWORD</label>
            <input id="pc" type="password" className="input" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" required />
          </div>
          <div>
            <label htmlFor="pnw" className="field">NEW PASSWORD</label>
            <input id="pnw" type="password" className="input" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" minLength={8} required />
          </div>
          <div>
            <label htmlFor="pcf" className="field">REPEAT NEW PASSWORD</label>
            <input id="pcf" type="password" className="input" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" minLength={8} required />
          </div>
        </div>
        {pwMsg && <Msg {...pwMsg} />}
        <button type="submit" className="btn btn-dark mt-7">UPDATE PASSWORD</button>
      </form>
    </div>
  );
}

function Msg({ ok, text }: { ok: boolean; text: string }) {
  return (
    <p role="status" className={`mt-5 border px-4 py-3 text-[12.5px] font-semibold ${ok ? "border-forest/30 bg-sage/40 text-forest" : "border-alert/40 bg-[#f5e9e6] text-alert"}`}>
      {text}
    </p>
  );
}
