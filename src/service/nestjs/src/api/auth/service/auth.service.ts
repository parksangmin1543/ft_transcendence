import { BadRequestException, Injectable, NotFoundException, HttpException } from '@nestjs/common';
import UserService from 'api/user/user.service';
import * as Dto from '../dto';
import { UserModel } from 'common/model';

@Injectable()
export class AuthService {
	constructor(private userSerivice: UserService) {}

	async login(intraId: string): Promise<UserModel> {
		try {
			const user = await this.userSerivice.findByIntraId(intraId);
			if (!user) {
				throw new NotFoundException('User is not found');
			}

			return user;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async register(intraId: string, registerRequestDto: Dto.Request.Register) {
		try {
			let user = await this.userSerivice.findByIntraId(intraId);
			if (user) {
				throw new BadRequestException('User is already registered');
			}
			user = await this.userSerivice.findByNickname(registerRequestDto.nickname);
			if (user) {
				throw new BadRequestException('Nickname is already taken');
			}
			if (registerRequestDto.use2fa === 'true' && !registerRequestDto.email2fa) {
				throw new BadRequestException('Email used in 2fa is empty');
			}
			return await this.userSerivice.create(intraId, registerRequestDto);
		} catch (error) {
			throw new HttpException(error.message, error.status);
		}
	}
}
