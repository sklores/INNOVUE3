export type StopFn = () => void;

export function startPoller(intervalMs: number, fn: () => Promise<void>): StopFn {
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const tick = async () => {
    if (stopped) return;
    try {
      await fn();
    } catch (err) {
      console.error("poller tick error:", err);
    } finally {
      if (!stopped) {
        timer = setTimeout(tick, Math.max(1000, intervalMs | 0));
      }
    }
  };

  void tick();
  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
  };
}