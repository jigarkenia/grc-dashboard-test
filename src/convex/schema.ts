import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // GRC tool v1 tables

    licenses: defineTable({
      name: v.string(),
      licenseNumber: v.string(),
      authority: v.string(), // issuing authority e.g. Labour Dept, GST, FSSAI
      category: v.union(v.literal("licence"), v.literal("registration")),
      issueDate: v.optional(v.string()), // yyyy-mm-dd
      renewalDate: v.string(), // yyyy-mm-dd
      notes: v.optional(v.string()),
    }).index("by_renewal", ["renewalDate"]),

    wageUpdates: defineTable({
      state: v.string(),
      effectiveDate: v.string(), // yyyy-mm-dd
      category: v.string(), // e.g. Unskilled / Semi-skilled / Skilled
      monthlyWage: v.number(),
      previousWage: v.optional(v.number()),
      source: v.optional(v.string()),
      notes: v.optional(v.string()),
    }).index("by_effective", ["effectiveDate"]),

    filings: defineTable({
      title: v.string(),
      type: v.union(
        v.literal("challan"),
        v.literal("return"),
        v.literal("receipt"),
      ),
      period: v.string(), // e.g. "Aug 2026", "Q1 FY26"
      dueDate: v.string(), // yyyy-mm-dd
      filedDate: v.optional(v.string()), // set when filed/paid
      amount: v.optional(v.number()),
      referenceNo: v.optional(v.string()),
      notes: v.optional(v.string()),
    }).index("by_due", ["dueDate"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
