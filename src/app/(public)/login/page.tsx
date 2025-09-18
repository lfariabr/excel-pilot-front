import SignInForm from "@/components/auth/SignInForm";
import Link from "next/link";

export default function LoginPage() {
return (
    <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="grid gap-6">
            <h1 className="text-2xl font-bold">Sign in</h1>
            <SignInForm />
            <Link href="/register">Don't have an account? <span className="text-blue-500">Register</span></Link>
        </section>
    </main>
    );
}