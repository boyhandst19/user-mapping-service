import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
} from 'typeorm';

@Entity('user_mappings')
@Unique(['id1', 'id2'])
export class UserMapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  id1: string;

  @Column({ type: 'varchar', length: 255 })
  id2: string;

  @Column({ type: 'varchar', length: 36 })
  userID: string;

  @CreateDateColumn()
  createdAt: Date;
}
