import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, getRepository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import internal from 'stream';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private readonly authService:AuthService,

    @Inject(REQUEST)
    private readonly request: Request,
  ) { }
  async create(createBlogDto: CreateBlogDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const blogRepo = queryRunner.manager.getRepository(Blog)
      const userByRequest = this.request['user'];
      await blogRepo.save({...createBlogDto,user:userByRequest})
      await queryRunner.commitTransaction()
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }finally{
      queryRunner.release();
    }
  }

  async findAll() {
    try{
      const blogRepo = getRepository(Blog)
      const userId = await this.authService.getUserId()
      console.log(userId)
      const result = await blogRepo.createQueryBuilder('blg')
      .where('blg.userId = :userId',{userId})
      .leftJoinAndSelect('blg.user','user')
      .getMany()
      return result;
      
    }catch(error){
      throw new InternalServerErrorException(error);
    }

  }

  async findOne(id: number) {
    try{
      const blogRepo = getRepository(Blog)
      const userId = this.authService.getUserId()
      console.log({userId})
      const result = await blogRepo.findOne({where:{id,userId}})
      console.log({result})
      if(!result) {
        throw new BadRequestException('invalid id')
      };
      return result;
    }catch(error){
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      console.log('kkk')
      await this.findOne(id)
      const blogRepo = queryRunner.manager.getRepository(Blog)
      await blogRepo.update({id},updateBlogDto)
      await queryRunner.commitTransaction()
      const blog = await this.findOne(id); 
      return  blog;
    }catch (error) {
      await queryRunner.rollbackTransaction()
      console.log('bb')
      throw new InternalServerErrorException(error)
    }
    finally{
      await queryRunner.release()
    }
  }

  async remove(id: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      
      const blogRepo = queryRunner.manager.getRepository(Blog)
      await this.findOne(id)
      await blogRepo.softDelete(id)
      await queryRunner.commitTransaction()

    } catch (error) {
      queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error)
    }
    
  }
  async findByid(id:number){
    const blogRepo = getRepository(Blog)
    const res = await blogRepo.findOne({where:{id}})
    console.log(res)
    return res;
  }
}
