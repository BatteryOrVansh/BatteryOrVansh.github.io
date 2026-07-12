"use client";

import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { getFirebaseAuth, getGoogleProvider } from "@/lib/firebase/client";
import { adminFetch } from "@/lib/admin/client";
import { Container } from "@/components/ui/Container";
import { ProjectsPanel } from "@/components/admin/ProjectsPanel";
import { BioPanel } from "@/components/admin/BioPanel";
import { HeroInterestsPanel } from "@/components/admin/HeroInterestsPanel";
import { MusicPanel } from "@/components/admin/MusicPanel";
import { primaryButtonClass, secondaryButtonClass } from "@/components/admin/ui";

type AuthStatus = "loading" | "signed-out" | "checking" | "denied" | "allowed";

const TABS = ["Projects", "Bio", "Hero interests", "Music"] as const;
type Tab = (typeof TABS)[number];

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [signInError, setSignInError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Projects");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setStatus("signed-out");
        return;
      }

      setStatus("checking");
      try {
        // The client-side allowlist check below is UX only. Every write route
        // independently re-verifies the ID token and the allowlist server-side
        // via requireAdmin — this call just decides which screen to render.
        const res = await adminFetch("/api/admin/whoami");
        setStatus(res.ok ? "allowed" : "denied");
      } catch {
        setStatus("denied");
      }
    });

    return unsubscribe;
  }, []);

  const handleSignIn = useCallback(async () => {
    setSignInError(null);
    try {
      await signInWithPopup(getFirebaseAuth(), getGoogleProvider());
    } catch {
      setSignInError("Sign-in failed. Please try again.");
    }
  }, []);

  const handleSignOut = useCallback(() => {
    signOut(getFirebaseAuth());
  }, []);

  if (status === "loading" || status === "checking") {
    return (
      <CenteredScreen>
        <p className="text-sm text-fg-muted">
          {status === "checking" ? "Checking access…" : "Loading…"}
        </p>
      </CenteredScreen>
    );
  }

  if (status === "signed-out") {
    return (
      <CenteredScreen>
        <p className="font-headline text-sm font-medium uppercase tracking-[0.3em] text-red">
          Admin
        </p>
        <h1 className="font-headline mt-4 text-3xl font-bold">Sign in to continue</h1>
        <p className="mt-3 text-sm text-fg-muted">
          Sign in with an authorized Google account to manage the site.
        </p>
        <button type="button" onClick={handleSignIn} className={`${primaryButtonClass} mt-6`}>
          Sign in with Google
        </button>
        {signInError && <p className="mt-4 text-sm text-red">{signInError}</p>}
      </CenteredScreen>
    );
  }

  if (status === "denied") {
    return (
      <CenteredScreen>
        <h1 className="font-headline text-3xl font-bold">Access denied</h1>
        <p className="mt-3 text-sm text-fg-muted">You don&apos;t have access to this page.</p>
        <button type="button" onClick={handleSignOut} className={`${secondaryButtonClass} mt-6`}>
          Sign out
        </button>
      </CenteredScreen>
    );
  }

  return (
    <main className="min-h-screen py-16">
      <Container className="max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-headline text-sm font-medium uppercase tracking-[0.3em] text-red">
              Admin
            </p>
            <h1 className="font-headline mt-2 text-3xl font-bold">Site control panel</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-fg-muted">
            <span className="truncate">{user?.email}</span>
            <button type="button" onClick={handleSignOut} className={secondaryButtonClass}>
              Sign out
            </button>
          </div>
        </div>

        <nav className="mt-10 flex flex-wrap gap-2 border-b border-border pb-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition duration-200 ease-[var(--ease-google)] ${
                activeTab === tab
                  ? "bg-red text-bg"
                  : "border border-border text-fg-muted hover:text-fg"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="mt-8">
          {activeTab === "Projects" && <ProjectsPanel />}
          {activeTab === "Bio" && <BioPanel />}
          {activeTab === "Hero interests" && <HeroInterestsPanel />}
          {activeTab === "Music" && <MusicPanel />}
        </div>
      </Container>
    </main>
  );
}

function CenteredScreen({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">{children}</div>
    </main>
  );
}
