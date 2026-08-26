import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("filings").withIndex("by_due").collect();
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    type: v.union(
      v.literal("challan"),
      v.literal("return"),
      v.literal("receipt"),
    ),
    period: v.string(),
    dueDate: v.string(),
    amount: v.optional(v.number()),
    referenceNo: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("filings", args);
  },
});

/** Mark a filing as filed/paid (optionally with its receipt reference). */
export const markFiled = mutation({
  args: {
    id: v.id("filings"),
    filedDate: v.string(),
    referenceNo: v.optional(v.string()),
  },
  handler: async (ctx, { id, filedDate, referenceNo }) => {
    await ctx.db.patch(id, { filedDate, ...(referenceNo ? { referenceNo } : {}) });
  },
});

export const remove = mutation({
  args: { id: v.id("filings") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
