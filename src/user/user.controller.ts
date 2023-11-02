import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto } from './dto/user-dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  loginUser(@Body() loginUserData: LoginUserDto) {
    this.userService.login(loginUserData);
    return this.userService.find();
  }
}
