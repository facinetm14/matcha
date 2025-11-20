import { AccessTokenService } from '@/core/ports/services/access-token.service';
import { TYPE } from '@/infrastructure/config/inversify-type';
import { Request, Response } from 'express';

import { inject, injectable } from 'inversify';
import { getConnectedUserId } from '../middlewares/get-connected-user';
import { GetUserChannelsUseCase } from '@/core/usecases/chat/get-user-channels.usecase';

@injectable()
export class ChatController {
  constructor(
    @inject(TYPE.AccessTokenService)
    private readonly accessTokenService: AccessTokenService,
    @inject(GetUserChannelsUseCase)
    private readonly getUserChannelsUseCase: GetUserChannelsUseCase,
  ) {}

  async findUserChannels(req: Request, resp: Response) {
    const connectedUserResult = await getConnectedUserId(
      this.accessTokenService,
      req,
      resp,
    );

    if (connectedUserResult.isErr) {
      resp.status(401).send('Invalid token');
      return;
    }

    const channelList = await this.getUserChannelsUseCase.execute(
      connectedUserResult.data,
    );

    resp.status(200).send(channelList);
  }
}
