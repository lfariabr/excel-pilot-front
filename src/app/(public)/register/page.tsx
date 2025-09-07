import SignUpForm from "@/components/auth/SignUpForm";

export default function RegisterPage() {
return (
    <section className="grid gap-6">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <SignUpForm />
    </section>
);
}