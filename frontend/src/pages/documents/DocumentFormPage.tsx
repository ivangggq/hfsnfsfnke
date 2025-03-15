import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { companyService } from '@/services/company.service';
import { documentService } from '@/services/document.service';
import { useToast } from '@/context/ToastContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

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
    { id: 'risk_assessment', name: 'Evaluación de Riesgos' },
    { id: 'security_policy', name: 'Política de Seguridad' },
    { id: 'isms_scope', name: 'Alcance del SGSI' },
    { id: 'statement_of_applicability', name: 'Declaración de Aplicabilidad' },
  ];

  if (isLoadingCompany) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (companyError || !company) {
    return (
      <div className="bg-error-100 border border-error-200 text-error-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> No se pudieron cargar los datos de la empresa.</span>
        <div className="mt-2">
          <Link
            to="/companies"
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Volver a empresas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link
          to={`/companies/${companyId}/documents`}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Volver a documentos
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo Documento</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Empresa relacionada (solo informativo) */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Empresa
                </label>
                <div className="mt-1 flex items-center">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{company.name}</div>
                    <div className="text-xs text-gray-500">{company.industry}</div>
                  </div>
                </div>
              </div>

              {/* Nombre del documento */}
              <div className="sm:col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre del documento *
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

              {/* Tipo de documento */}
              <div className="sm:col-span-6">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Tipo de documento *
                </label>
                <div className="mt-1">
                  <select
                    id="type"
                    className={`shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.type ? 'border-error' : ''
                    }`}
                    {...register('type')}
                  >
                    <option value="">Seleccionar tipo de documento</option>
                    {documentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-2 text-sm text-error">{errors.type.message}</p>
                  )}
                </div>
              </div>

              {/* Descripción */}
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
            </div>

            <div className="mt-6 flex justify-end">
              <Link
                to={`/companies/${companyId}/documents`}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {isSubmitting ? 'Generando...' : 'Generar Documento'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
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
  );
};

export default DocumentFormPage;