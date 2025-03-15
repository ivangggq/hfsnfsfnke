import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { companyService } from '@/services/company.service';
import { documentService } from '@/services/document.service';
import { useToast } from '@/context/ToastContext';
import {
  ArrowLeftIcon,
  PencilIcon,
  DocumentTextIcon,
  ShieldExclamationIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UsersIcon,
  GlobeAltIcon,
  PhoneIcon,
  AtSymbolIcon,
  DocumentPlusIcon,
} from '@heroicons/react/24/outline';
import { Document } from '@/types/models';

const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  // Obtener datos de la empresa
  const {
    data: companyData,
    isLoading: isLoadingCompany,
    error: companyError,
  } = useQuery(
    ['company', id],
    () => companyService.getCompanyById(id!),
    {
      enabled: !!id,
      onError: () => {
        showToast('Error al cargar los datos de la empresa', 'error');
      },
    }
  );

  // Obtener documentos de la empresa
  const {
    data: documentsData,
    isLoading: isLoadingDocuments,
  } = useQuery(
    ['company-documents', id],
    () => documentService.getCompanyDocuments(id!),
    {
      enabled: !!id,
      onError: () => {
        showToast('Error al cargar los documentos', 'error');
      },
    }
  );

  const company = companyData?.data;
  const documents = documentsData?.data || [];

  // Mapeo de tipos de documentos a nombres legibles
  const documentTypeNames: Record<string, string> = {
    risk_assessment: 'Evaluación de Riesgos',
    security_policy: 'Política de Seguridad',
    isms_scope: 'Alcance SGSI',
    statement_of_applicability: 'Declaración de Aplicabilidad',
  };

  // Formatear un valor o mostrar "No especificado"
  const formatValue = (value: string | number | undefined) => {
    if (value === undefined || value === null || value === '') {
      return <span className="text-gray-400">No especificado</span>;
    }
    return value;
  };

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
    <div className="max-w-7xl mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link
          to="/companies"
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Volver a empresas
        </Link>
      </div>

      {/* Encabezado de empresa */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div className="flex items-center">
            {company.logo ? (
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                <BuildingOfficeIcon className="h-8 w-8 text-primary" />
              </div>
            )}
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
              <p className="text-sm text-gray-500">
                {formatValue(company.industry)}
                {company.location && ` · ${company.location}`}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/companies/${id}/edit`}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <PencilIcon className="-ml-1 mr-1 h-4 w-4 text-gray-400" />
              Editar
            </Link>
            <Link
              to={`/companies/${id}/security-info`}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <ShieldExclamationIcon className="-ml-1 mr-1 h-4 w-4 text-gray-400" />
              Seguridad
            </Link>
            <Link
              to={`/companies/${id}/documents`}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <DocumentTextIcon className="-ml-1 mr-1 h-4 w-4 text-gray-400" />
              Documentos
            </Link>
          </div>
        </div>

        {/* Detalles de la empresa */}
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-400" />
                Descripción
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatValue(company.description)}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                Ubicación
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatValue(company.address)}
                {company.location && !company.address && formatValue(company.location)}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <UsersIcon className="h-5 w-5 mr-2 text-gray-400" />
                Tamaño
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {company.size ? `${company.size} empleados` : formatValue(company.size)}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <GlobeAltIcon className="h-5 w-5 mr-2 text-gray-400" />
                Sitio web
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {company.website ? (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-700"
                  >
                    {company.website}
                  </a>
                ) : (
                  formatValue(company.website)
                )}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                Teléfono
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatValue(company.phone)}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <AtSymbolIcon className="h-5 w-5 mr-2 text-gray-400" />
                Correo electrónico
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {company.email ? (
                  <a 
                    href={`mailto:${company.email}`} 
                    className="text-primary hover:text-primary-700"
                  >
                    {company.email}
                  </a>
                ) : (
                  formatValue(company.email)
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Sección de documentos */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Documentos
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Documentos generados para la certificación ISO 27001
            </p>
          </div>
          <Link
            to={`/companies/${id}/documents/new`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <DocumentPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Nuevo Documento
          </Link>
        </div>

        {isLoadingDocuments ? (
          <div className="px-4 py-5 sm:p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay documentos</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando un nuevo documento para la certificación.
            </p>
            <div className="mt-6">
              <Link
                to={`/companies/${id}/documents/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <DocumentPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Nuevo Documento
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="py-2 align-middle inline-block min-w-full">
                <div className="overflow-hidden border-b border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Nombre
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Tipo
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Estado
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Fecha
                        </th>
                        <th
                          scope="col"
                          className="relative px-6 py-3"
                        >
                          <span className="sr-only">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {documents.map((document: Document) => (
                        <tr key={document.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {document.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {document.description || 'Sin descripción'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {documentTypeNames[document.type] || document.type}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${
                                  document.status === 'draft'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : document.status === 'published'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                              {document.status === 'draft'
                                ? 'Borrador'
                                : document.status === 'published'
                                ? 'Publicado'
                                : document.status === 'archived'
                                ? 'Archivado'
                                : document.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(document.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/companies/${id}/documents/${document.id}`}
                              className="text-primary hover:text-primary-700"
                            >
                              Ver
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailPage;