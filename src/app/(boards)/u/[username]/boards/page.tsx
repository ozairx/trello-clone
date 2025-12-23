import { getBoardsAction } from "@/lib/actions/board-actions";
import { CreateBoardForm } from "@/components/forms/CreateBoardForm";
import { BoardsLayout } from "@/components/layout/BoardsLayout";
import Link from "next/link";
import { db } from "@/lib/db"; // Import db

const TemplateCard = ({ title }: { title: string }) => (
  <div className="relative h-[120px] rounded-lg bg-gradient-to-br from-[#2A2E36] to-[#1F2229] p-4">
    <span className="absolute top-3 left-3 rounded bg-white/15 px-1.5 py-1 text-xs font-semibold">
      TEMPLATE
    </span>
    <h3 className="text-white font-bold mt-6">{title}</h3>
  </div>
);

export default async function UserBoardsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  // Fetch user with workspaces to get workspaceId
  const user = await db.user.findUnique({
    where: { username },
    include: {
      workspaces: true, // Just need the workspace ID
    },
  });

  if (!user) {
    return <p className="text-red-500 p-6">User not found.</p>;
  }

  // Get the ID of the first workspace (for simplicity for now)
  const currentWorkspaceId =
    user.workspaces.length > 0 ? user.workspaces[0].workspaceId : null;

  // Now fetch boards for this user using the updated action
  const { data: boards, error } = await getBoardsAction(username);

  if (error) {
    return <p className="text-red-500 p-6">{error}</p>;
  }

  return (
    <BoardsLayout>
      <div className="p-6 max-w-[1100px]">
        <h2 className="text-2xl font-bold text-white">
          Templates mais populares
        </h2>
        <p className="text-[#9AA1AC] mb-4">
          Comece a produzir mais rapidamente com um template da comunidade
        </p>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 mb-8">
          <TemplateCard title="Kanban Quadro Modelo" />
          <TemplateCard title="Central de Organização" />
          <TemplateCard title="Sistema de Produtividade" />
        </div>

        <h3 className="mt-6 text-sm tracking-[0.04em] text-[#9AA1AC] font-bold">
          SUAS ÁREAS DE TRABALHO
        </h3>

        {boards && boards.length > 0 ? (
          <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {boards.map((board) => (
              <Link
                href={`/b/${board.id}`}
                key={board.id}
                className="block relative h-[120px] rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors p-4"
              >
                <h3 className="font-bold text-white">{board.title}</h3>
              </Link>
            ))}
            {currentWorkspaceId && (
              <CreateBoardForm workspaceId={currentWorkspaceId} />
            )}
          </div>
        ) : (
          <div className="mt-4 text-[#9AA1AC]">
            Você ainda não é membro de nenhuma Área de trabalho.{" "}
            <button className="text-[#579DFF] underline">
              Criar uma Área de trabalho
            </button>
            {currentWorkspaceId && (
              <CreateBoardForm workspaceId={currentWorkspaceId} />
            )}
          </div>
        )}

        <button className="mt-4 bg-[#23262D] border-none text-[#CFD3DC] py-2.5 px-3.5 rounded-md cursor-pointer hover:bg-opacity-80">
          Ver todos os quadros fechados
        </button>
      </div>
    </BoardsLayout>
  );
}
