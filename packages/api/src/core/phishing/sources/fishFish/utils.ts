import type {
	FishFishDomain,
	FishFishURL,
	FishFishWebSocketData,
	RawDomainData,
	RawURLData,
	RawWebSocketData,
} from './interfaces.js';

export function transformData<T = FishFishDomain | FishFishURL | FishFishWebSocketData<any>['data']>(
	data: RawDomainData | RawURLData | (Partial<{ added: number; checked?: number }> & RawWebSocketData<any>['data']),
): T {
	return {
		...data,
		added: data.added ? new Date(data.added) : new Date(),
		checked: data.checked ? new Date(data.checked) : new Date(),
	} as unknown as T;
}
