export default function IndexPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <span >Make&nbsp;</span>
        <span >beautiful&nbsp;</span>
        <br />
        <span >
          websites regardless of your design experience.
        </span>
        <h3>
          Beautiful, fast and modern React UI library.
        </h3>
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2 rounded-xl bg-surface shadow-surface px-4 py-2">
          <pre className="text-sm font-medium font-mono">
            Get started by visiting{" "}
            <code className="px-2 py-1 h-fit font-mono font-normal inline whitespace-nowrap rounded-sm bg-accent/20 text-accent text-sm">
              /settings
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
