import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import UserModule from './user/user.module';
import ChatroomModule from './chatroom/chatroom.module';
import BlockModule from './block/block.module';
import PrismaModule from 'common/prisma/prisma.module';
import FriendModule from './friend/friend.module';

@Module({
	imports: [PrismaModule, UserModule, FriendModule, BlockModule, ChatroomModule, AuthModule],
})
class ApiModule {}

export default ApiModule;
