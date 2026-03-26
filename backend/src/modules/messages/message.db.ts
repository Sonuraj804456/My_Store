import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  pgEnum,
} from "drizzle-orm/pg-core";
import { db } from "../../config/db";
import { eq, and, isNull } from "drizzle-orm";

export const messageSenderRoleEnum = pgEnum("message_sender_role", [
  "CREATOR",
  "BUYER",
  "ADMIN",
]);

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull(),
  storeId: uuid("store_id").notNull(),
  creatorId: varchar("creator_id", { length: 255 }).notNull(),
  buyerId: uuid("buyer_id"),
  buyerEmail: varchar("buyer_email", { length: 255 }).notNull(),
  isDisputed: boolean("is_disputed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id").notNull(),
  senderRole: messageSenderRoleEnum("sender_role").notNull(),
  senderId: varchar("sender_id", { length: 255 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const messageDb = {
  findConversationByOrderId: (orderId: string) =>
    db.query.conversations.findFirst({
      where: eq(conversations.orderId, orderId),
    }),

  createConversation: (data: any) =>
    db.insert(conversations).values(data).returning(),

  findConversationById: (conversationId: string) =>
    db.query.conversations.findFirst({
      where: eq(conversations.id, conversationId),
    }),

  listConversationsByStore: (storeId: string) =>
    db.query.conversations.findMany({
      where: eq(conversations.storeId, storeId),
    }),

  listConversationsByFilter: (filter: any) =>
    db.query.conversations.findMany({
      where: (table) => {
        let condition: any = undefined;

        if (filter.isDisputed !== undefined) {
          const disputed = filter.isDisputed === "true" || filter.isDisputed === true;
          condition = eq(conversations.isDisputed, disputed);
        }

        if (filter.storeId) {
          const storeCond = eq(conversations.storeId, filter.storeId);
          condition = condition ? and(condition, storeCond) : storeCond;
        }

        return condition;
      },
    }),

  setDispute: (conversationId: string, status: boolean) =>
    db.update(conversations).set({ isDisputed: status, updatedAt: new Date() }).where(eq(conversations.id, conversationId)),

  createMessage: (data: any) =>
    db.insert(messages).values(data).returning(),

  listMessagesByConversation: (conversationId: string) =>
    db.query.messages.findMany({
      where: and(eq(messages.conversationId, conversationId), isNull(messages.deletedAt)),
    }),

  findMessageById: (messageId: string) =>
    db.query.messages.findFirst({
      where: eq(messages.id, messageId),
    }),

  softDeleteMessage: (messageId: string) =>
    db.update(messages).set({ deletedAt: new Date() }).where(eq(messages.id, messageId)),
};
