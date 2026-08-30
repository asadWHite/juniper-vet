import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  serial,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

// --- identity ---------------------------------------------------------------
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  token: text("token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  token: text("token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- catalog ----------------------------------------------------------------
export const doctors = pgTable("doctors", {
  id: text("id").primaryKey(), // slug
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  bio: text("bio").notNull(),
  photoUrl: text("photo_url").notNull(),
  focus: text("focus").array().notNull(),
  languages: text("languages").array().notNull(),
  active: boolean("active").notNull().default(true),
});

export const services = pgTable("services", {
  id: text("id").primaryKey(), // slug
  name: text("name").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  priceLabel: text("price_label").notNull(),
  preparation: text("preparation").array().notNull(),
  imageUrl: text("image_url").notNull(),
  sortIndex: integer("sort_index").notNull().default(0),
});

export const doctorServices = pgTable(
  "doctor_services",
  {
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctors.id, { onDelete: "cascade" }),
    serviceId: text("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.doctorId, t.serviceId] })]
);

export const doctorSchedules = pgTable(
  "doctor_schedules",
  {
    id: serial("id").primaryKey(),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctors.id, { onDelete: "cascade" }),
    dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday
    startTime: text("start_time").notNull(), // "HH:MM"
    endTime: text("end_time").notNull(),
    breakStart: text("break_start"),
    breakEnd: text("break_end"),
  },
  (t) => [index("sched_doctor_day").on(t.doctorId, t.dayOfWeek)]
);

export const blockedSlots = pgTable(
  "blocked_slots",
  {
    id: serial("id").primaryKey(),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctors.id, { onDelete: "cascade" }),
    date: text("date").notNull(), // YYYY-MM-DD
    startTime: text("start_time").notNull(),
    endTime: text("end_time").notNull(),
    reason: text("reason"),
  },
  (t) => [index("blocked_doctor_date").on(t.doctorId, t.date)]
);

// --- patients ---------------------------------------------------------------
export const pets = pgTable("pets", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  species: text("species").notNull(), // dog | cat | rabbit | bird | other
  breed: text("breed"),
  sex: text("sex"),
  birthDate: text("birth_date"),
  ageLabel: text("age_label"),
  weightKg: text("weight_kg"),
  notes: text("notes"),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// --- appointments -----------------------------------------------------------
export const appointments = pgTable(
  "appointments",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    petId: text("pet_id").references(() => pets.id, { onDelete: "set null" }),
    // denormalized snapshot so guest bookings work and history survives edits
    petName: text("pet_name").notNull(),
    petSpecies: text("pet_species").notNull(),
    petMeta: text("pet_meta"),
    guestName: text("guest_name"),
    guestEmail: text("guest_email"),
    guestPhone: text("guest_phone"),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctors.id),
    serviceId: text("service_id")
      .notNull()
      .references(() => services.id),
    date: text("date").notNull(), // YYYY-MM-DD
    startTime: text("start_time").notNull(), // HH:MM
    endTime: text("end_time").notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    status: text("status").notNull().default("booked"), // booked | completed | cancelled | no_show
    notes: text("notes"),
    questionnaire: jsonb("questionnaire"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("appt_doctor_date").on(t.doctorId, t.date), index("appt_user").on(t.userId)]
  // NOTE: a partial UNIQUE INDEX on (doctor_id, date, start_time)
  // WHERE status <> 'cancelled' is created by the seed (`lib/seed.ts`) —
  // together with the transactional overlap check this prevents double
  // booking even under racing requests.
);

// --- reviews / favorites ----------------------------------------------------
export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  appointmentId: text("appointment_id")
    .notNull()
    .unique()
    .references(() => appointments.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  doctorId: text("doctor_id")
    .notNull()
    .references(() => doctors.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  authorLabel: text("author_label").notNull(),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const favorites = pgTable(
  "favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctors.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.doctorId] })]
);

// --- medical history architecture -------------------------------------------
export const vaccinations = pgTable("vaccinations", {
  id: text("id").primaryKey(),
  petId: text("pet_id")
    .notNull()
    .references(() => pets.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  administeredOn: text("administered_on"),
  dueOn: text("due_on"),
  status: text("status").notNull().default("scheduled"), // done | due | overdue
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const medicalRecords = pgTable("medical_records", {
  id: text("id").primaryKey(),
  petId: text("pet_id")
    .notNull()
    .references(() => pets.id, { onDelete: "cascade" }),
  appointmentId: text("appointment_id").references(() => appointments.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  recordedOn: text("recorded_on").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  petId: text("pet_id")
    .notNull()
    .references(() => pets.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  kind: text("kind").notNull().default("document"), // document | photo
  url: text("url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
