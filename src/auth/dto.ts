export interface SignedDTO {
  message: string;
  messageHash: string;
  r: string;
  s: string;
  v: number;
  signature: string;
}

export interface SignInDTO {
  signer: string;
  signed: SignedDTO;
}

export interface MessageDTO {
  value: string;
}
