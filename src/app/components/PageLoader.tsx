'use client'

import { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function isInternalNavigation(anchor: HTMLAnchorElement): boolean {
  const href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false;
  }
  if (anchor.target === '_blank' || anchor.hasAttribute('download')) {
    return false;
  }
  try {
    return new URL(href, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

function ProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef(false);

  const setProgress = (value: number) => {
    progressRef.current = value;
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${value / 100})`;
    }
  };

  const stopTick = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const show = () => {
    containerRef.current?.classList.add('is-active');
  };

  const hide = () => {
    containerRef.current?.classList.remove('is-active');
    setProgress(0);
    activeRef.current = false;
  };

  const start = () => {
    if (activeRef.current) return;

    activeRef.current = true;
    stopTick();
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    setProgress(8);
    show();

    const tick = () => {
      const current = progressRef.current;
      if (current < 92) {
        setProgress(current + Math.max(0.4, (92 - current) * 0.1));
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const complete = () => {
    if (!activeRef.current) return;

    stopTick();
    setProgress(100);

    hideTimerRef.current = setTimeout(hide, 180);
  };

  // Start on internal link clicks
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest('a');
      if (anchor instanceof HTMLAnchorElement && isInternalNavigation(anchor)) {
        start();
      }
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Start on programmatic navigation (router.push / replace)
  useEffect(() => {
    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    history.pushState = (...args) => {
      start();
      return originalPushState(...args);
    };

    history.replaceState = (...args) => {
      start();
      return originalReplaceState(...args);
    };

    return () => {
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  // Complete when route has settled
  useEffect(() => {
    if (!activeRef.current) return;

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(complete);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname, searchParams]);

  useEffect(() => {
    return () => {
      stopTick();
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="page-progress" role="progressbar" aria-hidden="true">
      <div ref={barRef} className="page-progress-bar" />
    </div>
  );
}

export function PageLoader() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}
