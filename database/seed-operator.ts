import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { users } from "./schema";

async function seedOperator() {
  const email = "operator@shop.com";
  const password = "ChangeMe123!";

  const hash = await bcrypt.hash(password, 12);

  await db
    .insert(users)
    .values({
      email,
      passwordHash: hash,
      role: "operator",
      name: "Chủ cửa hàng",
      isActive: true,
    })
    .onConflictDoNothing();

  console.log("✅ Operator account created:", email);
  process.exit(0);
}

seedOperator();
