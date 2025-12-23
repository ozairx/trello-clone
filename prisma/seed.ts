import { db } from "../src/lib/db";

async function main() {
  const testUser = await db.user.upsert({
    where: { email: "test@example.com" },
    update: {
      username: "testuser",
    },
    create: {
      name: "Test User",
      email: "test@example.com",
      username: "testuser",
    },
  });

  console.log({ testUser });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
