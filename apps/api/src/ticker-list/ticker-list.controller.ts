import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { TickerList } from '@stocks/models';

import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('ticker-list')
export class TickerListController {
  @Get('')
  async getAll() {}

  @Get(':id')
  async get(@Param('id') id: string) {}

  @Get(':keyword')
  async find(@Param('keyword') keyword: string) {}

  @Post('create')
  async create(@Body() dto: TickerList) {}

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: TickerList) {}
}
