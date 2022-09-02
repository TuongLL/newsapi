import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompareBcrypt, HashBcrypt } from '../utils';
import { AuthDto } from './dto';
import { UserDto } from './models/user.schema';
import { Tokens } from './types';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(@InjectModel('users') private userModel: Model<UserDto>, private readonly jwtService: JwtService) { }

    async login(dto: AuthDto): Promise<Tokens> {
        const user = await this.userModel.findOne({ email: dto.email })
        if (!user) throw new HttpException({
            status: "EMAIL_NOT_FOUND",
            message: "Email not found"
        }, HttpStatus.FORBIDDEN);
        const check = await CompareBcrypt(dto.password, user.password)
        if (!check) throw new HttpException({
            status: "PASSWORD_INCORRECT",
            message: "Password is incorrect"
        }, HttpStatus.FORBIDDEN);
        const tokens = await this.getTokens(user.id, user.email)
        await this.updateRtHash(user.id, tokens.refresh_token)
        return tokens
    }

    async register(dto: AuthDto): Promise<Tokens> {
        const newUser = new this.userModel({
            _id: `user_${uuidv4()}`,
            email: dto.email,
            password: await HashBcrypt(dto.password)
        })

        const tokens = await this.getTokens(newUser.id, newUser.email)
        await newUser.save()
        await this.updateRtHash(newUser.id, tokens.refresh_token)
        return tokens
    }

    async logout(userId: string) {
        try {
            const user = await this.userModel.findById(userId)
            if (!user) throw new HttpException("Could not found user", HttpStatus.FORBIDDEN)
            user.hashedRt = null;
            user.save()
            return new HttpException("Logout successfully",HttpStatus.OK)
        } catch (err) {
            throw new HttpException("Could not found user", HttpStatus.FORBIDDEN)
        }

    }

    async refresh(userId: string, rt: string) {
        const user = await this.userModel.findById(userId)
        if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');
        const rtMatch = await CompareBcrypt(rt, user.hashedRt)
        if (!rtMatch) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(userId, rt);
        await this.updateRtHash(user.id, tokens.refresh_token)

        return tokens;
    }

    async signAccessToken(userId: string, email: string) {
        return this.jwtService.signAsync({
            sub: userId,
            email
        }, {
            secret: 'access-token',
            expiresIn: 60 * 15
        })
    }
    async signRefreshToken(userId: string, email: string) {
        return this.jwtService.signAsync({
            sub: userId,
            email
        }, {
            secret: 'refresh-token',
            expiresIn: 60 * 60 * 24 * 30
        })
    }
    async getTokens(userId: string, email: string): Promise<Tokens> {
        const [accessToken, refreshToken] = await Promise.all([
            this.signAccessToken(userId, email),
            this.signRefreshToken(userId, email),
        ])
        return {
            access_token: accessToken,
            refresh_token: refreshToken
        }
    }

    async updateRtHash(userId: string, rt: string) {
        let user;
        const hash = await HashBcrypt(rt);
        try {
            user = await this.userModel.findById(userId).exec()
            user.hashedRt = hash
            user.save()
        } catch (err) {
            throw new HttpException("Could not found user", HttpStatus.FORBIDDEN)
        }
        if (!user) {
            throw new HttpException("Could not found user", HttpStatus.FORBIDDEN)
        }
    }
}
