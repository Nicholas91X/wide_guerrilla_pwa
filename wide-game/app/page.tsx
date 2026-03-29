import DesktopGuard from '@/components/DesktopGuard';

export default function Home() {
  return (
    <DesktopGuard>
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-display text-foreground-muted text-sm">
          — Blocco 1 completato —
        </p>
      </main>
    </DesktopGuard>
  );
}
