/* tslint:disable */
/* eslint-disable */


/**
 * AUTO-GENERATED FILE - DO NOT EDIT!
 *
 * This file was automatically generated by pg-to-ts v.4.1.1
 * $ pg-to-ts generate -c postgresql://username:password@localhost:5432/phishtools -t domains_cache -t knex_migrations -t knex_migrations_lock -t phishing -t phishing_logs -t phishing_scans -t phishing_veredicts -t users -t users_tokens -s public
 *
 */


export type Json = unknown;
export type domains_cache_category = 'malicious' | 'safe' | 'unknown';
export type domains_cache_source = 'open_phish';
export type phishing_scan_source = 'check_phish_ai' | 'cloudflare_radar' | 'phish_observer' | 'urlscan';
export type phishing_scan_status = 'failed' | 'pending' | 'success';
export type phishing_user_role = 'admin' | 'moderator' | 'readonly' | 'readonly_restricted' | 'submitter';
export type phishing_veredicts_source = 'abuse_ch' | 'azroult_tracker' | 'fish_fish' | 'open_phish' | 'transparency_report';
export type phishing_veredicts_status = 'error' | 'malicious' | 'rate_limited' | 'safe' | 'unknown';

// Table domains_cache
export interface DomainsCache {
  id: string;
  url: string | null;
  domain: string;
  category: domains_cache_category;
  source: domains_cache_source;
  created_at: Date;
}
export interface DomainsCacheInput {
  id?: string;
  url?: string | null;
  domain: string;
  category: domains_cache_category;
  source: domains_cache_source;
  created_at?: Date;
}
const domains_cache = {
  tableName: 'domains_cache',
  columns: ['id', 'url', 'domain', 'category', 'source', 'created_at'],
  requiredForInsert: ['domain', 'category', 'source'],
  primaryKey: 'id',
  foreignKeys: {},
  $type: null as unknown as DomainsCache,
  $input: null as unknown as DomainsCacheInput
} as const;

// Table knex_migrations
export interface KnexMigrations {
  id: number;
  name: string | null;
  batch: number | null;
  migration_time: Date | null;
}
export interface KnexMigrationsInput {
  id?: number;
  name?: string | null;
  batch?: number | null;
  migration_time?: Date | null;
}
const knex_migrations = {
  tableName: 'knex_migrations',
  columns: ['id', 'name', 'batch', 'migration_time'],
  requiredForInsert: [],
  primaryKey: 'id',
  foreignKeys: {},
  $type: null as unknown as KnexMigrations,
  $input: null as unknown as KnexMigrationsInput
} as const;

// Table knex_migrations_lock
export interface KnexMigrationsLock {
  index: number;
  is_locked: number | null;
}
export interface KnexMigrationsLockInput {
  index?: number;
  is_locked?: number | null;
}
const knex_migrations_lock = {
  tableName: 'knex_migrations_lock',
  columns: ['index', 'is_locked'],
  requiredForInsert: [],
  primaryKey: 'index',
  foreignKeys: {},
  $type: null as unknown as KnexMigrationsLock,
  $input: null as unknown as KnexMigrationsLockInput
} as const;

// Table phishing
export interface Phishing {
  id: string;
  domain: string;
  url: string;
  hidden: boolean;
  created_at: Date;
  updated_at: Date;
}
export interface PhishingInput {
  id?: string;
  domain: string;
  url: string;
  hidden?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
const phishing = {
  tableName: 'phishing',
  columns: ['id', 'domain', 'url', 'hidden', 'created_at', 'updated_at'],
  requiredForInsert: ['domain', 'url'],
  primaryKey: 'id',
  foreignKeys: {},
  $type: null as unknown as Phishing,
  $input: null as unknown as PhishingInput
} as const;

// Table phishing_logs
export interface PhishingLogs {
  id: string;
  phishing_id: string;
  message: string;
  metadata: Json;
  created_at: Date;
}
export interface PhishingLogsInput {
  id?: string;
  phishing_id: string;
  message: string;
  metadata?: Json;
  created_at?: Date;
}
const phishing_logs = {
  tableName: 'phishing_logs',
  columns: ['id', 'phishing_id', 'message', 'metadata', 'created_at'],
  requiredForInsert: ['phishing_id', 'message'],
  primaryKey: 'id',
  foreignKeys: { phishing_id: { table: 'phishing', column: 'id', $type: null as unknown as Phishing }, },
  $type: null as unknown as PhishingLogs,
  $input: null as unknown as PhishingLogsInput
} as const;

// Table phishing_scans
export interface PhishingScans {
  id: string;
  phishing_id: string;
  status: phishing_scan_status;
  source: phishing_scan_source;
  scan_id: string;
  created_at: Date;
  updated_at: Date;
}
export interface PhishingScansInput {
  id?: string;
  phishing_id: string;
  status?: phishing_scan_status;
  source: phishing_scan_source;
  scan_id: string;
  created_at?: Date;
  updated_at?: Date;
}
const phishing_scans = {
  tableName: 'phishing_scans',
  columns: ['id', 'phishing_id', 'status', 'source', 'scan_id', 'created_at', 'updated_at'],
  requiredForInsert: ['phishing_id', 'source', 'scan_id'],
  primaryKey: 'id',
  foreignKeys: { phishing_id: { table: 'phishing', column: 'id', $type: null as unknown as Phishing }, },
  $type: null as unknown as PhishingScans,
  $input: null as unknown as PhishingScansInput
} as const;

// Table phishing_veredicts
export interface PhishingVeredicts {
  id: string;
  phishing_id: string;
  status: phishing_veredicts_status;
  source: phishing_veredicts_source;
  veredict_id: string | null;
  metadata: Json;
  created_at: Date;
  updated_at: Date;
}
export interface PhishingVeredictsInput {
  id?: string;
  phishing_id: string;
  status?: phishing_veredicts_status;
  source: phishing_veredicts_source;
  veredict_id?: string | null;
  metadata?: Json;
  created_at?: Date;
  updated_at?: Date;
}
const phishing_veredicts = {
  tableName: 'phishing_veredicts',
  columns: ['id', 'phishing_id', 'status', 'source', 'veredict_id', 'metadata', 'created_at', 'updated_at'],
  requiredForInsert: ['phishing_id', 'source'],
  primaryKey: 'id',
  foreignKeys: { phishing_id: { table: 'phishing', column: 'id', $type: null as unknown as Phishing }, },
  $type: null as unknown as PhishingVeredicts,
  $input: null as unknown as PhishingVeredictsInput
} as const;

// Table users
export interface Users {
  id: string;
  /** Email address */
  email: string;
  /** Password */
  password: string;
  /** Name */
  name: string;
  /** Creation date */
  created_at: Date;
  /** Last update date */
  updated_at: Date;
}
export interface UsersInput {
  id?: string;
  /** Email address */
  email: string;
  /** Password */
  password: string;
  /** Name */
  name: string;
  /** Creation date */
  created_at?: Date;
  /** Last update date */
  updated_at?: Date;
}
const users = {
  tableName: 'users',
  columns: ['id', 'email', 'password', 'name', 'created_at', 'updated_at'],
  requiredForInsert: ['email', 'password', 'name'],
  primaryKey: 'id',
  foreignKeys: {},
  $type: null as unknown as Users,
  $input: null as unknown as UsersInput
} as const;

// Table users_tokens
export interface UsersTokens {
  id: string;
  user_id: string;
  token_id: string;
  permissions: string[];
  expires_at: Date | null;
  created_at: Date;
}
export interface UsersTokensInput {
  id?: string;
  user_id: string;
  token_id: string;
  permissions: string[];
  expires_at?: Date | null;
  created_at?: Date;
}
const users_tokens = {
  tableName: 'users_tokens',
  columns: ['id', 'user_id', 'token_id', 'permissions', 'expires_at', 'created_at'],
  requiredForInsert: ['user_id', 'token_id', 'permissions'],
  primaryKey: 'id',
  foreignKeys: { user_id: { table: 'users', column: 'id', $type: null as unknown as Users }, },
  $type: null as unknown as UsersTokens,
  $input: null as unknown as UsersTokensInput
} as const;


export interface TableTypes {
  domains_cache: {
    select: DomainsCache;
    input: DomainsCacheInput;
  };
  knex_migrations: {
    select: KnexMigrations;
    input: KnexMigrationsInput;
  };
  knex_migrations_lock: {
    select: KnexMigrationsLock;
    input: KnexMigrationsLockInput;
  };
  phishing: {
    select: Phishing;
    input: PhishingInput;
  };
  phishing_logs: {
    select: PhishingLogs;
    input: PhishingLogsInput;
  };
  phishing_scans: {
    select: PhishingScans;
    input: PhishingScansInput;
  };
  phishing_veredicts: {
    select: PhishingVeredicts;
    input: PhishingVeredictsInput;
  };
  users: {
    select: Users;
    input: UsersInput;
  };
  users_tokens: {
    select: UsersTokens;
    input: UsersTokensInput;
  };
}

export const tables = {
  domains_cache,
  knex_migrations,
  knex_migrations_lock,
  phishing,
  phishing_logs,
  phishing_scans,
  phishing_veredicts,
  users,
  users_tokens,
}
