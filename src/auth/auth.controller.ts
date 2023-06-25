import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // @Post('sign')
  // sign(@Body() message: MessageDTO) {
  //   return this.auth.signMessage(message);
  // }

  @Post()
  signIn(@Body() signIn: SignInDTO) {
    const access_token = this.auth.signIn(signIn);
    return access_token;
  }
}
