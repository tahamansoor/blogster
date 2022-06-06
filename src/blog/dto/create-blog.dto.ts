import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUrl } from "class-validator";

export class CreateBlogDto {
    @ApiProperty({maxLength:100})
    @IsString()
    heading:string;
    @ApiProperty({maxLength:676})
    @IsString()
    content:string;
    
    @ApiProperty()
    thumbnailUrl:string;
}
