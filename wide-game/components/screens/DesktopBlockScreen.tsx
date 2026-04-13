export default function DesktopBlockScreen() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 px-8">
      <div className="max-w-xs text-center">
        <div className="text-4xl mb-8">🎩</div>

        <h1 className="font-display text-[1.8rem] italic text-foreground leading-snug mb-3 font-semibold">
          Questo gioco è pensato per smartphone.
        </h1>

        <p className="text-foreground-muted text-xs font-body leading-relaxed mb-8">
          Inquadra il QR code con il tuo telefono
          <br />e scopri cosa ti aspetta.
        </p>

        <span className="gold-rule mx-auto mb-6" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="WIDE Studio Digitale"
          width={56}
          height={56}
          className="mx-auto rounded-full opacity-80"
        />
        <p className="text-foreground-dim text-[0.5rem] font-body tracking-widest uppercase mt-3">
          WIDE Studio Digitale
        </p>
      </div>
    </div>
  );
}
