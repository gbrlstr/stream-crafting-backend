import { Injectable, Logger } from '@nestjs/common';
import { Dota2, DOTA2GSI } from 'dotagsi';
import { GS_DRAFT, GS_STRAT } from 'src/constants';

export interface IClientData {
  hostname: string;
  token: string;
  data?: Dota2;
}
@Injectable()
export class GsiServerService {
  private readonly GSI: DOTA2GSI;
  private clients = new Set<IClientData>();

  constructor() {
    this.GSI = new DOTA2GSI();
    this.GSI.on('data', (dota2) => this.handleGSIDOTA(dota2));
  }

  processDOTAGSIData(data: DOTA2GSI, token: string) {
    const requestData = JSON.stringify(data);

    const newdata = requestData
      .toString()
      .replace(/"(player|owner)":([ ]*)([0-9]+)/gm, '"$1": "$3"')
      .replace(/(player|owner):([ ]*)([0-9]+)/gm, '"$1": "$3"');

    const gsiData = JSON.parse(newdata);
    this.GSI.digest(gsiData);

    if (gsiData.auth.token !== token) {
      return { status: 'error', message: 'Invalid token' };
    }

    const currentClient = [...this.clients].find((c) => c.token === token);
    if (currentClient) {
      currentClient.data = gsiData;
    }
    return { status: 'success' };
  }

  connectNewClient(client: IClientData) {
    const clientConnected = [...this.clients].some(
      (c) => c.hostname === client.hostname,
    );
    if (clientConnected) {
      return;
    }
    this.clients.add(client);
    Logger.log(`New client Dota2 connected: ${client.hostname}`, 'GSI_SERVER');
    Logger.log(`Total clients connected: ${this.clients.size}`, 'GSI_SERVER');
  }

  handleGSIDOTA(gameData: Dota2) {
    switch (gameData.map.game_state) {
      case GS_DRAFT: // DRAFT TIME
        console.log(gameData.draft.activeteam);

        // console.log(gameData.hero);
        break;
      case GS_STRAT: // START GAME
        console.log('Strategy time!');
        break;
    }
  }
}
