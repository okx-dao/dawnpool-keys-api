export class EncryptedDto {
  version: number;
  uuid: string;
  path: string;
  pubkey: string;
  crypto: {
    kdf: {
      function: 'pbkdf2';
      params: {
        dklen: number;
        c: number;
        prf: 'hmac-sha256';
        salt: string;
      };
      message: '';
    };
    checksum: {
      function: 'sha256';
      params: NonNullable<unknown>;
      message: string;
    };
    cipher: {
      function: 'aes-128-ctr';
      params: {
        iv: string;
      };
      message: string;
    };
  };
}

// {"version":4,"uuid":"8cdd1c2d-9cd8-4489-9ee8-0a79049b2c72","path":"","pubkey":"","crypto":{"kdf":{"function":"pbkdf2","params":{"dklen":32,"c":262144,"prf":"hmac-sha256","salt":"290eb2077dc3e1e087ea5909b92f76109cdd1a03ad9ddc1e3ebc011858cd88f2"},"message":""},"checksum":{"function":"sha256","params":{},"message":"74bd3b85c33be4b7698d48677fd802acaf3f1b8f3d79b700a29e75aa4c0bf978"},"cipher":{"function":"aes-128-ctr","params":{"iv":"a40c58d6caf365849bcc269ba3622dea"},"message":""}}}
