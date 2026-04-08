"use client";

import Link from "next/link";
import {
  useAuth,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

export function Header() {
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌍</span>
          <span className="text-xl font-bold tracking-tight text-primary">
            Wanderlist
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Explore
          </Link>
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                My Bucket List
              </Link>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-light">
                Sign In
              </button>
            </SignInButton>
          )}
        </nav>
      </div>
    </header>
  );
}
