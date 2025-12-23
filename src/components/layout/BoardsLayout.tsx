import {
  Bell,
  HelpCircle,
  Home,
  LayoutDashboard,
  Trello,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { AuthSession } from "@/components/layout/session-components/AuthSession";

export function BoardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#1D1F23] text-[#E6E6E6]">
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#16181C] p-4 flex flex-col gap-4">
        <div className="text-2xl font-bold">☰</div>
        <nav>
          <Link
            href="#"
            className="flex items-center gap-2 p-2.5 rounded-md bg-[#23262D] text-white"
          >
            <LayoutDashboard className="h-4 w-4" />
            Quadros
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 p-2.5 rounded-md text-[#CFD3DC] hover:bg-[#23262D] hover:text-white"
          >
            <Trello className="h-4 w-4" />
            Templates
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 p-2.5 rounded-md text-[#CFD3DC] hover:bg-[#23262D] hover:text-white"
          >
            <Home className="h-4 w-4" />
            Início
          </Link>
        </nav>
        <button className="mt-auto bg-transparent border border-dashed border-[#3A3F4B] text-[#CFD3DC] p-2.5 rounded-md cursor-pointer hover:bg-[#23262D]">
          + Criar Área de trabalho
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-14 bg-[#16181C] flex items-center gap-3 px-4 border-b border-[#2A2E36]">
          <input
            type="text"
            placeholder="Pesquisar"
            className="flex-1 bg-[#23262D] border-none py-2 px-3 rounded-md text-white placeholder:text-gray-400"
          />
          <button className="bg-[#579DFF] border-none text-black py-2 px-3.5 rounded-md cursor-pointer font-semibold hover:bg-blue-500">
            Criar
          </button>
          <div className="flex items-center gap-3 text-xl text-gray-300">
            <Bell className="h-5 w-5 cursor-pointer hover:text-white" />
            <HelpCircle className="h-5 w-5 cursor-pointer hover:text-white" />
          </div>
          <AuthSession />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
