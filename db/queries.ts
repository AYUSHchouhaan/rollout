import { db } from "./drizzleclient";
import { users, chats, User, NewUser, Chat, NewChat } from "./schema";
import { eq, desc } from "drizzle-orm";

// User queries
export async function createUser(userData: {
  email: string;
  name: string;
  image: string;
  uuid: string;
}) {
  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, userData.email))
    .limit(1);

  if (existingUser.length > 0) {
    return existingUser[0];
  }

  // Create new user
  const [newUser] = await db
    .insert(users)
    .values({
      ...userData,
      messagecount: 10,
    })
    .returning();

  return newUser;
}

export async function getUser(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user;
}

export async function updateMessageCount(userId: number, messagecount: number) {
  const [updatedUser] = await db
    .update(users)
    .set({ messagecount })
    .where(eq(users.id, userId))
    .returning();

  return updatedUser;
}

// Chat queries
export async function createChat(chatData: {
  messages: any;
  userId: number;
}) {
  const [newChat] = await db
    .insert(chats)
    .values({
      messages: chatData.messages,
      userId: chatData.userId,
    })
    .returning();

  return newChat;
}

export async function getChat(chatId: number) {
  const [chat] = await db
    .select()
    .from(chats)
    .where(eq(chats.id, chatId))
    .limit(1);

  return chat;
}

export async function updateMessages(chatId: number, messages: any) {
  const [updatedChat] = await db
    .update(chats)
    .set({ 
      messages,
      updatedAt: new Date(),
    })
    .where(eq(chats.id, chatId))
    .returning();

  return updatedChat;
}

export async function updateFiles(chatId: number, files: any) {
  const [updatedChat] = await db
    .update(chats)
    .set({ 
      files,
      updatedAt: new Date(),
    })
    .where(eq(chats.id, chatId))
    .returning();

  return updatedChat;
}

export async function getUserChats(userId: number) {
  const userChats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId))
    .orderBy(desc(chats.createdAt));

  return userChats;
}
