import Image from "next/image";

export default function HomePage() {
  return (
  <section className="grid gap-6">
    <h1 className="text-3xl font-bold">Excel's Pilot Frontend</h1>
      <p className="text-gray-600">
        This is the <span className="font-medium">v0.0.1</span> scaffold.
        Next up: install <code>shadcn/ui</code>, wire Apollo Client, then NextAuth.
      </p>


      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold mb-2">What’s here</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Next.js App Router + TypeScript</li>
            <li>TailwindCSS configured</li>
            <li>Base layout & header</li>
          </ul>
      </div>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="font-semibold mb-2">What’s next</h2>
        <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
          <li>Add <strong>shadcn/ui</strong> primitives & theme</li>
          <li>Setup <strong>Apollo Client</strong> provider</li>
          <li>Integrate <strong>NextAuth.js</strong> (Credentials/JWT)</li>
        </ol>
      </div>
    </div>
  </section>
  );
}
