import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Post(':formId')
  create(@Param('formId') formId: string, @Body() body: { answers: Record<string, any> }) {
    return this.responsesService.create(formId, body.answers);
  }

  @Get(':formId')
  @UseGuards(JwtAuthGuard)
  findByForm(@Param('formId') formId: string) {
    return this.responsesService.findByForm(formId);
  }

  @Get(':formId/count')
  @UseGuards(JwtAuthGuard)
  countByForm(@Param('formId') formId: string) {
    return this.responsesService.countByForm(formId);
  }
}