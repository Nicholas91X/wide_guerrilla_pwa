interface Props {
  message?: string;
}

export default function LoadingState({ message = 'Stiamo contabilizzando i danni…' }: Props) {
  return (
    <div className="flex flex-col items-center gap-5 py-10">
      <div className="w-full max-w-[220px] rounded-2xl overflow-hidden border border-gold/25 bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/gifs/loading.gif"
          alt="Caricamento..."
          className="w-full aspect-[3/2] object-cover block"
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="gold-rule" />
        <p className="text-foreground-muted text-xs font-body text-center mt-1">{message}</p>
      </div>
    </div>
  );
}
