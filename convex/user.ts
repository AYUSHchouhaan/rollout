import {v} from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
    args: { 
        name: v.string(),
        email: v.string(),
        image: v.string(),
        uuid:v.string()

    },
    handler: async (ctx,args) => {
        const existingUser = await ctx.db.query("users").filter((q) => q.eq(q.field('email'),args.email)).collect();
        if (existingUser.length > 0) {
            return existingUser[0]; // Return the first user, not the array
        }
        const userId = await ctx.db.insert("users", {
            name: args.name,
            email: args.email,
            image: args.image,
            uuid:args.uuid,
            messagecount:10
        });
        
        // Return the full user object with _id
        return {
            _id: userId,
            name: args.name,
            email: args.email,
            image: args.image,
            uuid: args.uuid,
            messagecount: 10
        };

}});


export const GetUser = query({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const existingUser = await ctx.db.query("users").filter((q) => q.eq(q.field('email'),args.email)).collect();

        return existingUser[0];
    }
});

export const updateMessageCount = mutation({
    args: {
        messagecount: v.number(),
        userid: v.id("users"), 
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.patch(args.userid, {
            messagecount: args.messagecount
        });
        return result;
    }
});
