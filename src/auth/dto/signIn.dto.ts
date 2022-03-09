import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class signInCredentialsDto {
    @ApiProperty()
    @IsString()
    username:string;

    @ApiProperty()
    @IsString()
    password:string
}