import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { companyService } from '@/services/company.service';
import { documentService } from '@/services/document.service';
import { useToast } from '@/context/ToastContext';
import { 
  ArrowLeftIcon, 
  DocumentTextIcon, 
  BuildingOfficeIcon,
  ClipboardDocumentIcon,
  DocumentIcon,
  InformationCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

// Esquema de validación
const documentSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  type: z.string().min(1, 'Debes seleccionar un tipo de documento'),
  description: z.string().optional(),
});

type DocumentFormData = z.infer<typeof documentSchema>;

const DocumentFormPage: React.FC = () => {
  const { id: companyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener datos de la empresa
  const {
    data: companyData,
    isLoading: isLoadingCompany,
    error: companyError,
  } = useQuery(
    ['company', companyId],
    () => companyService.getCompanyById(companyId!),
    {
      enabled: !!companyId,
      onError: () => {
        showToast('Error al cargar los datos de la empresa', 'error');
      },
    }
  );

  // Mutación para crear documento
  const createDocumentMutation = useMutation(
    (data: any) => documentService.createDocument(data),
    {
      onSuccess: (response) => {
        showToast('Documento creado correctamente', 'success');
        navigate(`/companies/${companyId}/documents/${response.data.id}`);
      },
      onError: () => {
        showToast('Error al crear el documento', 'error');
        setIsSubmitting(false);
      },
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: '',
      type: '',
      description: '',
    },
  });

  const onSubmit = async (data: DocumentFormData) => {
    setIsSubmitting(true);
    
    const documentData = {
      ...data,
      companyId: companyId!,
    };

    createDocumentMutation.mutate(documentData);
  };

  const company = companyData?.data;

  // Tipos de documentos disponibles
  const documentTypes = [
    { id: 'risk_assessment', name: 'Evaluación de Riesgos', icon: <ClipboardDocumentIcon className="h-5 w-5 text-red-500" /> },
    { id: 'security_policy', name: 'Política de Seguridad', icon: <DocumentIcon className="h-5 w-5 text-blue-500" /> },
    { id: 'isms_scope', name: 'Alcance del SGSI', icon: <InformationCircleIcon className="h-5 w-5 text-green-500" /> },
    { id: 'statement_of_applicability', name: 'Declaración de Aplicabilidad', icon: <DocumentTextIcon className="h-5 w-5 text-purple-500" /> },
  ];

  if (isLoadingCompany) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (companyError || !company) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm" role="alert">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-1 text-sm text-red-700">
              No se pudieron cargar los datos de la empresa. Por favor, intenta nuevamente.
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Link
            to="/companies"
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-700 transition-colors duration-300"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Volver a empresas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        {/* Botón para volver atrás */}
        <div className="mb-4">
          <Link
            to={`/companies/${companyId}/documents`}
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-700 transition-colors duration-300"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Volver a documentos
          </Link>
        </div>
        
        {/* Encabezado compacto */}
        <div className="flex items-center mb-6">
          <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center mr-4">
            <DocumentTextIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nuevo Documento</h1>
            <p className="text-sm text-gray-600">
              Crear un nuevo documento para la certificación ISO 27001
            </p>
          </div>
        </div>

        <div className="bg-white py-8 px-8 shadow sm:rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Empresa relacionada (solo informativo) */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa
              </label>
              <div className="flex items-center">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="h-12 w-12 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <BuildingOfficeIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                )}
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-900">{company.name}</div>
                  <div className="text-sm text-gray-500">{company.industry || 'Sin industria especificada'}</div>
                </div>
              </div>
            </div>

            {/* Nombre del documento */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre del documento *
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PencilIcon className="h-5 w-5 text-gray-400" />
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
                  placeholder="Ej: Evaluación de Riesgos 2025"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Tipo de documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de documento *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {documentTypes.map((type) => (
                  <div 
                    key={type.id} 
                    className={`
                      flex items-center p-3 rounded-md cursor-pointer transition-all duration-200
                      ${watch('type') === type.id 
                        ? 'border-2 border-primary bg-primary/5 shadow-sm' 
                        : 'border border-gray-200 bg-gray-50 hover:bg-gray-100'}
                    `}
                    onClick={() => setValue('type', type.id, { shouldValidate: true })}
                  >
                    {type.icon}
                    <span className="ml-2 text-sm font-medium text-gray-700">{type.name}</span>
                  </div>
                ))}
              </div>
              <input type="hidden" {...register('type')} />
              {errors.type && (
                <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            {/* Contexto para IA */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Contexto para IA
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Añade información adicional o contexto específico para el modelo de IA"
                  className="
                    shadow-sm focus:ring-primary focus:border-primary 
                    block w-full sm:text-sm border-gray-300 rounded-md
                    px-4 py-3
                  "
                  {...register('description')}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Esta información adicional será enviada al modelo de inferencia IA para generar un documento más personalizado y específico a tus necesidades.
              </p>
            </div>

            <div className="flex space-x-3">
              <Link
                to={`/companies/${companyId}/documents`}
                className="
                  w-full flex justify-center py-2 px-4 
                  border border-gray-300 rounded-md shadow-sm 
                  text-sm font-medium text-gray-700 
                  bg-white hover:bg-gray-50 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                  transition-colors duration-300
                "
              >
                Cancelar
              </Link>
              
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
                    Generando documento...
                  </div>
                ) : (
                  'Generar Documento'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Información importante</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  El sistema generará automáticamente el documento basado en la información de
                  seguridad y los escenarios de riesgo de la empresa. Este proceso puede tardar
                  unos momentos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentFormPage;