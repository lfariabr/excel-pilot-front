"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMockSession, signOutMock } from "@/lib/mock/auth";

export default function HeaderUserMock() {
    const { user } = useMockSession();
    const router = useRouter();
    if (!user) {
        return (
          <div className="flex items-center gap-3 text-sm">
            <Link href="/login">Login</Link>
            <span className="text-gray-300">·</span>
            <Link href="/register">Register</Link>
          </div>  
        );
    }
    return (
        <div className="">
            <span className="">{user.name}</span>
            <button
                onClick={() => { signOutMock(); router.push("/");}}
                className="rounded-xl border px-3 py-1"
            >Logout</button>
        </div>
    );
}