import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';
import {signInCredentialsDto} from './dto/signIn.dto'
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';


@Injectable()
export class AuthService {
    constructor( @InjectRepository(UserRepository)
     private userRepository: UserRepository,
     private jwtservice: JwtService,
     @Inject(REQUEST)
    private readonly request: Request,
     ){}

    async signUP(authCredentialsDto:AuthCredentialsDto):Promise<User>{
        return await this.userRepository.signUP(authCredentialsDto)

    }
    async signIn(signInCredentialsDto:signInCredentialsDto):Promise<{accessToken:string,user:User}>{
        const user = await this.userRepository.findOne({username:signInCredentialsDto.username})
        console.log(user)
        if(user && await bcrypt.compare(signInCredentialsDto.password,user.password) ){
        // const payload:JwtPayload = {...user};
        // const accessToken = await this.jwtservice.sign(user)
        const accessToken = await this.jwtservice.sign({
            username: user.username,
            id: user.id,
          });
        console.log(await bcrypt.compare(signInCredentialsDto.password,user.password))
        
        return {user,accessToken}
            
        }
        else{
            throw new UnauthorizedException('invalid credential')
        }
    }

    getUserId(){
        try {
            const id = this.request.user['id']
            return id
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

}
