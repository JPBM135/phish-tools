export enum PhishToolsErrorCodes {
	InternalServerError = 'common/internal-server-error',
	InvalidEmailOrPassword = 'auth/invalid-email-or-password',
	InvalidPassword = 'user/invalid-password',
	InvalidPasswordChange = 'user/invalid-password-change',
	InvalidState = 'auth/invalid-state',
	InvalidToken = 'auth/invalid-token',
	PhishInvalidPayRange = 'phish/invalid-pay-range',
	PhishNotFound = 'phish/not-found',
	NoFieldsToUpdate = 'common/no-fields-to-update',
	Unauthorized = 'auth/unauthorized',
	Forbidden = 'auth/forbidden',
	PhishInvalidUrl = 'phish/invalid-url',
}
