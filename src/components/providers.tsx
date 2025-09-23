"use client";
import { ReactNode } from "react";
import { ApolloProviderWrapper } from "@/lib/apollo/provider";
import { SessionProvider } from "next-auth/react";

// v0.0.1: Minimal placeholder. We’ll insert ApolloProvider & SessionProvider in later versions.
// v0.0.3: Added Apollo Provider for GraphQL integration
// v0.0.4: Will add NextAuth SessionProvider
export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <ApolloProviderWrapper>
                {children}
            </ApolloProviderWrapper>
        </SessionProvider>
    );
}