import { and, asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

export interface StoredMessage {
  role: string;
  content: string;
  createdAt: Date;
}

function rowKey(userId: string, lessonPath: string) {
  return and(
    eq(schema.lessonChatMessage.userId, userId),
    eq(schema.lessonChatMessage.lessonPath, lessonPath),
  );
}

export async function loadConversation(
  userId: string,
  lessonPath: string,
): Promise<StoredMessage[]> {
  const db = await getDb();
  return db
    .select({
      role: schema.lessonChatMessage.role,
      content: schema.lessonChatMessage.content,
      createdAt: schema.lessonChatMessage.createdAt,
    })
    .from(schema.lessonChatMessage)
    .where(rowKey(userId, lessonPath))
    .orderBy(asc(schema.lessonChatMessage.seq));
}

export async function appendMessage(
  userId: string,
  lessonPath: string,
  role: "user" | "assistant",
  content: string,
): Promise<void> {
  const db = await getDb();
  await db
    .insert(schema.lessonChatMessage)
    .values({ userId, lessonPath, role, content });
}

export async function clearConversation(
  userId: string,
  lessonPath: string,
): Promise<void> {
  const db = await getDb();
  await db.delete(schema.lessonChatMessage).where(rowKey(userId, lessonPath));
}
