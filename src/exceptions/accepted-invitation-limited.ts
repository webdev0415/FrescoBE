'use strict';

import { BadRequestException } from '@nestjs/common';

export class InvitationLimitedException extends BadRequestException {
    constructor(error?: string) {
        super('error.Invitation_accepted', error);
    }
}
