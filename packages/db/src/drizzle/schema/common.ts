import { mysqlTable, serial, timestamp, varchar } from "drizzle-orm/mysql-core";
import { nanoid } from "nanoid";

const commonFields = {
  id: serial("id").primaryKey().autoincrement(),
  customerId: varchar("customer_id", { length: 128 }).notNull(),
  publicId: varchar("public_id", { length: 21 }).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
};

export const buildMysqlTable = <T extends object>(name: string, fields: T) => {
  return mysqlTable(name, {
    ...commonFields,
    ...fields,
  });
};

export const generatePublicId = (prefix: "src" | "dst" | "con") => {
  return `${prefix}_${nanoid(17)}`;
};
