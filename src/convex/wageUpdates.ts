import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("wageUpdates")
      .withIndex("by_effective")
      .collect();
    // newest effective date first
    return [...rows].reverse();
  },
});

export const add = mutation({
  args: {
    state: v.string(),
    effectiveDate: v.string(),
    category: v.string(),
    monthlyWage: v.number(),
    previousWage: v.optional(v.number()),
    source: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("wageUpdates", args);
  },
});

export const remove = mutation({
  args: { id: v.id("wageUpdates") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
