import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@heroui/react";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Send to your error tracking service here.
    console.error("Uncaught application error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (!hasError) {
      return children;
    }

    if (fallback) {
      return fallback;
    }

    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
        {/* Ambient background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-danger/10 blur-3xl" />
          <div className="absolute left-[15%] top-[20%] h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-[10%] right-[15%] h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <section className="relative w-full max-w-lg">
          <div className="rounded-3xl border border-default-200/60 bg-content1/80 p-8 shadow-2xl shadow-black/5 backdrop-blur-xl sm:p-10">
            {/* Error icon */}
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 ring-1 ring-danger/20">
              <svg
                aria-hidden="true"
                className="h-7 w-7 text-danger"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0 3.75h.008M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-widest text-danger">
                Something went wrong
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                We hit an unexpected error.
              </h1>

              <p className="text-base leading-7 text-foreground-500">
                Don&apos;t worry — your data is safe. Try again, and if the
                problem continues, reload the page.
              </p>
            </div>

            {/* Development error details */}
            {import.meta.env?.DEV && error && (
              <details className="mt-7 overflow-hidden rounded-2xl border border-danger/15 bg-danger/[0.04]">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-danger">
                  Show error details
                </summary>

                <pre className="max-h-48 overflow-auto border-t border-danger/10 px-4 py-3 text-xs leading-5 text-foreground-500">
                  {error.stack ?? error.message}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="danger"
                className="font-medium sm:flex-1"
                onPress={this.handleRetry}
              >
                Try again
              </Button>

              <Button
                variant="secondary"
                className="sm:flex-1"
                onPress={this.handleReload}
              >
                Reload page
              </Button>
            </div>

            <p className="mt-6 text-center text-xs text-foreground-400">
              If this keeps happening, please contact support.
            </p>
          </div>
        </section>
      </main>
    );
  }
}

export default ErrorBoundary;
