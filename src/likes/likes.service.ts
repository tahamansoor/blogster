import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectConnection } from '@nestjs/typeorm';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { BlogService } from 'src/blog/blog.service';
import { Connection } from 'typeorm';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly authService:AuthService,
    private readonly blogService:BlogService,

    @Inject(REQUEST)
    private readonly request: Request,
  ) { }
  create(createLikeDto: CreateLikeDto) {
    return 'This action adds a new like';
  }

  findAll() {
    return `This action returns all likes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  update(id: number, updateLikeDto: UpdateLikeDto) {
    return `This action updates a #${id} like`;
  }

  remove(id: number) {
    return `This action removes a #${id} like`;
  }
}
