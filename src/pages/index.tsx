import { useApp } from "@/context";
import { Link } from "react-router-dom";
export default function IndexPage() {
  const { apiKey } = useApp()
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-16">
      <section className="w-full max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full border border-default-200 bg-default-50 px-3 py-1 text-sm text-default-600">
          🔒 Private by design
        </div>

        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
          Your Torn inventory,
          <br />
          <span className="text-primary">wherever you are.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-default-500">
          Nventory lets you view your Torn inventory while abroad, without
          needing to carry your whole inventory around in your head.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={apiKey ? "/inventory" : "/settings"}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 font-medium text-primary-foreground shadow-lg shadow-primary/20 transition hover:scale-[1.02]"
          >
            Get started
          </Link>

          <a
            href="#privacy"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-default-200 bg-default-50 px-6 font-medium text-default-700 transition hover:bg-default-100"
          >
            How it works
          </a>
        </div>
      </section>

      <section
        id="privacy"
        className="mt-20 grid w-full max-w-4xl gap-4 md:grid-cols-3"
      >
        <div className="rounded-2xl border border-default-200 bg-content1 p-6 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xl">
            🎒
          </div>

          <h2 className="font-semibold">View your inventory</h2>

          <p className="mt-2 text-sm leading-6 text-default-500">
            Quickly check what you have in your Torn inventory, even when
            you're travelling abroad.
          </p>
        </div>

        <div className="rounded-2xl border border-default-200 bg-content1 p-6 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-xl">
            🔑
          </div>

          <h2 className="font-semibold">Limited API access</h2>

          <p className="mt-2 text-sm leading-6 text-default-500">
            Connect your Torn account using a limited-access API key. You
            control what permissions the key has.
          </p>
        </div>

        <div className="rounded-2xl border border-default-200 bg-content1 p-6 shadow-sm">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-xl">
            💾
          </div>

          <h2 className="font-semibold">Stays in your browser</h2>

          <p className="mt-2 text-sm leading-6 text-default-500">
            Your API key and inventory data are stored locally in your
            browser. Nothing is sent to or stored by Nventory.
          </p>
        </div>
      </section>

      <section className="mt-8 w-full max-w-4xl">
        <div className="flex flex-col gap-4 rounded-2xl border border-default-200 bg-default-50 p-6 sm:flex-row sm:items-center">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success/10 text-xl">
            🛡️
          </div>

          <div>
            <h2 className="font-semibold">Your data stays yours</h2>

            <p className="mt-1 text-sm leading-6 text-default-500">
              Nventory doesn't need an account, database, or server-side
              storage. Your configuration and data remain in your browser's
              localStorage.
            </p>
          </div>
        </div>
      </section>

      <p className="mt-10 text-center text-xs text-default-400">
        Nventory is a fan-made tool for Torn. Your API key should use only the
        permissions required by the app.
      </p>
    </main>
  );
}
