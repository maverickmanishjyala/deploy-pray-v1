import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-svh flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center space-y-3">
        <p className="text-sm text-muted-foreground">404</p>
        <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you’re looking for doesn’t exist (or was moved).
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

