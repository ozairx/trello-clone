import { db } from "../src/lib/db";

async function main() {
  // 1. Create/Upsert testUser
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

  // 2. Create/Upsert a default Workspace for testUser
  const testWorkspace = await db.workspace.upsert({
    where: { name: "My First Workspace" },
    update: {},
    create: {
      name: "My First Workspace",
      ownerId: testUser.id,
      members: {
        create: {
          userId: testUser.id,
          role: "ADMIN",
        },
      },
    },
  });

  // 3. Create sample Boards for testWorkspace
  await db.board.upsert({
    where: {
      title_workspaceId: {
        title: "Board 1",
        workspaceId: testWorkspace.id,
      },
    },
    update: {},
    create: {
      title: "Board 1",
      workspaceId: testWorkspace.id,
    },
  });

  await db.board.upsert({
    where: {
      title_workspaceId: {
        title: "Board 2",
        workspaceId: testWorkspace.id,
      },
    },
    update: {},
    create: {
      title: "Board 2",
      workspaceId: testWorkspace.id,
    },
  });

  console.log({ testUser, testWorkspace });
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
