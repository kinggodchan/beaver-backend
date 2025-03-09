import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Inquiry {
  @PrimaryGeneratedColumn()
  inquiry_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 20 })
  phone_number: string;

  @Column('text')
  reason: string;

  @CreateDateColumn()
  created_at: Date;
}
