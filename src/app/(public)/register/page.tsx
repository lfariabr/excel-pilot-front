import SignUpForm from "@/components/auth/SignUpForm";

export default function RegisterPage() {
return (
    <main className="mx-auto max-w-6xl px-4 py-8">
        <section className="grid gap-6">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <SignUpForm />
        </section>
    </main>
);
}