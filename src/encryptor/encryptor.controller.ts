import { Body, Controller, Post } from '@nestjs/common';
import { EncryptorService } from './encryptor.service';
import { EncryptedDto } from './encrypted.dto';
import { ExitMessage } from '../common/ExitMessage';

@Controller('encryptor')
export class EncryptorController {
  constructor(private readonly encryptor: EncryptorService) {}

  // curl -X POST -d '{"message":{"epoch":"182698","validator_index":"486048"},"signature":"0xb5e49ec8157a50a8da21e2d76074a0d89c3c3e2cb79627fc8fe735118dce0f32c6f2cd4523b3372025ef4a72e4250995061c79ceb80876711e2640e57048b4a123857ebbec0380087ea1371272b53ea10220fa4e62f9cbcc40ba089b8fbb6506"}' -H "Content-Type: application/json" http://127.0.0.1:3000/encryptor/encrypt
  @Post('encrypt')
  encrypt(@Body() message: ExitMessage) {
    return this.encryptor.encrypt(JSON.stringify(message).toString());
  }

  // curl -X POST -d '{"version":4,"uuid":"b5173979-db37-4116-a78a-5019f79ae9f4","path":"","pubkey":"","crypto":{"kdf":{"function":"pbkdf2","params":{"dklen":32,"c":262144,"prf":"hmac-sha256","salt":"5fc1ddbf2180fa9f29fe634a2a899d01a756f7d460d1cc2e1f801656958c2acd"},"message":""},"checksum":{"function":"sha256","params":{},"message":"c104f59c9831807c285c12acfa5a53874820ad683138db11656f31eda30494ca"},"cipher":{"function":"aes-128-ctr","params":{"iv":"faa8d99f79e573f25a428e6eb09eec86"},"message":"a7c336fbb92addde546f18f8d8a12da26d512da79a80f57564ebbbd560e1fc42575eb62ea385f78cfd89808faa4f45cebcaa96dfe08ec27ba9a33ee080b2b8dae82d901079a8df03f745f03d430779fc12821a4bd049d10d53948acfc3aceb2c9157d49eb7fe452c0545cc66fad74b7ba3a49c00200c35b79d8cffbbc1550f144e42279fadcbe985dd539d30be43aea58e075097257abbfcd3614e178fe2b3bdef06f460cedf113170ab1dfbe2a7e1dec6184a950eb8261340c6eb04bf13d8e771b96439120b09e84a7aff0c8e83ac18b3806cc9c8b81482efb80eb608c3c6d20c15b8716ee973add648c078db949af84d58b1c63e02ad5085766cbf838e92242952f2e1e381559329af"}}}' -H "Content-Type: application/json" http://127.0.0.1:3000/encryptor/decrypt
  @Post('decrypt')
  decrypt(@Body() encrypted: EncryptedDto) {
    return this.encryptor.decrypt(encrypted);
  }
}
