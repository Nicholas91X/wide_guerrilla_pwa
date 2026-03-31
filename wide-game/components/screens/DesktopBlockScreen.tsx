export default function DesktopBlockScreen() {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 px-8">
      <div className="max-w-xs text-center">
        <div className="text-5xl mb-8">🎩</div>

        <h1 className="font-display text-2xl text-foreground leading-snug mb-4">
          Questo gioco è pensato per smartphone.
        </h1>

        <p className="text-foreground-muted text-base leading-relaxed mb-10">
          Inquadra il QR code con il tuo telefono
          <br />e scopri cosa ti aspetta.
        </p>

        <div className="w-12 h-px bg-gold mx-auto mb-6" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="WIDE Studio Digitale"
          width={64}
          height={64}
          className="mx-auto rounded-full"
        />
      </div>
    </div>
  );
}
