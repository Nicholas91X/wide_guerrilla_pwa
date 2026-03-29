import GifSlot from '@/components/ui/GifSlot';

interface Props {
  message?: string;
}

export default function LoadingState({ message = 'Stiamo contabilizzando i danni...' }: Props) {
  return (
    <div className="flex flex-col items-center gap-5 py-8">
      <div className="w-full max-w-[240px]">
        <GifSlot name="loading" />
      </div>
      <p className="text-foreground-muted text-sm font-body text-center">{message}</p>
    </div>
  );
}
