import { Body, Controller, Post,ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import {signInCredentialsDto} from './dto/signIn.dto'

@Controller('auth')

export class AuthController {
    constructor(
        private authservice : AuthService,
    ){}


    @Post('/signup')
    signUP(@Body(ValidationPipe)authCredentialsDto:AuthCredentialsDto):Promise<User>{
     return this.authservice.signUP(authCredentialsDto)


    }
    
    
    @Post('/signin')
    async signIn(@Body(ValidationPipe)signInCredentialsDto:signInCredentialsDto):Promise<{accessToken:string,user:User}>{
        // console.log(await this.authservice.signIn(signInCredentialsDto))
        console.log('kkk')
        return await this.authservice.signIn(signInCredentialsDto)
    }
}
