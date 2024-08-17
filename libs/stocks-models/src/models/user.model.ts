import { Entity, Column } from 'typeorm';

import { Base } from './base.model';

@Entity()
export class User extends Base {
  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ default: true })
  isActive: boolean;
}
