import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';
import {signInCredentialsDto} from './dto/signIn.dto'
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';


@Injectable()
export class AuthService {
    constructor( @InjectRepository(UserRepository)
     private userRepository: UserRepository,
     private jwtservice: JwtService,
     ){}

    async signUP(authCredentialsDto:AuthCredentialsDto):Promise<User>{
        return await this.userRepository.signUP(authCredentialsDto)

    }
    async signIn(signInCredentialsDto:signInCredentialsDto):Promise<{accessToken:string,user:User}>{
        const user = await this.userRepository.findOne({username:signInCredentialsDto.username})
        console.log(user)
        if(user && await bcrypt.compare(signInCredentialsDto.password,user.password) ){
        const payload:JwtPayload = {...user};
        const accessToken = await this.jwtservice.sign(payload)
        console.log(await bcrypt.compare(signInCredentialsDto.password,user.password))
        
        return {user,accessToken}
            
        }
        else{
            throw new UnauthorizedException('invalid credential')
        }
    }

}
