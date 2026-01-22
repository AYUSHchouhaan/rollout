import {v} from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
    users: defineTable({ 
        email: v.string(),
        name: v.string(),
        image: v.string(),
        uuid:v.string(),
        messagecount: v.optional(v.number())
    }),
    chats: defineTable({
        messages: v.any(),
        user:v.id("users"),
        files: v.optional(v.any()),
})
});