import { API_CONFIG } from '../constants/api';
import { API_ERROR_CODES, API_ERROR_MESSAGES } from '../constants/apiErrors';

export class ApiError extends Error {
  constructor(message, { status = null, code = null, body = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.body = body;
  }

  // An error with the standard user-facing message for its code.
  static fromCode(code, { status = null, body = null } = {}) {
    return new ApiError(API_ERROR_MESSAGES[code], { status, code, body });
  }
}

const isOffline = () => typeof navigator !== 'undefined' && navigator.onLine === false;

const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 600;

// Brief blips (dropped connection, server hiccup) often succeed a moment
// later. Timeouts aren't retried: the user has already waited the full limit.
const isTransient = (err) =>
  err instanceof ApiError && (err.code === API_ERROR_CODES.NETWORK_ERROR || err.status >= 500);

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

/**
 * GETs JSON, retrying once after a transient failure. Every failure becomes an
 * ApiError; a caller-initiated abort is re-thrown untouched so callers can
 * ignore it.
 */
export async function getJson(url, { signal } = {}) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await requestJson(url, { signal });
    } catch (err) {
      if (attempt >= MAX_ATTEMPTS || signal?.aborted || !isTransient(err)) throw err;
      await wait(RETRY_DELAY_MS, signal);
    }
  }
}

// One request with a timeout.
async function requestJson(url, { signal }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.requestTimeoutMs);
  const abortFromCaller = () => controller.abort();
  signal?.addEventListener('abort', abortFromCaller);

  try {
    if (isOffline()) throw ApiError.fromCode(API_ERROR_CODES.OFFLINE);

    let response;
    try {
      response = await fetch(url, { signal: controller.signal });
    } catch (err) {
      if (signal?.aborted) throw err;
      if (err.name === 'AbortError') throw ApiError.fromCode(API_ERROR_CODES.TIMEOUT);
      throw ApiError.fromCode(isOffline() ? API_ERROR_CODES.OFFLINE : API_ERROR_CODES.NETWORK_ERROR);
    }

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      throw new ApiError(body?.message || `Request failed (${response.status})`, {
        status: response.status,
        body,
      });
    }
    if (body == null || typeof body !== 'object') {
      throw ApiError.fromCode(API_ERROR_CODES.INVALID_RESPONSE);
    }
    return body;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abortFromCaller);
  }
}
