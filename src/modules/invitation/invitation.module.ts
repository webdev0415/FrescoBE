import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../../modules/auth/auth.module';
import { MailModule } from '../../modules/mail/mail.module';
import { UserToOrgRepository } from '../../modules/user-org/user-org.repository';
import { UserModule } from '../../modules/user/user.module';
import { InvitationController } from './invitation.controller';
import { InvitationRepository } from './invitation.repository';
import { InvitationService } from './invitation.service';

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => MailModule),
        forwardRef(() => AuthModule),
        TypeOrmModule.forFeature([InvitationRepository, UserToOrgRepository]),
    ],
    controllers: [InvitationController],
    providers: [InvitationService],
    exports: [InvitationService],
})
export class InvitationModule {}
