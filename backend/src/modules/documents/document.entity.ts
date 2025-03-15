import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Company } from '../companies/company.entity';

export enum DocumentType {
  ISMS_SCOPE = 'isms_scope',
  SECURITY_POLICY = 'security_policy',
  RISK_ASSESSMENT = 'risk_assessment',
  STATEMENT_OF_APPLICABILITY = 'statement_of_applicability',
  SECURITY_PROCEDURE = 'security_procedure',
}

export enum DocumentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  type: DocumentType;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.DRAFT,
  })
  status: DocumentStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ nullable: true })
  filePath: string;

  @Column({ nullable: true })
  fileSize: number;

  @Column('simple-json', { nullable: true })
  metadata: Record<string, any>;

  @Column({ default: 1 })
  version: number;

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => Company, company => company.documents)
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}