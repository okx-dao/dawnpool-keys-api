export interface syncingDTO {
  head_slot: string;
  sync_distance: string;
  is_syncing: boolean;
  is_optimistic: boolean;
}

export interface genesisDTO {
  genesis_time: string;
  genesis_validators_root: string;
  genesis_fork_version: string;
}

export interface stateDTO {
  previous_version: string;
  current_version: string;
  epoch: string;
}

export interface validatorInfoDTO {
  index: string;
  status: string;
  validator: {
    pubkey: string;
    exit_epoch: string;
  };
}

export interface FinalityCheckpointsDTO {
  current_justified: {
    epoch: string;
    root: string;
  };
}
