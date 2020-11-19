'use strict';

import { BadRequestException } from '@nestjs/common';

export class InvitationAcceptedException extends BadRequestException {
    constructor(error?: string) {
        super('error.Invitation_accepted', error);
    }
}
