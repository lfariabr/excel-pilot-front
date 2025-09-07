import SignInForm from "@/components/auth/SignInForm";

export default function LoginPage() {
return (
    <section className="grid gap-6">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <SignInForm />
    </section>
    );
}