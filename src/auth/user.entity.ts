import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Exclude } from "class-transformer";
import { Blog } from "src/blog/entities/blog.entity";


@Entity()
@Unique(['username'])
export class User extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:true})
    Name:string;

    @Column()
    username:string;

    @Column({nullable: true})
    profilePic:string;

    @Exclude({toPlainOnly:true})
    @Column()
    password:string;
    
    @Exclude({toPlainOnly:true})
    @Column({nullable: true})
    salt:string;


    async validatepassword(password:string):Promise<boolean>{
        const hash = await bcrypt.hash(password, this.salt)
        return hash === this.password;

    }

    
}