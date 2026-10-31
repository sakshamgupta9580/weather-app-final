export const API_ERROR_CODES = {
  CITY_NOT_FOUND: 'CITY_NOT_FOUND',
  INVALID_REQUEST: 'INVALID_REQUEST',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  OFFLINE: 'OFFLINE',
  TIMEOUT: 'TIMEOUT',
  INVALID_RESPONSE: 'INVALID_RESPONSE',
};

// Failures caused by connectivity rather than the request itself; these are
// retried automatically when the browser comes back online.
export const CONNECTIVITY_ERROR_CODES = [
  API_ERROR_CODES.NETWORK_ERROR,
  API_ERROR_CODES.OFFLINE,
  API_ERROR_CODES.TIMEOUT,
];

// Retrying can't help these: the same input fails the same way.
export const NON_RETRYABLE_ERROR_CODES = [API_ERROR_CODES.CITY_NOT_FOUND, API_ERROR_CODES.INVALID_REQUEST];

// User-facing message for each error code. CITY_NOT_FOUND is built per
// search, since it quotes what the user typed.
export const API_ERROR_MESSAGES = {
  [API_ERROR_CODES.INVALID_REQUEST]: "That search couldn't be processed. Try a different city name.",
  [API_ERROR_CODES.RATE_LIMITED]: 'Too many requests. Please wait a minute and try again.',
  [API_ERROR_CODES.SERVER_ERROR]: 'The weather service is temporarily unavailable. Please try again shortly.',
  [API_ERROR_CODES.NETWORK_ERROR]: 'Network error. Check your internet connection and try again.',
  [API_ERROR_CODES.OFFLINE]: "You're offline. Reconnect to the internet and we'll load the weather.",
  [API_ERROR_CODES.TIMEOUT]: 'The weather service took too long to respond. Please try again.',
  [API_ERROR_CODES.INVALID_RESPONSE]: 'The weather service sent an unexpected response. Please try again.',
};

// Headings for the full-page error card, by error code.
export const API_ERROR_TITLES = {
  [API_ERROR_CODES.CITY_NOT_FOUND]: 'City not found',
  [API_ERROR_CODES.INVALID_REQUEST]: 'Invalid search',
  [API_ERROR_CODES.RATE_LIMITED]: 'Too many requests',
  [API_ERROR_CODES.SERVER_ERROR]: 'Weather service unavailable',
  [API_ERROR_CODES.NETWORK_ERROR]: 'Connection problem',
  [API_ERROR_CODES.OFFLINE]: "You're offline",
  [API_ERROR_CODES.TIMEOUT]: 'Request timed out',
  [API_ERROR_CODES.INVALID_RESPONSE]: 'Unexpected response',
};
