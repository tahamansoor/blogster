require('dotenv').config()
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/auth/user.entity";
import { Blog } from "src/blog/entities/blog.entity";
import { Comment } from "src/comments/entities/comment.entity";


export const typeOrmConfig: TypeOrmModuleOptions = {
// 
    type: 'postgres',
    host:process.env.HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'test',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '12345678',    
    entities: [User,Blog,Comment],
    synchronize: true
}
console.log(typeOrmConfig)