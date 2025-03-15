import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityTemplateController } from './security-template.controller';
import { SecurityTemplateService } from './security-template.service';
import { SecurityTemplate } from './security-template.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SecurityTemplate]),
  ],
  controllers: [SecurityTemplateController],
  providers: [SecurityTemplateService],
  exports: [SecurityTemplateService], // Exportamos el servicio para usarlo en CompanyService
})
export class SecurityTemplateModule {}