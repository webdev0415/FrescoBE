import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { InvitationTypeLinkUserEntity } from './invitation-type-link.entity';

@EntityRepository(InvitationTypeLinkUserEntity)
export class InvitationTypeLinkRepository extends Repository<
    InvitationTypeLinkUserEntity
> {}
