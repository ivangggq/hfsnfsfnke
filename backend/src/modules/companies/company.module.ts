import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './company.entity';
import { UserModule } from '../users/user.module';
import { SecurityTemplateModule } from '../security-templates/security-template.module';
import { AIInferenceService } from '../documents/services/ai-inference.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    UserModule, // Necesario para acceder a UserService
    SecurityTemplateModule, // Necesario para acceder a SecurityTemplateService
  ],
  controllers: [CompanyController],
  providers: [CompanyService, AIInferenceService],
  exports: [CompanyService], // Exportamos CompanyService para que pueda ser utilizado por otros módulos
})
export class CompanyModule {}