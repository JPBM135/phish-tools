export enum Category {
	Malware = 'malware',
	Phishing = 'phishing',
	Safe = 'safe',
}

export enum Permission {
	Admin = 'admin',
	Domains = 'domains',
	Urls = 'urls',
}

export enum WebSocketDataTypes {
	DomainCreate = 'domain_create',
	DomainDelete = 'domain_delete',
	DomainUpdate = 'domain_update',
	UrlCreate = 'url_create',
	UrlDelete = 'url_delete',
	UrlUpdate = 'url_update',
}
