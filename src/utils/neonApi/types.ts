// In snake case because of neon API
export type NeonDB = {
  id: string;
  branch_id: string;
  name: string;
  owner_name: string;
  created_at: string;
  updated_at: string;
};

export type NeonProject = {
  id: string;
  platform_id: string;
  region_id: string;
  name: string;
  provisioner: string;
  settings?: any;
  pg_version: string;
  proxy_host: string;
  branch_logical_size_limit: number;
  branch_logical_size_limit_bytes: number;
  store_passwords: boolean;
  active_time: number;
  cpu_used_sec: number;
  maintenance_starts_at?: Date;
  creation_source: string;
  created_at: Date;
  updated_at: Date;
  synthetic_storage_size?: number;
  quota_reset_at?: string;
  owner_id: string;
  compute_last_active_at?: Date;
  org_id?: string;
};

export type DeletedDatabase = {
  database: NeonDB;
  operations: Array<any>;
};
