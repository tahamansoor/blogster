import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';
import { CreateBlogDto } from './create-blog.dto';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
    @ApiPropertyOptional()
    @IsString()
    heading?: string;
    @ApiPropertyOptional()
    @IsString()
    content?: string;

    @ApiPropertyOptional()
    @IsUrl()
    thumbnailUrl?: string;
}
