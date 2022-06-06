import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PassportModule } from '@nestjs/passport';
import { jwtConfig } from 'src/config/jwt.config';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { BlogModule } from 'src/blog/blog.module';

@Module({
  imports:[
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(jwtConfig),
    AuthModule,
    BlogModule
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {
}
