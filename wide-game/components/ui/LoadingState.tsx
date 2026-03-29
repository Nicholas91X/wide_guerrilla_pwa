// TODO Blocco 5: sostituire spinner con loading.gif
export default function LoadingState({ message = 'Un momento...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="w-7 h-7 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      <p className="text-foreground-muted text-sm font-body">{message}</p>
    </div>
  );
}
