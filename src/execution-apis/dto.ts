export interface SyncingDTO {
  head_slot: string;
  sync_distance: string;
  is_syncing: boolean;
  is_optimistic: boolean;
}

export interface GenesisDTO {
  genesis_time: string;
  genesis_validators_root: string;
  genesis_fork_version: string;
}

export interface StateDTO {
  previous_version: string;
  current_version: string;
  epoch: string;
}

export interface ValidatorInfoDTO {
  index: string;
  status: string;
  validator: {
    pubkey: string;
    exit_epoch: string;
  };
}
