import { User } from "src/auth/user.entity";
import { Blog } from "src/blog/entities/blog.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    text:string;

    @Column({nullable:true})
    userId:number;

    @ManyToOne(()=>User)
    user:User;

    @Column({nullable:true})
    blogId:number
    
    @ManyToOne(()=>Blog)
    blog:Blog;


    @CreateDateColumn()
    CreatedOn:Date;

    @UpdateDateColumn()
    UpdatedOn:Date;

    @DeleteDateColumn()
    DeletedOn:Date;

}
