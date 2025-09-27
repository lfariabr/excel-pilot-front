"use client";
import React, { useState } from "react";
import { useLogin } from "@/lib/hooks/auth/useLogin";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignInForm() {
    // React Hooks
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);
    const [socialLoading, setSocialLoading] = useState(false);
    
    // Auth hook
    const { login, loading, error } = useLogin();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        
        if (!email || !password) {
            return setLocalError("Please fill email and password.");
        }

        try {
            await login({ email, password });
            // Redirect is handled by the useLogin hook
        } catch (err) {
            console.error('Login failed:', err);
            // Error is handled by the hook, but we can add local handling if needed
        }
    };

    const displayError = localError || error?.message;

    return (
        <form onSubmit={submit} className="grid gap-3 max-w-sm">
            <label className="grid gap-1">
                <span className="text-sm">Email</span>
                <input 
                    type="email"
                    className="rounded-xl border px-3 py-2" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                />
            </label>
            <label className="grid gap-1">
                <span className="text-sm">Password</span>
                <input 
                    type="password" 
                    className="rounded-xl border px-3 py-2" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                />
            </label>
            
            {displayError && (
                <div className="text-red-600 text-sm">{displayError}</div>
            )}
            
            <Button 
                type="submit" 
                disabled={loading}
                className="mt-2"
            >
                {loading ? (
                    <>
                        <Loading variant="spinner" size="sm" className="mr-2" />
                        Signing in...
                    </>
                ) : (
                    'Sign in'
                )}
            </Button>

            {/* Separator */}
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
            </div>

            {/* Social login: GitHub */}
            <Button 
                type="button"
                variant="outline"
                disabled={socialLoading || loading}
                onClick={async () => {
                    try {
                        setSocialLoading(true);
                        await signIn('github',  {
                            callbackUrl: '/'})
                        } finally {
                            setSocialLoading(false);
                        }
                    }}
            >
                {socialLoading ? (
                    <>
                        <Loading variant="spinner" size="sm" className="mr-2" />
                        Redirecting to GitHub...
                        </>
                ) : (
                    'Sign in with GitHub'
                )}
                <Image src="/github-mark.svg" alt="GitHub" width={24} height={24} />
            </Button>
        </form>
    );
}