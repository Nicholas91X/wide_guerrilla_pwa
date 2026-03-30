interface Props {
  message?: string;
}

export default function LoadingState({ message = 'Stiamo contabilizzando i danni...' }: Props) {
  return (
    <div className="flex flex-col items-center gap-5 py-8">
      {/* Card bianca intenzionale — il video ha sfondo bianco non rimovibile */}
      <div className="w-full max-w-[240px] rounded-2xl overflow-hidden border border-gold/20 shadow-[0_0_24px_rgba(201,150,58,0.08)]">
        <video
          src="/gifs/loading.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full aspect-[3/2] object-cover block"
        />
      </div>
      <p className="text-foreground-muted text-sm font-body text-center">{message}</p>
    </div>
  );
}
