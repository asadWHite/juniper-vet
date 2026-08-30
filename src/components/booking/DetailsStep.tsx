"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import type { Answers, PetVm, SessionUser } from "@/types";
import { humanLong } from "@/lib/dates";

interface Selection {
  service: string;
  doctor: string;
  date: string;
  time: string;
  duration: number;
}

interface Props {
  user: SessionUser | null;
  pets: PetVm[];
  answers: Answers;
  selection: Selection;
  submitting: boolean;
  onSubmit: (payload: {
    petName: string;
    breed: string;
    petId: string | null;
    name: string;
    email: string;
    phone: string;
    notes: string;
  }) => void;
}

export function DetailsStep({ user, pets, answers, selection, submitting, onSubmit }: Props) {
  const species = String(answers.species ?? "dog");
  const myMatching = pets.filter((p) => p.species === species);
  const [petId, setPetId] = useState<string | null>(myMatching[0]?.id ?? null);
  const [petName, setPetName] = useState(myMatching[0]?.name ?? "");
  const [breed, setBreed] = useState(myMatching[0]?.breed ?? "");
  const [name, setName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [notes, setNotes] = useState("");
  const [touched, setTouched] = useState(false);

  const valid = petName.trim() && name.trim() && /.+@.+\..+/.test(email) && phone.trim();

  return (
    <div className="max-w-3xl">
      <p className="label text-stone">FINALLY — WHO ARE YOU?</p>
      <h1 className="display-3 mt-6">A FEW DETAILS.</h1>

      {/* recap */}
      <div className="mt-8 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-5">
        {[
          ["VISIT", selection.service],
          ["DOCTOR", selection.doctor],
          ["DATE", humanLong(selection.date)],
          ["TIME", `${selection.time}`],
          ["DURATION", `${selection.duration} MIN`],
        ].map(([k, v]) => (
          <div key={k} className="bg-paper px-4 py-3.5">
            <p className="label !text-[8px] text-stone">{k}</p>
            <p className="mt-1 text-[11.5px] font-extrabold uppercase tracking-wide leading-snug">{v}</p>
          </div>
        ))}
      </div>

      <form
        className="mt-10"
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (valid) onSubmit({ petName, breed, petId, name, email, phone, notes });
        }}
      >
        {/* their pets */}
        {myMatching.length > 0 && (
          <fieldset className="mb-8">
            <legend className="field">YOUR {species.toUpperCase()}S ON FILE</legend>
            <div className="flex flex-wrap gap-2.5">
              {myMatching.map((p) => {
                const on = petId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setPetId(p.id);
                      setPetName(p.name);
                      setBreed(p.breed ?? "");
                    }}
                    className={`flex items-center gap-3 border px-4 py-2.5 transition-all ${
                      on ? "border-ink bg-ink text-cream" : "border-line hover:border-ink"
                    }`}
                  >
                    {on && <Check size={13} strokeWidth={2.5} aria-hidden />}
                    <span className="text-[11.5px] font-extrabold uppercase tracking-[0.1em]">{p.name}</span>
                    {p.breed && <span className={`text-[9px] font-bold tracking-[0.14em] ${on ? "text-cream/60" : "text-stone"}`}>{p.breed}</span>}
                  </button>
                );
              })}
              <button
                type="button"
                aria-pressed={petId === null}
                onClick={() => {
                  setPetId(null);
                  setPetName("");
                  setBreed("");
                }}
                className={`border px-4 py-2.5 text-[11.5px] font-extrabold uppercase tracking-[0.1em] transition-all ${
                  petId === null ? "border-ink bg-ink text-cream" : "border-line hover:border-ink"
                }`}
              >
                NEW / DIFFERENT COMPANION
              </button>
            </div>
          </fieldset>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="petName" className="field">THEIR NAME *</label>
            <input id="petName" className="input" value={petName} onChange={(e) => setPetName(e.target.value.toUpperCase())} placeholder="REX" autoComplete="off" />
          </div>
          <div>
            <label htmlFor="breed" className="field">BREED — OPTIONAL</label>
            <input id="breed" className="input" value={breed} onChange={(e) => setBreed(e.target.value.toUpperCase())} placeholder="LABRADOR RETRIEVER" autoComplete="off" />
          </div>
          <div>
            <label htmlFor="name" className="field">YOUR NAME *</label>
            <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value.toUpperCase())} placeholder="FULL NAME" autoComplete="name" />
          </div>
          <div>
            <label htmlFor="phone" className="field">PHONE *</label>
            <input id="phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 …" autoComplete="tel" inputMode="tel" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="field">EMAIL *</label>
            <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="notes" className="field">ANYTHING WE SHOULD KNOW?</label>
            <textarea
              id="notes"
              className="input min-h-[110px] resize-y"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="NERVOUS AROUND OTHER DOGS · CURRENT MEDICATION · PREVIOUS RECORDS AT ANOTHER CLINIC…"
            />
          </div>
        </div>

        {touched && !valid && (
          <p role="alert" className="mt-5 text-[12px] font-bold uppercase tracking-[0.12em] text-alert">
            PLEASE FILL NAME, PHONE, A VALID EMAIL — AND YOUR COMPANION&rsquo;S NAME.
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <button type="submit" disabled={submitting} className="btn btn-dark !px-10">
            {submitting ? "CONFIRMING…" : "CONFIRM BOOKING"} <ArrowRight size={14} strokeWidth={2} aria-hidden />
          </button>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone">
            FREE CANCELLATION UP TO 4H BEFORE · WE CONFIRM BY {email ? "EMAIL" : "MESSAGE"}
          </p>
        </div>
      </form>
    </div>
  );
}
