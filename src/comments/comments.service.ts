import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectConnection } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { BlogService } from 'src/blog/blog.service';
import { Request } from 'express';
import { Blog } from 'src/blog/entities/blog.entity';
import { Connection, getRepository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly authService:AuthService,
    private readonly blogService:BlogService,

    @Inject(REQUEST)
    private readonly request: Request,
  ) { }
  async create(createCommentDto: CreateCommentDto) {
    
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const userByRequest = this.request.user;
    const {id} = createCommentDto
    
    try {
      
      const findbyBlogId = await this.blogService.findByid(id)
      const cmtRepo = queryRunner.manager.getRepository(Comment)
      await cmtRepo.save({...createCommentDto,blogid:findbyBlogId.id,blog:findbyBlogId,user:userByRequest,userId:userByRequest['id']})
      await queryRunner.commitTransaction()
      
      
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException(error)
    }finally{
      await queryRunner.release()
    }
  }

  async findAll(blogId:number) {
    const cmtRepo = getRepository(Comment)
    const find = await cmtRepo.find({where:{blogId:blogId}})
    return find;
  }
  findAllUserComments(){
    const useridbyRequest = this.request.user['id']
    const cmtRepo = getRepository(Comment)
    const find = cmtRepo.find({where:{userId:useridbyRequest}})
    return find;
  }
  findOne(id: number) {
   try{ const useridbyRequest = this.request.user['id']
    const cmtRepo = getRepository(Comment)
    const find = cmtRepo.findOne({where:{id:id,userId:useridbyRequest}})
    if(!find){
      throw new BadRequestException()
    }
    return find
    }catch(error){
      throw new InternalServerErrorException(error)
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      
      const find = await this.findOne(id)
      if(find){ 
      const cmtRepo = queryRunner.manager.getRepository(Comment)
      await cmtRepo.update({id},updateCommentDto)
      await queryRunner.commitTransaction()
      const cmt = await this.findOne(id);
      return cmt;
      }if(!find){
       
        throw new NotFoundException(`comment by ${id} not found` )

      }
      
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException(error)
      
    }finally{
      await queryRunner.release()
    }
  }

  async remove(id: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const find = await this.findOne(id)
      if(find){
      const cmtRepo = await queryRunner.manager.getRepository(Comment)
      await cmtRepo.softDelete({id})
      queryRunner.commitTransaction()
      
      }if(!find){
        throw new NotFoundException(`comment by ${id} no found`)
      }
    } catch (error) {
      queryRunner.rollbackTransaction()
      throw new InternalServerErrorException(error)
    }
  }
}
