export function unwrap<T>(value: T | null | undefined): T {
  if (!value) {
    throw new Error('Failed to unwrap optional value');
  }
  return value;
}
