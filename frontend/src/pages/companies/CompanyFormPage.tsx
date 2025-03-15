import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { companyService } from '@/services/company.service';
import { securityTemplateService } from '@/services/security-template.service';
import { useToast } from '@/context/ToastContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { CreateCompanyRequest, UpdateCompanyRequest } from '@/types/api';

// Esquema de validación
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

  // Obtener datos de la empresa si está en modo edición
  const { 
    data: companyData,
    isLoading: isLoadingCompany,
  } = useQuery(
    ['company', id],
    () => companyService.getCompanyById(id!),
    {
      enabled: isEditMode,
      onError: () => {
        showToast('Error al cargar los datos de la empresa', 'error');
        navigate('/companies');
      }
    }
  );

  // Obtener plantillas de seguridad
  const { 
    data: templatesData,
    isLoading: isLoadingTemplates,
  } = useQuery(
    ['security-templates', { default: true }],
    () => securityTemplateService.getTemplates(undefined, true),
    {
      onError: () => {
        showToast('Error al cargar las plantillas de seguridad', 'error');
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

  // Actualizar el formulario cuando se cargan los datos de la empresa
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
        securityTemplateId: '',  // No podemos establecer esta opción en edición
      });
    }
  }, [isEditMode, companyData, reset]);

  const onSubmit = async (data: CompanyFormData) => {
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        // Actualizar empresa existente
        const updateData: UpdateCompanyRequest = { ...data };
        await companyService.updateCompany(id!, updateData);
        showToast('Empresa actualizada correctamente', 'success');
      } else {
        // Crear nueva empresa
        const createData: CreateCompanyRequest = { ...data };
        const response = await companyService.createCompany(createData);
        showToast('Empresa creada correctamente', 'success');
        navigate(`/companies/${response.data.id}`);
      }
    } catch (error: any) {
      let errorMessage = isEditMode
        ? 'Error al actualizar la empresa'
        : 'Error al crear la empresa';
      
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const logoUrl = watch('logo');

  // Mostrar loading mientras se cargan los datos en modo edición
  if (isEditMode && isLoadingCompany) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link
          to="/companies"
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Volver a empresas
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Editar Empresa' : 'Nueva Empresa'}
      </h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Información básica */}
              <div className="sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre de la empresa *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.name ? 'border-error' : ''
                    }`}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-error">{errors.name.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                  Logo
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="logo"
                    className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.logo ? 'border-error' : ''
                    }`}
                    placeholder="URL del logo"
                    {...register('logo')}
                  />
                  {errors.logo && (
                    <p className="mt-2 text-sm text-error">{errors.logo.message}</p>
                  )}
                </div>
                {logoUrl && (
                  <div className="mt-2">
                    <img
                      src={logoUrl}
                      alt="Logo Preview"
                      className="h-10 w-10 object-contain border border-gray-200 rounded"
                    />
                  </div>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                  Industria
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="industry"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    {...register('industry')}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Ubicación
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="location"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    {...register('location')}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="size" className="block text-sm font-medium text-gray-700">
                  Tamaño (nº empleados)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    id="size"
                    min="0"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    {...register('size', { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    rows={3}
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    {...register('description')}
                  />
                </div>
              </div>

              {/* Información de contacto */}
              <div className="sm:col-span-3">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Sitio web
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="website"
                    className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.website ? 'border-error' : ''
                    }`}
                    placeholder="https://example.com"
                    {...register('website')}
                  />
                  {errors.website && (
                    <p className="mt-2 text-sm text-error">{errors.website.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email"
                    className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.email ? 'border-error' : ''
                    }`}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-error">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="phone"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    {...register('phone')}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="address"
                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                    {...register('address')}
                  />
                </div>
              </div>

              {/* Plantilla de seguridad (solo para nuevas empresas) */}
              {!isEditMode && (
                <div className="sm:col-span-6">
                  <label htmlFor="securityTemplateId" className="block text-sm font-medium text-gray-700">
                    Plantilla de seguridad
                  </label>
                  <div className="mt-1">
                    <select
                      id="securityTemplateId"
                      className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
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
                    <p className="mt-1 text-sm text-gray-500">
                      Aplicar una plantilla predefinida de información de seguridad
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Link
                to="/companies"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {isSubmitting
                  ? isEditMode ? 'Actualizando...' : 'Creando...'
                  : isEditMode ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyFormPage;