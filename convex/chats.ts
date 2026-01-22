import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createchat = mutation({
    args: {
         messages: v.any(),
         user: v.id("users"),
    },
    handler: async (ctx, args) => {
        const { messages, user } = args;
        // Create the chat in the database
        const chatid = await ctx.db.insert("chats", {
            messages: args.messages,
            user: args.user
        });
        return chatid;
    },
});

export const getchats = query({
    args: {
         chatid: v.id("chats"),
    },
    handler: async (ctx, args) => {
        const { chatid } = args;
        // Fetch chats for the given user from the database
        const chats = await ctx.db.get(args.chatid);
        return chats;
    },
});



export const updatemessages = mutation({
    args: {
            chatid: v.id("chats"),
            messages: v.any(),
        },
    handler:async (ctx, args) => {
        const result = await ctx.db.patch(args.chatid, {
            messages: args.messages
        });
        return result;
    }
});



export const updatefiles = mutation({
    args: {
            chatid: v.id("chats"),
            files: v.any(),
        },
    handler:async (ctx, args) => {
        const result = await ctx.db.patch(args.chatid, {
            files: args.files
        });
        return result;
    }
});

export const getuserchats = query({
    args: {
         userid: v.id("users"),
    },
    handler: async (ctx, args) => {
        const result =  await ctx.db.query("chats")
        .filter(q=>q.eq(q.field("user"), args.userid))
        .collect();
        
        return result;
    },
});