import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';

import { BoardUserOrgRepository } from '../board-user-org/board-user-org.repository';
import { CreateMessageDto } from './dto/CreateMessageDto';
import { DeleteMessageDto } from './dto/DeleteMessageDto';
import { MessageDto } from './dto/MessageDto';
import { MessageInfoDto } from './dto/MessageInfoDto';
import { UpdateMessageDto } from './dto/UpdateMessageDto';
import { MessageEntity } from './message.entity';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService {
    constructor(
        public readonly messageRepository: MessageRepository,
        public readonly boardUserOrgRepository: BoardUserOrgRepository,
    ) {}

    async find(boardId: string): Promise<MessageInfoDto[]> {
        const messages = await this.messageRepository.find({
            where: {
                boardId,
            },
        });

        return messages.map((m) => m.toDto());
    }

    async create(
        senderId: string,
        createMessageDto: CreateMessageDto,
    ): Promise<MessageDto> {
        const messageModel = new MessageEntity();
        messageModel.boardId = createMessageDto.boardId;
        messageModel.senderId = senderId;
        messageModel.message = createMessageDto.message;

        const message = await this.messageRepository.save(messageModel);

        return message.toDto();
    }

    async update(
        userId: string,
        id: string,
        updateMessageDto: UpdateMessageDto,
    ): Promise<UpdateMessageDto> {
        const message = await this.messageRepository.findOne(id);

        if (!message) {
            throw new NotFoundException();
        }
        if (message.senderId !== userId) {
            throw new UnauthorizedException();
        }

        message.message = updateMessageDto.message || message.message;
        const updatedMessage = await this.messageRepository.save(message);
        return updatedMessage.toDto();
    }

    async delete(id: string): Promise<void> {
        await this.messageRepository.delete(id);
    }

    async checkPermission(userId, boardId) {
        const message = await this.boardUserOrgRepository.find({
            where: {
                boardId,
                userId,
            },
        });
        if (!message || !message.length) {
            throw new NotFoundException();
        }
    }
}
