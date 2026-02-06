import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function parseOneOf<T extends string>(
    value: string | null,
    allowed: readonly T[],
    fallback: T
): T {
    if (!value) return fallback;
    return (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

type SetOptions = { replace?: boolean };

export function useQueryParam<T extends string>(
    key: string,
    allowed: readonly T[],
    fallback: T
) {
    const [sp, setSp] = useSearchParams();

    const value = useMemo(() => {
        return parseOneOf(sp.get(key), allowed, fallback);
    }, [sp, key, allowed, fallback]);

    const setValue = useCallback(
        (next: T, options?: SetOptions) => {
            setSp((prev) => {
                const nextParams = new URLSearchParams(prev);
                nextParams.set(key, next);
                return nextParams;
            }, { replace: options?.replace ?? false });
        },
        [key, setSp]
    );
    // TODO: hacer reset en una sola operacion
    const reset = useCallback(
        (options?: SetOptions) => setValue(fallback, options),
        [fallback, setValue]
    );

    return { value, setValue, reset };
}