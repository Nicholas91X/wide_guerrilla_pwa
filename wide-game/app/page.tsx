import DesktopGuard from '@/components/DesktopGuard';
import GameApp from '@/components/GameApp';

export default function Home() {
  return (
    <DesktopGuard>
      <GameApp />
    </DesktopGuard>
  );
}
