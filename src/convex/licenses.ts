import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("licenses").withIndex("by_renewal").collect();
  },
});

export const get = query({
  args: { id: v.id("licenses") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    licenseNumber: v.string(),
    authority: v.string(),
    category: v.union(v.literal("licence"), v.literal("registration")),
    issueDate: v.optional(v.string()),
    renewalDate: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("licenses", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("licenses"),
    name: v.optional(v.string()),
    licenseNumber: v.optional(v.string()),
    authority: v.optional(v.string()),
    category: v.optional(
      v.union(v.literal("licence"), v.literal("registration")),
    ),
    issueDate: v.optional(v.string()),
    renewalDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patch }) => {
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("licenses") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
