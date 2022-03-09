import { IsString,IsUrl,MaxLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialsDto {

    @ApiProperty()
    @IsString()
    name:string;

    @ApiProperty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @ApiProperty({
        minimum: 8
    })
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password:string;

    @ApiProperty()
    @IsString()
    @IsUrl()
    profilePic:string;

    
}
