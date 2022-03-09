import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppService } from './app.service';
require('dotenv').config()

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('upload')
    @UseInterceptors(FileInterceptor('file',
      {
        storage: diskStorage({
          destination: './upload', 
           filename: function ( req, file, cb ) {
            //req.body is empty...
            cb( null, file.originalname );
        }})
      }
    )
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File,
    ) {
      const makeUrl = {Picture:`${process.env.BASE_URL}${file.originalname}`}
      return makeUrl; 
    }
}
