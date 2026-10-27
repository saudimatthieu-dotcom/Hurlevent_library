export function isFilled(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

export function optionalText(value: unknown): string | undefined {
  return isFilled(value) ? value.trim() : undefined;
}

export function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
