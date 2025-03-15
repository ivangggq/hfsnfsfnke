import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Document } from '../documents/document.entity';
import { InferredRiskScenario } from '../documents/services/ai-inference.service';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, nullable: true })
  industry: string;

  @Column({ length: 100, nullable: true })
  location: string;

  @Column({ nullable: true })
  size: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  logo: string;

  @Column('simple-json', { nullable: true })
  securityInfo: {
    informationAssets?: string[];
    threats?: string[];
    vulnerabilities?: string[];
    existingMeasures?: string[];
  };

  @Column('simple-json', { nullable: true })
  riskScenarios: InferredRiskScenario[];

  @Column({ nullable: true, type: 'timestamp' })
  lastRiskInference: Date;

  @ManyToOne(() => User, user => user.companies)
  user: User;

  @OneToMany(() => Document, document => document.company)
  documents: Document[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}