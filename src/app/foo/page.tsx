"use client";

import { useState, useEffect, useMemo } from "react";

export default function CountdownPage() {
  const [deadline, setDeadline] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  // Start ticking every second after deadline is set
  useEffect(() => {
    if (!deadline) return;

    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(id); // Clean up interval
  }, [deadline]);

  // Calculate how many seconds left
  const secondsLeft = useMemo(() => {
    if (!deadline) return 0;
    const ms = deadline - now;
    return ms > 0 ? Math.ceil(ms / 1000) : 0;
  }, [deadline, now]);

  // Handler to start 10-second countdown
  const startCountdown = () => {
    const tenSecondsFromNow = Date.now() + 10 * 1000;
    setDeadline(tenSecondsFromNow);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Countdown Example</h1>

      {deadline ? (
        <p className="text-xl">
          ⏳ Time left: <span className="font-mono">{secondsLeft}s</span>
        </p>
      ) : (
        <p className="text-gray-500 mb-2">No countdown running</p>
      )}

      <button
        onClick={startCountdown}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Start 10s Countdown
      </button>
    </main>
  );
}