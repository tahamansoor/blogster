import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import e, { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, getRepository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import internal from 'stream';

@Injectable()
export class BlogService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
    private jwtService: JwtService,
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
      const userByRequest = await this.request.user
      const result = blogRepo.find({user:userByRequest})
      return result;
      
    }catch(error){
      throw new InternalServerErrorException();
    }

  }

  async findOne(id: number) {
    try{
      const blogRepo = getRepository(Blog)
      const userByRequest = await this.request.user
      console.log(userByRequest)
      // const result =  (await blogRepo.find({ user: userByRequest })).find(blog => blog.id === id)
      const result = await blogRepo.findOne({where:{id,userId:userByRequest}})
      if(!result) throw new BadRequestException('invalid id');

      return result;
    }catch(error){
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.findOne(id)
      // const blogRepo = queryRunner.manager.getRepository(Blog)
      // await blogRepo.update({id},updateBlogDto)
      await queryRunner.commitTransaction()
      const blog = await this.findOne(id); 
      return  blog;
    }catch (error) {
      queryRunner.rollbackTransaction()
      throw new InternalServerErrorException(error)
    }finally{
      queryRunner.release()
    }
  }

  async remove(id: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const find = await this.findOne(id)
      const blogRepo = queryRunner.manager.getRepository(Blog)
      await this.findOne(id)
      await blogRepo.softDelete(id)
      await queryRunner.commitTransaction()
    } catch (error) {
      
    }
    
  }
}
