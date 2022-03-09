import { User } from "src/auth/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    heading:string;

    @Column()
    content:string;

    @Column()
    thumbnailUrl:string;

    @CreateDateColumn()
    createdOn:Date;

    @UpdateDateColumn()
    UpdatedOn:Date;

    @DeleteDateColumn()
    deletedOn:Date;
    @Column({nullable:true})
    userId : number

    @ManyToOne(()=>User)
    user:User

}
