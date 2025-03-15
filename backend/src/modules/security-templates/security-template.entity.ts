import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface SecurityInfoTemplate {
  informationAssets?: string[];
  threats?: string[];
  vulnerabilities?: string[];
  existingMeasures?: string[];
}

@Entity('security_templates')
export class SecurityTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  industry: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('simple-json')
  template: SecurityInfoTemplate;

  @Column({ default: false })
  isDefault: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}