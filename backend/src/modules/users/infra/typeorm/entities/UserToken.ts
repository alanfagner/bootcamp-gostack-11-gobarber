import {
  Entity,
  Column,
  Generated,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_tokens')
class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated('uuid')
  token: string;

  @Column({ name: 'user_id' })
  userID: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAT: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAT: Date;
}

export default UserToken;
