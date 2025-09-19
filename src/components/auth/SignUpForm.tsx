"use client";
import React, { useState } from "react";
import { useRegister } from "@/lib/hooks/auth";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";

export default function SignUpForm() {
    // Form state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);
    
    // Auth hook
    const { register, loading, error } = useRegister();

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);
        
        // Form validation
        if (!name || !email || !password) {
            return setLocalError("Please fill all fields.");
        }
        
        if (password !== confirm) {
            return setLocalError("Passwords don't match.");
        }
        
        if (password.length < 6) {
            return setLocalError("Password must be at least 6 characters long.");
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return setLocalError("Please enter a valid email address.");
        }

        try {
            await register({ 
                name, 
                email, 
                password,
                role: 'casual' // Default role for new registrations
            });
            // Redirect is handled by the useRegister hook
        } catch (err) {
            console.error('Registration failed:', err);
            // Error is handled by the hook, but we can add local handling if needed
        }
    };

    const displayError = localError || error?.message;

    return (
        <form onSubmit={submit} className="grid gap-3 max-w-sm">
            <label className="grid gap-1">
                <span className="text-sm">Name</span>
                <input 
                    type="text"
                    className="rounded-xl border px-3 py-2" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    required
                    placeholder="Enter your full name"
                />
            </label>
            
            <label className="grid gap-1">
                <span className="text-sm">Email</span>
                <input 
                    type="email"
                    className="rounded-xl border px-3 py-2" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    placeholder="Enter your email"
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
                    placeholder="At least 6 characters"
                    minLength={6}
                />
            </label>
            
            <label className="grid gap-1">
                <span className="text-sm">Confirm Password</span>
                <input 
                    type="password" 
                    className="rounded-xl border px-3 py-2" 
                    value={confirm} 
                    onChange={(e) => setConfirm(e.target.value)}
                    disabled={loading}
                    required
                    placeholder="Confirm your password"
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
                        Creating account...
                    </>
                ) : (
                    'Create account'
                )}
            </Button>
        </form>
    );
}