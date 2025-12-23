"use client";

import { env } from "@/env";
import { signIn } from "next-auth/react";
import TrelloLogo from "@/components/icons/TrelloLogo";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function LoginForm() {
  return (
    <div className="min-h-screen grid place-items-center bg-[#F4F5F7] font-sans">
      <div className="bg-white w-[380px] p-8 rounded-lg shadow-lg text-[#172B4D]">
        <div className="flex items-center justify-center gap-2 mb-6">
          <TrelloLogo />
        </div>

        <h1 className="text-lg text-center font-semibold mb-6">
          Entre para continuar
        </h1>

        <form>
          <label htmlFor="email" className="text-sm font-semibold">
            E-mail <span className="text-[#DE350B]">*</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="Insira seu e-mail"
            className="w-full mt-1.5 mb-3.5 p-2 border border-[#DFE1E6] rounded-[3px] focus:outline-none focus:border-[#0052CC]"
            required
          />

          <div className="flex items-center gap-2 text-sm mb-4">
            <input type="checkbox" id="keep" />
            <label htmlFor="keep">Continuar conectado</label>
            <span className="w-4 h-4 bg-[#6554C0] text-white rounded-full grid place-items-center text-[11px] font-bold cursor-pointer">
              i
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0052CC] text-white p-2 rounded-[3px] font-semibold cursor-pointer hover:bg-[#0052cc]/90"
          >
            Continuar
          </button>
        </form>

        <div className="text-center text-[#6B778C] text-xs my-4">
          Ou continue com:
        </div>

        <div className="grid gap-2.5">
          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-2 bg-white border border-[#DFE1E6] p-2 rounded-[3px] cursor-pointer font-medium hover:bg-[#F4F5F7]"
          >
            <FcGoogle size={20} />
            Google
          </button>
          <button
            onClick={() => signIn("github")}
            className="w-full flex items-center justify-center gap-2 bg-white border border-[#DFE1E6] p-2 rounded-[3px] cursor-pointer font-medium hover:bg-[#F4F5F7]"
          >
            <FaGithub size={20} />
            GitHub
          </button>

          {env.NEXT_PUBLIC_ENABLE_TEST_LOGIN && (
            <button
              type="button"
              className="w-full text-sm text-[#0052CC] underline cursor-pointer hover:no-underline mt-2"
              onClick={() =>
                signIn("credentials", { email: "test@example.com" })
              }
            >
              Fazer login (teste)
            </button>
          )}
        </div>

        <div className="text-center text-sm my-4">
          <a href="#" className="text-[#0052CC] underline hover:no-underline">
            Não consegue entrar?
          </a>
          <span className="mx-1">·</span>
          <a href="#" className="text-[#0052CC] underline hover:no-underline">
            Criar uma conta
          </a>
        </div>

        <footer className="border-t border-[#DFE1E6] pt-4 text-center text-xs text-[#6B778C]">
          <strong className="block mb-1 font-bold">OZAIRX</strong>
          <p className="text-[11px] mt-2">
            Política de Privacidade · Aviso ao usuário
          </p>
        </footer>
      </div>
    </div>
  );
}
