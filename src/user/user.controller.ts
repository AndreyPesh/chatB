import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
