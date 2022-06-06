import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty()
    id:number;
    @ApiProperty()
    text:string
}
