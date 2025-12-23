"use client";

import { env } from "@/env";
import { signInWithTestDataAction } from "@/lib/actions/auth-actions";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import TrelloLogo from "@/components/icons/TrelloLogo";

export default function LoginForm() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="mb-8">
        <TrelloLogo />
      </div>
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Entre para continuar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">
                E-mail
                <span className="text-red-700">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Insira seu e-mail"
                required
              />
            </div>
            <Button className="w-full">Continuar</Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Ou continue com
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full text-base font-bold bg-white hover:bg-neutral-100 hover:text-black"
              onClick={() => signIn("google")}
            >
              <Image
                src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                alt="Google"
                width={28}
                height={28}
                className="h-7 w-7"
              />
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full text-base font-bold bg-white hover:bg-neutral-100 hover:text-black"
              onClick={() => signIn("github")}
            >
              <Image
                src="https://img.icons8.com/fluency/48/github.png"
                alt="GitHub"
                width={28}
                height={28}
                className="h-7 w-7"
              />
              GitHub
            </Button>
            {env.NEXT_PUBLIC_ENABLE_TEST_LOGIN && (
              <Button
                type="button"
                variant="link"
                className="w-full underline p-0 cursor-pointer hover:no-underline"
                onClick={() => signIn('credentials', { email: 'test@example.com' })}
              >
                Fazer login (teste)
              </Button>
            )}
          </div>
          <div className="mt-4 text-center text-sm">
            <a href="#" className="underline text-primary hover:no-underline">
              Não consegue entrar?
            </a>
            <span className="mx-1">•</span>
            <a href="#" className="underline text-primary hover:no-underline">
              Criar uma conta
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
