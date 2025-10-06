import { pgTable, text, uuid, integer, boolean, timestamp, serial, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const users = pgTable("users", {
  id: text("id").primaryKey(), 
  userName: varchar("userName", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
});



export const files = pgTable("files", {
    id: uuid("id").defaultRandom().primaryKey(),

    // basic file/folder info
    name: text("name").notNull(),
    path: text("path").notNull(),
    size: integer("size").notNull(),
    type: text("type").notNull(), // "folder, etc"

    // storageInfo
    fileUrl: text("file_url").notNull(), // url to acess file
    thumbnailUrl: text("thumbnail_url"),

    // ownership info
    userId: text("user_id").notNull(),
    parentId: uuid("parent_id"), // parent folder id (null for root item)

    // file/folder flag
    isFolder: boolean("is_folder").default(false).notNull(),
    isStarred: boolean("is_starred").default(false).notNull(),
    isTrash: boolean("is_trash").default(false).notNull(),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    upadtedAt: timestamp("updated_at").defaultNow().notNull(),
})

/*
Parent: Each file/folder can have one parent folder
Children: Each folder can have many file/folder
*/

export const fileRelations = relations(files, ({one, many}) => ({
    parent: one(files, {
        fields: [files.parentId],
        references: [files.id]
    }),

    // relationship to child file/folder
    children: many(files)
}))

// Type definations

export const File = typeof files.$inferSelect;
export const NewFile = typeof files.$inferInsert;