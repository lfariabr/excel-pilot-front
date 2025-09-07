"use client";
import { useEffect, useState } from "react";

export type MockUser = { id: string; name: string, email: string };
const KEY = "excelpilot.mock.session";
const EVENT = "mock-session-updated";

function read(): MockUser | null {
    try {
        return JSON.parse(localStorage.getItem(KEY) || "null");
    } catch {
        return null;
    }
}

function write(user: MockUser | null) {
    if (user) localStorage.setItem(KEY, JSON.stringify(user));
    else localStorage.removeItem(KEY);
    window.dispatchEvent(new Event(EVENT));
} 

export function signInMock(email: string, _password: string, name?: string): MockUser {
    const user = { 
        id: "mock-" + crypto.randomUUID(), name: name || email.split("@")[0], email 
    };
    write(user);
    return user;
}
export function signOutMock() { write(null); }
export function currentUser(): MockUser | null { return read(); }

export function useMockSession() {
    const [user, setUser] = useState<MockUser | null>(null);
    useEffect(() => {
        const update = () => setUser(read());
        update();
        window.addEventListener(EVENT, update);
        window.addEventListener("storage", update);
        return () => {
            window.removeEventListener(EVENT, update);
            window.removeEventListener("storage", update);
        };
    }, []);
    return { user };
}