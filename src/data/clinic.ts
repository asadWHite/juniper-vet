// ---------------------------------------------------------------------------
// CLINIC IDENTITY — PLACEHOLDER DATA
// The real clinic name, address, phone, hours and pricing are not yet known.
// Replace every value in this file with verified clinic information.
// ---------------------------------------------------------------------------

export const clinic = {
  name: "JUNIPER VETERINARY CLINIC",
  brand: "JUNIPER",
  suffix: "VET.",
  tagline: "CARE FOR EVERY LITTLE LIFE.",
  established: "EST. 2012",

  // PLACEHOLDER contact details — replace with the real ones.
  phoneDisplay: "+1 (555) 013-4420",
  phoneHref: "tel:+15550134420",
  email: "care@juniper-vet.example",
  address: {
    line1: "214 LINDEN ROW",
    line2: "PORTLAND, OR 97205",
  },
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("214 Linden Row, Portland, OR 97205"),

  // PLACEHOLDER opening hours shown in footer / emergency pages.
  hours: [
    { days: "MONDAY — FRIDAY", time: "09:00 — 18:00" },
    { days: "SATURDAY", time: "10:00 — 15:00" },
    { days: "SUNDAY", time: "CLOSED" },
  ],

  // Honesty note rendered in small print wherever demo content is shown.
  demoNote:
    "Demonstration content. Names, credentials and figures are placeholders pending real clinic data.",
} as const;
