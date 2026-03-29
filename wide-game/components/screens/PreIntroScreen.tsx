interface Props {
  onReady: () => void;
}

export default function PreIntroScreen({ onReady }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 py-12">

      {/* Spacer top */}
      <div />

      {/* Contenuto centrale */}
      <div className="w-full max-w-xs text-center">
        <p className="text-gold text-3xl mb-4">⚠️</p>

        <h2 className="font-display text-3xl text-foreground mb-6">
          ATTENZIONE
        </h2>

        <p className="text-foreground-muted text-base font-body leading-relaxed mb-4">
          Questa simulazione riproduce fedelmente
          <br />le condizioni del mercato italiano.
        </p>

        <p className="text-foreground-muted text-base font-body leading-relaxed mb-1">
          Prima di procedere assicurati di:
        </p>
        <div className="text-foreground text-base font-body leading-loose mb-6 text-left inline-block">
          <p>— Avere 5 minuti liberi</p>
          <p>— Essere in un posto tranquillo</p>
          <p>— Non avere debiti in sospeso</p>
        </div>

        <p className="text-foreground-muted/60 text-base font-body leading-relaxed italic">
          Le tue decisioni avranno peso.
          <br />(Più di quanto vorresti.)
        </p>
      </div>

      {/* CTA */}
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
