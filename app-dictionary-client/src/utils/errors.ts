export function extractErrorMessage(e: any, fallback: string): string {
  const data = e?.response?.data;
  const fieldMessages = data?.fields ? Object.values<string>(data.fields).filter(Boolean) : [];
  if (fieldMessages.length > 0) return fieldMessages.join('\n');
  return data?.message ?? data?.error ?? fallback;
}
