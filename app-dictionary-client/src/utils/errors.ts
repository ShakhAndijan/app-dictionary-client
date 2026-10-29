/** True when the request never got an HTTP response (server down, wrong address, no internet, timeout). */
export function isNetworkError(e: any): boolean {
  return !!e && !e.response && (e.code === 'ERR_NETWORK' || e.code === 'ECONNABORTED' || e.message === 'Network Error');
}

export function extractErrorMessage(e: any, fallback: string): string {
  const data = e?.response?.data;
  const fieldMessages = data?.fields ? Object.values<string>(data.fields).filter(Boolean) : [];
  if (fieldMessages.length > 0) return fieldMessages.join('\n');
  return data?.message ?? data?.error ?? fallback;
}
