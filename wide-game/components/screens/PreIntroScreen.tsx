interface Props {
  onReady: () => void;
}

export default function PreIntroScreen({ onReady }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-12">
      <div />

      <div className="w-full max-w-xs text-center">
        <h2 className="font-display text-3xl text-foreground leading-snug mb-6">
          Pensi di saper vendere?
        </h2>

        <p className="text-foreground-muted text-base font-body leading-relaxed mb-2">
          Ti diamo un prodotto impossibile
          <br />e tre decisioni strategiche da prendere.
        </p>

        <p className="text-foreground-muted text-base font-body leading-relaxed mb-10">
          Nel mercato italiano...
        </p>

        <p className="text-foreground-muted/60 text-base font-body italic">
          Buona fortuna.
        </p>
      </div>

      <div className="w-full max-w-xs">
        <button
          onClick={onReady}
          className="w-full bg-gold text-background font-body font-semibold py-4 rounded-full text-base hover:bg-gold-light active:scale-95 transition-all"
        >
          Sono pronto
        </button>
      </div>
    </div>
  );
}
