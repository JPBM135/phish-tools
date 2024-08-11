import type { phishing_user_role } from '../../@types/phishtools.schema.js';
import { Permissions } from './permissions.js';

export function roleToPermissions(role: phishing_user_role) {
	switch (role) {
		case 'admin':
			return [
				Permissions.PhishApprove,
				Permissions.PhishSubmit,
				Permissions.PhishEdit,
				Permissions.PhishDelete,
				Permissions.PhishView,
				Permissions.PhishList,
				Permissions.UserList,
				Permissions.UserCreate,
				Permissions.UserEdit,
				Permissions.UserDelete,
			];
		case 'moderator':
			return [
				Permissions.PhishApprove,
				Permissions.PhishSubmit,
				Permissions.PhishEdit,
				Permissions.PhishView,
				Permissions.PhishList,
				Permissions.UserList,
			];
		case 'submitter':
			return [Permissions.PhishSubmit, Permissions.PhishView, Permissions.PhishList];
		case 'readonly':
			return [Permissions.PhishView, Permissions.PhishList];
		case 'readonly_restricted':
			return [Permissions.PhishView];
		default:
			return [];
	}
}
