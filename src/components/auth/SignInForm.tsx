"use client";
import React, { useState } from "react";
import { useLogin } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";

export default function SignInForm() {
    // React Hooks
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);
    
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
        </form>
    );
}