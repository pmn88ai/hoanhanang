import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { users } from "./schema";

async function seedOperator() {
  const email = process.env.OPERATOR_DEFAULT_EMAIL || "HoaNhaNang";
  const password = process.env.OPERATOR_DEFAULT_PASSWORD || "1234AbcD";

  const hash = await bcrypt.hash(password, 12);

  await db
    .insert(users)
    .values({
      email,
      passwordHash: hash,
      role: "operator",
      name: "Quản lý shop",
      isActive: true,
    })
    .onConflictDoNothing();

  console.log("✅ Operator account created:", email);
  process.exit(0);
}

seedOperator();
