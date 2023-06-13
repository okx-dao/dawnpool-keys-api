export interface ExitMessage {
  message: {
    epoch: string;
    validator_index: string;
  };
  signature: string;
}
