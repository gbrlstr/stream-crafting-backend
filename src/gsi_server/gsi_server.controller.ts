import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { GsiServerService, IClientData } from './gsi_server.service';
import { DOTA2GSI } from 'dotagsi';

@Controller('gsi-server')
export class GsiServerController {
  constructor(private readonly gsiServerService: GsiServerService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  processGSIData(@Body() data: DOTA2GSI, @Req() req) {
    const token = req.body.auth.token as string;
    const client: IClientData = { hostname: req.hostname, token };
    this.gsiServerService.connectNewClient(client);
    return this.gsiServerService.processDOTAGSIData(data, client.token);
  }
}
