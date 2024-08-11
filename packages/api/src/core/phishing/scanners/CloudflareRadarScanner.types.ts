export interface CloudflareRadarScannerResponse {
	errors: {
		/** @example Error */
		message: string;
	}[];
	messages: {
		/** @example OK */
		message: string;
	}[];
	result: {
		scan: {
			/** @description Dictionary of Autonomous System Numbers where ASN's are the keys */
			asns?: {
				/** @description ASN's contacted */
				asn?: {
					/** @example 15133 */
					asn: string;
					/** @example EDGECAST */
					description: string;
					/** @example US */
					location_alpha2: string;
					/** @example EDGECAST */
					name: string;
					/** @example Edgecast Inc. */
					org_name: string;
				};
			};
			certificates: {
				issuer: string;
				/** @example rkmod.somee.com */
				subjectName: string;
				/** @example 1682684400 */
				validFrom: number;
				/** @example 1696698000 */
				validTo: number;
			}[];
			domains?: {
				[key: string]: {
					categories: {
						content?: {
							id: number;
							/** @example Technology */
							name: string;
							super_category_id?: number;
						}[];
						inherited: {
							content?: {
								id: number;
								/** @example Technology */
								name: string;
								super_category_id?: number;
							}[];
							/** @example example.com */
							from?: string;
							risks?: {
								id: number;
								/** @example Technology */
								name: string;
								super_category_id?: number;
							}[];
						};
						risks?: {
							id: number;
							/** @example Technology */
							name: string;
							super_category_id?: number;
						}[];
					};
					dns: {
						/** @example 93.184.216.34 */
						address: string;
						dnssec_valid: boolean;
						/** @example example.com */
						name: string;
						/** @example A */
						type: string;
					}[];
					/** @example example.com */
					name: string;
					rank: {
						/** @example 500 */
						bucket: string;
						/** @example example.com */
						name: string;
						/** @description Rank in the Global Radar Rank, if set. See more at https://blog.cloudflare.com/radar-domain-rankings/ */
						rank?: number;
					};
					/** @example Apex domain */
					type: string;
				};
			};
			geo: {
				/** @description GeoIP continent location */
				continents: string[];
				/** @description GeoIP country location */
				locations: string[];
			};
			ips?: {
				ip?: {
					/** @example 15133 */
					asn: string;
					/** @example EDGECAST */
					asnDescription: string;
					/** @example US */
					asnLocationAlpha2: string;
					/** @example EDGECAST */
					asnName: string;
					/** @example Edgecast Inc. */
					asnOrgName: string;
					/** @example North America */
					continent: string;
					/** @example 6252001 */
					geonameId: string;
					/** @example 2606:2800:220:1:248:1893:25c8:1946 */
					ip: string;
					/** @example IPv6 */
					ipVersion: string;
					/** @example 39.76 */
					latitude: string;
					/** @example US */
					locationAlpha2: string;
					/** @example United States */
					locationName: string;
					/** @example -98.5 */
					longitude: string;
					subdivision1Name: string;
					subdivision2Name: string;
				};
			};
			links?: {
				link?: {
					/**
					 * @description Outgoing link detected in the DOM
					 * @example https://www.iana.org/domains/example
					 */
					href: string;
					/** @example More information... */
					text: string;
				};
			};
			meta: {
				processors: {
					categories: {
						content: {
							/** @example 155 */
							id: number;
							/** @example Technology */
							name: string;
							super_category_id?: number;
						}[];
						risks: {
							/** @example 17 */
							id: number;
							/** @example Newly Seen Domains */
							name: string;
							/** @example 32 */
							super_category_id: number;
						}[];
					};
					phishing: string[];
					rank: {
						/** @example 500 */
						bucket: string;
						/** @example example.com */
						name: string;
						/** @description Rank in the Global Radar Rank, if set. See more at https://blog.cloudflare.com/radar-domain-rankings/ */
						rank?: number;
					};
					tech: {
						categories: {
							groups: number[];
							/** @example 63 */
							id: number;
							/** @example IAAS */
							name: string;
							/** @example 8 */
							priority: number;
							/** @example iaas */
							slug: string;
						}[];
						/** @example 100 */
						confidence: number;
						description?: string;
						evidence: {
							impliedBy: string[];
							patterns: {
								/** @example 100 */
								confidence: number;
								excludes: string[];
								implies: string[];
								/** @example ECS */
								match: string;
								/**
								 * @description Header or Cookie name when set
								 * @example server
								 */
								name: string;
								/** @example ^ECS */
								regex: string;
								/** @example headers */
								type: string;
								/** @example ECS (dcb/7EEE) */
								value: string;
								version: string;
							}[];
						};
						/** @example Amazon ECS.svg */
						icon: string;
						/** @example Amazon ECS */
						name: string;
						/** @example amazon-ecs */
						slug: string;
						/** @example https://aws.amazon.com/ecs/ */
						website: string;
					}[];
				};
			};
			page: {
				/** @example 15133 */
				asn: string;
				/** @example US */
				asnLocationAlpha2: string;
				/** @example EDGECAST */
				asnname: string;
				console: {
					/** @example network */
					category: string;
					/** @example Failed to load resource: the server responded with a status of 404 (Not Found) */
					text: string;
					/** @example error */
					type: string;
					/** @example http://example.com/favicon.ico */
					url?: string;
				}[];
				cookies: {
					/** @example rkmod.somee.com */
					domain: string;
					/** @example -1 */
					expires: number;
					httpOnly: boolean;
					/** @example b */
					name: string;
					/** @example / */
					path: string;
					/** @example Medium */
					priority?: string;
					sameParty: boolean;
					secure: boolean;
					/** @example true */
					session: boolean;
					/** @example 2 */
					size: number;
					/** @example 443 */
					sourcePort: number;
					/** @example Secure */
					sourceScheme: string;
					/** @example b */
					value: string;
				}[];
				/** @example United States */
				country: string;
				/** @example US */
				countryLocationAlpha2: string;
				/** @example example.com */
				domain: string;
				headers: {
					/** @example Content-Length */
					name: string;
					/** @example 648 */
					value: string;
				}[];
				/** @example 2606:2800:220:1:248:1893:25c8:1946 */
				ip: string;
				js: {
					variables: {
						/** @example checkFrame */
						name: string;
						/** @example string */
						type: string;
					}[];
				};
				securityViolations: {
					/** @example csp */
					category: string;
					/** @example [Report Only] Refused to load the stylesheet 'https://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css' because it violates the following Content Security Policy directive: ...  */
					text: string;
					/** @example http://example.com/ */
					url: string;
				}[];
				/** @example 200 */
				status: number;
				subdivision1Name: string;
				subdivision2name: string;
				/** @example http://example.com/ */
				url: string;
			};
			performance: {
				/** @example 82.59999999403954 */
				connectEnd: number;
				/** @example 72.79999999701977 */
				connectStart: number;
				/** @example 1256 */
				decodedBodySize: number;
				/** @example 306 */
				domComplete: number;
				/** @example 305.8999999910593 */
				domContentLoadedEventEnd: number;
				/** @example 305.8999999910593 */
				domContentLoadedEventStart: number;
				/** @example 305.8999999910593 */
				domInteractive: number;
				/** @example 72.79999999701977 */
				domainLookupEnd: number;
				/** @example 2.199999988079071 */
				domainLookupStart: number;
				/** @example 306 */
				duration: number;
				/** @example 648 */
				encodedBodySize: number;
				/** @example navigation */
				entryType: string;
				/** @example 0.8999999910593033 */
				fetchStart: number;
				/** @example navigation */
				initiatorType: string;
				/** @example 306 */
				loadEventEnd: number;
				/** @example 306 */
				loadEventStart: number;
				/** @example http://example.com/ */
				name: string;
				/** @example http/1.1 */
				nextHopProtocol: string;
				redirectCount: number;
				redirectEnd: number;
				redirectStart: number;
				/** @example 82.69999998807907 */
				requestStart: number;
				/** @example 270.8999999910593 */
				responseEnd: number;
				/** @example 265.69999998807907 */
				responseStart: number;
				secureConnectionStart: number;
				startTime: number;
				/** @example 948 */
				transferSize: number;
				/** @example navigate */
				type: string;
				unloadEventEnd: number;
				unloadEventStart: number;
				workerStart: number;
			}[];
			task: {
				/**
				 * @description Submitter location
				 * @example PT
				 */
				clientLocation: string;
				/** @enum {string} */
				clientType: 'Site' | 'Automatic' | 'Api';
				/**
				 * @description URL of the primary request, after all HTTP redirects
				 * @example http://example.com/
				 */
				effectiveUrl: string;
				errors: {
					message: string;
				}[];
				scannedFrom: {
					/**
					 * @description IATA code of Cloudflare datacenter
					 * @example MAD
					 */
					colo: string;
				};
				/** @enum {string} */
				status: 'Queued' | 'InProgress' | 'InPostProcessing' | 'Finished';
				/** @example true */
				success: boolean;
				/** @example 2023-05-03T17:05:04.843Z */
				time: string;
				/** @example 2023-05-03T17:05:19.374Z */
				timeEnd: string;
				/**
				 * @description Submitted URL
				 * @example http://example.com
				 */
				url: string;
				/**
				 * @description Scan ID
				 * @example 2ee568d0-bf70-4827-b922-b7088c0f056f
				 */
				uuid: string;
				/** @enum {string} */
				visibility: 'Public' | 'Unlisted';
			};
			verdicts: {
				overall: {
					categories: {
						/** @example 117 */
						id: number;
						/** @example Malware */
						name: string;
						/** @example 32 */
						super_category_id: number;
					}[];
					/**
					 * @description At least one of our subsystems marked the site as potentially malicious at the time of the scan.
					 * @example true
					 */
					malicious: boolean;
					phishing: string[];
				};
			};
		};
	};
	/** @description Whether request was successful or not */
	success: boolean;
}
