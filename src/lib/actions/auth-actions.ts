"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function signInWithTestDataAction() {
  try {
    await signIn("credentials", {
      email: "test@example.com",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid credentials" };
    }
    throw error;
  }
}
