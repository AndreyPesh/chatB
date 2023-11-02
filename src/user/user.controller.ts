import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from './dto/user-dto';

@Controller()
export class UserController {
  @Post('login')
  loginUser(@Body() loginUserData: LoginUserDto) {
    return loginUserData;
  }
}
