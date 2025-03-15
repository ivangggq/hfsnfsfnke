import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Building2, Globe, Mail, MapPin, Phone, User } from 'lucide-react';
import { companyService } from '@/services/company.service';
import { securityTemplateService } from '@/services/security-template.service';
import { useToast } from '@/context/ToastContext';
import { CreateCompanyRequest, UpdateCompanyRequest } from '@/types/api';
import { formatErrorMessage } from '@/utils/errorHandling';

// Validation Schema
const companySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  industry: z.string().optional(),
  location: z.string().optional(),
  size: z.number().int().nonnegative().optional(),
  description: z.string().optional(),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email('Correo electrónico inválido').optional().or(z.literal('')),
  address: z.string().optional(),
  logo: z.string().url('URL inválida').optional().or(z.literal('')),
  securityTemplateId: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

const CompanyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!id;

  // Fetch company data if in edit mode
  const { 
    data: companyData,
    isLoading: isLoadingCompany,
  } = useQuery(
    ['company', id],
    () => companyService.getCompanyById(id!),
    {
      enabled: isEditMode,
      onError: (error) => {
        showToast(formatErrorMessage(error), 'error');
        navigate('/companies');
      }
    }
  );

  // Fetch security templates
  const { 
    data: templatesData,
    isLoading: isLoadingTemplates,
  } = useQuery(
    ['security-templates', { default: true }],
    () => securityTemplateService.getTemplates(undefined, true),
    {
      onError: (error) => {
        showToast(formatErrorMessage(error), 'error');
      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      industry: '',
      location: '',
      size: undefined,
      description: '',
      website: '',
      phone: '',
      email: '',
      address: '',
      logo: '',
      securityTemplateId: '',
    },
  });

  // Update form when company data is loaded
  useEffect(() => {
    if (isEditMode && companyData?.data) {
      const company = companyData.data;
      reset({
        name: company.name,
        industry: company.industry || '',
        location: company.location || '',
        size: company.size,
        description: company.description || '',
        website: company.website || '',
        phone: company.phone || '',
        email: company.email || '',
        address: company.address || '',
        logo: company.logo || '',
        securityTemplateId: '',
      });
    }
  }, [isEditMode, companyData, reset]);

  const onSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        // Update existing company
        const updateData: UpdateCompanyRequest = { ...data };
        await companyService.updateCompany(id!, updateData);
        showToast('Empresa actualizada correctamente', 'success');
      } else {
        // Create new company
        const createData: CreateCompanyRequest = { ...data };
        const response = await companyService.createCompany(createData);
        showToast('Empresa creada correctamente', 'success');
        navigate(`/companies/${response.data.id}`);
      }
    } catch (error: any) {
      let errorMessage = formatErrorMessage(error);
      if (!errorMessage) {
        errorMessage = isEditMode
          ? 'Error al actualizar la empresa'
          : 'Error al crear la empresa';
      }
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const logoUrl = watch('logo');

  // Show loading while data is being fetched in edit mode
  if (isEditMode && isLoadingCompany) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center py-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        {/* Botón para volver atrás */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate('/companies')}
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-700 transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver a empresas
          </button>
        </div>
        
        {/* Logo and Company Image Section - Compact Header */}
        <div className="flex items-center mb-4">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Company Logo" 
              className="h-16 w-16 object-contain rounded-full border-2 border-primary mr-4"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center mr-4">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Editar Empresa' : 'Nueva Empresa'}
            </h1>
            <p className="text-sm text-gray-600">
              {isEditMode ? 'Actualice la información de la empresa' : 'Complete la información para registrar una nueva empresa'}
            </p>
          </div>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Company Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre de la empresa *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  className={`
                    appearance-none block w-full px-3 py-2 pl-10 border 
                    ${errors.name ? 'border-red-500' : 'border-gray-300'}
                    rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-primary 
                    focus:border-primary sm:text-sm
                  `}
                  {...register('name')}
                />
                {errors.name && (
                  <div className="absolute right-0 top-0 h-full pr-3 flex items-center">
                    <span className="text-red-500 text-sm">{errors.name.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Logo URL */}
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                URL del Logo
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="logo"
                  placeholder="https://example.com/logo.png"
                  className={`
                    appearance-none block w-full px-3 py-2 pl-10 border 
                    ${errors.logo ? 'border-red-500' : 'border-gray-300'}
                    rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-primary 
                    focus:border-primary sm:text-sm
                  `}
                  {...register('logo')}
                />
                {errors.logo && (
                  <div className="absolute right-0 top-0 h-full pr-3 flex items-center">
                    <span className="text-red-500 text-sm">{errors.logo.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Industry and Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                  Industria
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="industry"
                    className="
                      appearance-none block w-full px-3 py-2 pl-10 
                      border border-gray-300 rounded-md shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-primary 
                      focus:border-primary sm:text-sm
                    "
                    {...register('industry')}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Ubicación
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    className="
                      appearance-none block w-full px-3 py-2 pl-10 
                      border border-gray-300 rounded-md shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-primary 
                      focus:border-primary sm:text-sm
                    "
                    {...register('location')}
                  />
                </div>
              </div>
            </div>

            {/* Company Size */}
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                Tamaño (nº empleados)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="size"
                  min="0"
                  className="
                    appearance-none block w-full px-3 py-2 
                    border border-gray-300 rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-primary 
                    focus:border-primary sm:text-sm
                  "
                  {...register('size', { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  rows={3}
                  className="
                    appearance-none block w-full px-3 py-2 
                    border border-gray-300 rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-primary 
                    focus:border-primary sm:text-sm
                  "
                  {...register('description')}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Sitio web
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="website"
                    placeholder="https://example.com"
                    className={`
                      appearance-none block w-full px-3 py-2 pl-10 border 
                      ${errors.website ? 'border-red-500' : 'border-gray-300'}
                      rounded-md shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-primary 
                      focus:border-primary sm:text-sm
                    `}
                    {...register('website')}
                  />
                  {errors.website && (
                    <div className="absolute right-0 top-0 h-full pr-3 flex items-center">
                      <span className="text-red-500 text-sm">{errors.website.message}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className={`
                      appearance-none block w-full px-3 py-2 pl-10 border 
                      ${errors.email ? 'border-red-500' : 'border-gray-300'}
                      rounded-md shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-primary 
                      focus:border-primary sm:text-sm
                    `}
                    {...register('email')}
                  />
                  {errors.email && (
                    <div className="absolute right-0 top-0 h-full pr-3 flex items-center">
                      <span className="text-red-500 text-sm">{errors.email.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Phone and Address */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="phone"
                    className="
                      appearance-none block w-full px-3 py-2 pl-10 
                      border border-gray-300 rounded-md shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-primary 
                      focus:border-primary sm:text-sm
                    "
                    {...register('phone')}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="address"
                    className="
                      appearance-none block w-full px-3 py-2 pl-10 
                      border border-gray-300 rounded-md shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-primary 
                      focus:border-primary sm:text-sm
                    "
                    {...register('address')}
                  />
                </div>
              </div>
            </div>

            {/* Security Template (only for new companies) */}
            {!isEditMode && (
              <div>
                <label htmlFor="securityTemplateId" className="block text-sm font-medium text-gray-700">
                  Plantilla de seguridad
                </label>
                <div className="mt-1">
                  <select
                    id="securityTemplateId"
                    className="
                      appearance-none block w-full px-3 py-2 
                      border border-gray-300 rounded-md shadow-sm 
                      focus:outline-none focus:ring-2 focus:ring-primary 
                      focus:border-primary sm:text-sm
                    "
                    {...register('securityTemplateId')}
                    disabled={isLoadingTemplates}
                  >
                    <option value="">Seleccionar plantilla (opcional)</option>
                    {templatesData?.data?.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name} - {template.industry}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Aplicar una plantilla predefinida de información de seguridad
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                className="
                  w-full flex justify-center py-2 px-4 
                  border border-gray-300 rounded-md shadow-sm 
                  text-sm font-medium text-gray-700 
                  bg-white hover:bg-gray-50 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                  transition-colors duration-300
                "
                onClick={() => navigate('/companies')}
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  w-full flex justify-center py-2 px-4 
                  border border-transparent rounded-md shadow-sm 
                  text-sm font-medium text-white 
                  bg-primary hover:bg-primary-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                  transition-colors duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg 
                      className="animate-spin h-5 w-5 mr-2" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isEditMode ? 'Actualizando...' : 'Creando...'}
                  </div>
                ) : (
                  isEditMode ? 'Actualizar' : 'Crear'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyFormPage;