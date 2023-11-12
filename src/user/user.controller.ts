import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { User } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/auth/strategies/accessToken.strategy';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get('all')
  async getAllUser() {
    return await this.userService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get('current')
  async getCurrentUser(@User() user: JwtPayload) {
    return await this.userService.findById(user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
