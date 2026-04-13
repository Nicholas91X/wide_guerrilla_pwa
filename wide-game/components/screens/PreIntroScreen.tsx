interface Props {
  onReady: () => void;
}

export default function PreIntroScreen({ onReady }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-14">

      {/* Logo / brand mark top */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-gold/50 text-[0.55rem] font-body tracking-[0.3em] uppercase">
          WIDE Studio Digitale
        </span>
      </div>

      {/* Centro — testo editoriale */}
      <div className="w-full max-w-xs text-center">
        <span className="gold-rule mx-auto mb-6" />

        <h2 className="font-display text-[2.6rem] text-foreground leading-[1.15] mb-5 italic font-semibold">
          Ti sfido a fare marketing.
        </h2>

        <span className="gold-rule mx-auto mb-6" />

        <p className="text-foreground-muted text-sm font-body leading-relaxed mb-1">
          Hai un prodotto.
        </p>
        <p className="text-foreground-muted text-sm font-body leading-relaxed mb-6">
          Hai tre mosse. Il mercato ti aspetta.
        </p>

        <p className="text-foreground-dim text-[0.6rem] font-body leading-relaxed tracking-wide uppercase mb-6">
          Storia e conseguenze generate dall'AI ad ogni partita.
          <br />Nessun percorso è uguale.
        </p>

        <p className="text-foreground-muted/70 text-sm font-display italic">
          Buona fortuna.
        </p>
      </div>

      {/* CTA */}
      <div className="w-full max-w-xs">
        <button
          onClick={onReady}
          className="w-full bg-gold text-background font-body font-semibold py-4 rounded-full text-sm tracking-wide hover:bg-gold-light active:scale-[0.98] transition-all duration-200"
        >
          Accetta la sfida
        </button>
      </div>

    </div>
  );
}
