import {
  text,
  integer,
  sqliteTable,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const releases = sqliteTable(
  "releases",
  {
    url: text("url"),
    assets_url: text("assets_url"),
    upload_url: text("upload_url"),
    html_url: text("html_url"),
    id: integer("id").primaryKey().notNull(),
    author: text("author", { mode: "json" }),
    node_id: text("node_id"),
    tag_name: text("tag_name"),
    target_commitish: text("target_commitish"),
    name: text("name").primaryKey(),
    draft: integer("draft"),
    prerelease: integer("prerelease"),
    created_at: text("created_at"),
    published_at: text("published_at"),
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    assets: text("assets", { mode: "json" }).$type<Array<any>>(),
    tarball_url: text("tarball_url"),
    zipball_url: text("zipball_url"),
    body: text("body"),
    reactions: text("reactions", { mode: "json" }),
    mentions_count: integer("mentions_count"),
  },
  (table) => {
    return {
      prereleaseIdx: index("prerelease").on(table.prerelease),
      draftIdx: index("draft").on(table.draft),
      createdAtIdx: uniqueIndex("created_at").on(table.created_at),
    };
  },
);
