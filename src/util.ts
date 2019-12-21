export function unwrap<T>(value: T | null | undefined): T {
  if (!value) {
    throw new Error('Failed to unwrap optional value');
  }
  return value;
}

export function safeUnwrap<T, U>(
  value: T | null | undefined,
  ifPresent: (value: T) => U
): U | null {
  if (value) {
    return ifPresent(value);
  }
  return null;
}

export function sleep(timeMs: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, timeMs));
}
