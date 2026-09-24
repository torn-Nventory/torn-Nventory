import { Navbar } from "@/components/navbar";
import LoadingText from "./components/loading-text";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto max-w-7xl p-6 flex-grow">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <a
          className="flex items-center gap-1 text-current no-underline"
          href="https://heroui.com?utm_source=vite-template"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="text-muted">Powered by</span>
          <p className="text-accent"><LoadingText /></p>
        </a>
      </footer>
    </div>
  );
}
