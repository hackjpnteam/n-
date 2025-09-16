"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <button
        onClick={() => signIn("google", { callbackUrl: "/mypage" })}
        className="px-4 py-2 rounded-md border"
      >
        Googleでログイン
      </button>
    </div>
  );
}