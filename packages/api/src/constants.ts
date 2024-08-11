export const MAX_LOGIN_AGE = 1_000 * 60 * 60 * 24; // 1 days

export const MAX_STATE_AGE = 1_000 * 60 * 5; // 1 days

export const BCRYPT_SALT_ROUNDS = 14;

export const AUTH_ISSUER = 'phish-tools';
export const AUTH_ISSUER_API = 'phish-tools-api';

export const NOT_MODIFIED_SIGNAL = Symbol('NOT_MODIFIED_SIGNAL');

export const URL_REGEX =
	/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;