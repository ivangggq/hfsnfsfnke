import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { Document } from './document.entity';
import { CompanyModule } from '../companies/company.module';
import { AIInferenceService } from './services/ai-inference.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    CompanyModule, // Necesario para acceder a CompanyService
  ],
  controllers: [DocumentController],
  providers: [DocumentService, AIInferenceService],
  exports: [DocumentService], // Exportamos DocumentService para que pueda ser utilizado por otros módulos
})
export class DocumentModule {}