import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
export const cats = sqliteTable('cats', { id: text('id').primaryKey(), owner: text('owner').notNull(), names: text('names').notNull(), location: text('location').notNull(), notes: text('notes').notNull(), photos: text('photos').notNull(), created: text('created').notNull() }, t => [index('idx_cats_owner').on(t.owner)]);
