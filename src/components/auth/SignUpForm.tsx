"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInMock } from "@/lib/mock/auth";


export default function SignUpForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();


    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!name || !email || !password) return setError("Please fill all fields.");
        if (password !== confirm) return setError("Passwords don’t match.");
        signInMock(email, password, name);
        router.push("/chat");
};

return (
    <form onSubmit={submit} className="grid gap-3 max-w-sm">
        <label className="grid gap-1">
            <span className="text-sm">Name</span>
            <input className="rounded-xl border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="grid gap-1">
            <span className="text-sm">Email</span>
            <input className="rounded-xl border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
            <label className="grid gap-1">
            <span className="text-sm">Password</span>
            <input type="password" className="rounded-xl border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label className="grid gap-1">
            <span className="text-sm">Confirm Password</span>
            <input type="password" className="rounded-xl border px-3 py-2" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="rounded-xl border px-4 py-2">Create account</button>
    </form>
);
}