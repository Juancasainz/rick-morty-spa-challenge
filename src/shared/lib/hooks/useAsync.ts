import { useEffect, useState } from "react";

type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: readonly unknown[],
  options?: { enabled?: boolean }
): AsyncState<T> {
  const enabled = options?.enabled ?? true;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: enabled,
    error: null,
  });

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, isLoading: false, error: null });
      return;
    }

    let ignore = false;
    setState((s) => ({ ...s, isLoading: true, error: null }));

    fn()
      .then((data) => {
        if (ignore) return;
        setState({ data, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setState({
          data: null,
          isLoading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
