import { getBoardsAction } from "@/lib/actions/board-actions";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateBoardForm } from "@/components/forms/CreateBoardForm";

export default async function UserBoardsPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const { data: boards, error } = await getBoardsAction(username);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Boards</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards && boards.map((board) => (
          <Card key={board.id}>
            <CardHeader>
              <CardTitle>{board.title}</CardTitle>
            </CardHeader>
          </Card>
        ))}
        <CreateBoardForm />
      </div>
    </div>
  );
}
