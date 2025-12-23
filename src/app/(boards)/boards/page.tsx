import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function BoardsRedirectPage() {
  const session = await getSession();

  if (!session?.user) {
    return redirect("/login");
  }

  if (!session.user.username) {
    return redirect("/account-setup-required");
  }

  const userName = session.user.username;
  redirect(`/u/${userName}/boards`);
}
