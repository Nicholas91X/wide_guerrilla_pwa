'use client';

import { useEffect, useState } from 'react';
import DesktopBlockScreen from './screens/DesktopBlockScreen';

export default function DesktopGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Evita flash durante l'hydration
  if (isDesktop === null) return null;

  if (isDesktop) return <DesktopBlockScreen />;

  return <>{children}</>;
}
