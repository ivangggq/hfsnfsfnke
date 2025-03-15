import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  TrashIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  InformationCircleIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import { Document } from '@/types/models';
import DeleteCompanyModal from '@/components/companies/DeleteCompanyModal';
import DeleteDocumentModal from '@/components/documents/DeleteDocumentModal';

const CompanyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [companyToDelete, setCompanyToDelete] = useState<null | any>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'documents'>('info');

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

  // Mutación para eliminar documento
  const deleteDocumentMutation = useMutation(
    (documentId: string) => documentService.deleteDocument(documentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['company-documents', id]);
        showToast('Documento eliminado correctamente', 'success');
        setDocumentToDelete(null);
      },
      onError: () => {
        showToast('Error al eliminar el documento', 'error');
      },
    }
  );

  // Mutación para descargar documento
  const downloadDocumentMutation = useMutation(
    (documentId: string) => documentService.downloadDocument(documentId),
    {
      onSuccess: (data, documentId) => {
        const document = documentsData?.data.find((doc: Document) => doc.id === documentId);
        if (document) {
          // Crear blob y descargar
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = window.document.createElement('a');
          link.href = url;
          link.download = document.name.replace(/\s+/g, '_').toLowerCase() + '.pdf';
          window.document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(url);
          window.document.body.removeChild(link);
          showToast('Documento descargado correctamente', 'success');
        }
      },
      onError: () => {
        showToast('Error al descargar el documento', 'error');
      },
    }
  );

  const company = companyData?.data;
  const documents = documentsData?.data || [];

  const handleDeleteCompany = () => {
    if (company) {
      companyService.deleteCompany(id!)
        .then(() => {
          showToast('Empresa eliminada correctamente', 'success');
          navigate('/companies');
        })
        .catch(() => {
          showToast('Error al eliminar la empresa', 'error');
        })
        .finally(() => {
          setCompanyToDelete(null);
        });
    }
  };

  const handleDeleteDocument = () => {
    if (documentToDelete) {
      deleteDocumentMutation.mutate(documentToDelete.id);
    }
  };

  const handleDownloadDocument = (documentId: string) => {
    downloadDocumentMutation.mutate(documentId);
  };

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

      {/* Encabezado de empresa con fondo degradado */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 shadow-md overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center">
            {company.logo ? (
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-sm"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center border-4 border-white shadow-sm">
                <BuildingOfficeIcon className="h-10 w-10 text-primary" />
              </div>
            )}
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">{company.name}</h2>
              <div className="flex items-center mt-1">
                <span className="text-sm text-primary-700 font-medium bg-primary-100 py-0.5 px-2 rounded-full">
                  {formatValue(company.industry)}
                </span>
                {company.location && (
                  <span className="ml-2 text-sm text-gray-600 flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {company.location}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex mt-4 sm:mt-0 space-x-2">
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
          </div>
        </div>

        {/* Tabs para navegar entre información y documentos */}
        <div className="px-4 mt-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('info')}
              className={`${
                activeTab === 'info'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <InformationCircleIcon className="h-5 w-5 mr-1.5" />
              Información
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`${
                activeTab === 'documents'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <DocumentTextIcon className="h-5 w-5 mr-1.5" />
              Documentos
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Columna 1: Información principal */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-indigo-50 px-4 py-4 border-b border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-800 flex items-center">
                <BuildingLibraryIcon className="h-5 w-5 mr-2" />
                Información de la Empresa
              </h3>
            </div>
            <div className="p-4">
              {/* Descripción */}
              <div className="mb-6">
                <h4 className="text-gray-500 text-sm font-medium mb-2 flex items-center">
                  <InformationCircleIcon className="h-4 w-4 mr-1 text-indigo-600" />
                  Descripción
                </h4>
                <p className="text-gray-800 bg-gray-50 rounded-md p-3 border border-gray-100">
                  {formatValue(company.description)}
                </p>
              </div>
              
              {/* Tamaño */}
              <div className="mb-6">
                <h4 className="text-gray-500 text-sm font-medium mb-2 flex items-center">
                  <UsersIcon className="h-4 w-4 mr-1 text-indigo-600" />
                  Tamaño
                </h4>
                <div className="flex items-center bg-gray-50 rounded-md p-3 border border-gray-100">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3">
                    <UsersIcon className="h-5 w-5 text-indigo-700" />
                  </div>
                  <span className="text-gray-800">
                    {company.size ? `${company.size} empleados` : formatValue(company.size)}
                  </span>
                </div>
              </div>
              
              {/* Ubicación Detallada */}
              <div className="mb-6">
                <h4 className="text-gray-500 text-sm font-medium mb-2 flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-1 text-indigo-600" />
                  Ubicación Detallada
                </h4>
                <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
                  <p className="text-gray-800">
                    {formatValue(company.address)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Columna 2: Información de contacto */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-indigo-50 px-4 py-4 border-b border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-800 flex items-center">
                <AtSymbolIcon className="h-5 w-5 mr-2" />
                Información de Contacto
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {/* Sitio Web */}
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                <div className="bg-indigo-100 rounded-full p-2 mr-3">
                  <GlobeAltIcon className="h-5 w-5 text-indigo-700" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Sitio Web</h4>
                  <div className="text-gray-800">
                    {company.website ? (
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {company.website}
                      </a>
                    ) : (
                      formatValue(company.website)
                    )}
                  </div>
                </div>
              </div>
              
              {/* Teléfono */}
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                <div className="bg-indigo-100 rounded-full p-2 mr-3">
                  <PhoneIcon className="h-5 w-5 text-indigo-700" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Teléfono</h4>
                  <div className="text-gray-800">
                    {formatValue(company.phone)}
                  </div>
                </div>
              </div>
              
              {/* Correo electrónico */}
              <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                <div className="bg-indigo-100 rounded-full p-2 mr-3">
                  <AtSymbolIcon className="h-5 w-5 text-indigo-700" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Correo Electrónico</h4>
                  <div className="text-gray-800">
                    {company.email ? (
                      <a 
                        href={`mailto:${company.email}`} 
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        {company.email}
                      </a>
                    ) : (
                      formatValue(company.email)
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Columna 3: Información administrativa y acciones */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="bg-indigo-50 px-4 py-4 border-b border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-800 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                Información Administrativa
              </h3>
            </div>
            <div className="p-4">
              {/* Fecha de creación */}
              <div className="mb-6">
                <h4 className="text-gray-500 text-sm font-medium mb-2">Fecha de Creación</h4>
                <div className="flex items-center bg-gray-50 rounded-md p-3 border border-gray-100">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3">
                    <ClockIcon className="h-5 w-5 text-indigo-700" />
                  </div>
                  <span className="text-gray-800">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {/* Documentos */}
              <div className="mb-6">
                <h4 className="text-gray-500 text-sm font-medium mb-2">Documentos</h4>
                <div className="flex items-center bg-gray-50 rounded-md p-3 border border-gray-100">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3">
                    <DocumentTextIcon className="h-5 w-5 text-indigo-700" />
                  </div>
                  <span className="text-gray-800">
                    {documents.length} documentos generados
                  </span>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  onClick={() => setCompanyToDelete(company)}
                  className="flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <TrashIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                  Eliminar empresa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        /* Sección de documentos */
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-indigo-50 border-b border-indigo-100">
            <div>
              <h3 className="text-lg leading-6 font-medium text-indigo-800 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Documentos
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-indigo-600">
                Documentos generados para la certificación ISO 27001
              </p>
            </div>
            <Link
              to={`/companies/${id}/documents/new`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <DocumentPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Nuevo Documento
            </Link>
          </div>

          {isLoadingDocuments ? (
            <div className="px-4 py-5 sm:p-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
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
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                  <div className="overflow-hidden">
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
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Tamaño
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
                        {documents.map((document: Document, idx) => (
                          <tr key={document.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                                  <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{document.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {document.description || 'Sin descripción'}
                                  </div>
                                </div>
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {document.fileSize
                                ? `${Math.round(document.fileSize / 1024)} KB`
                                : 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-3">
                                <Link
                                  to={`/companies/${id}/documents/${document.id}`}
                                  className="text-indigo-600 hover:text-indigo-800"
                                >
                                  Ver
                                </Link>
                                <button
                                  onClick={() => handleDownloadDocument(document.id)}
                                  className="text-indigo-600 hover:text-indigo-800"
                                  disabled={downloadDocumentMutation.isLoading}
                                  title="Descargar documento"
                                >
                                  <ArrowDownTrayIcon className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => setDocumentToDelete(document)}
                                  className="text-gray-400 hover:text-red-600"
                                  title="Eliminar documento"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
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
      )}

      {/* Modal de confirmación para eliminar empresa */}
      <DeleteCompanyModal
        company={companyToDelete}
        isOpen={!!companyToDelete}
        onClose={() => setCompanyToDelete(null)}
        onConfirm={handleDeleteCompany}
      />

      {/* Modal de confirmación para eliminar documento */}
      <DeleteDocumentModal
        document={documentToDelete}
        isOpen={!!documentToDelete}
        onClose={() => setDocumentToDelete(null)}
        onConfirm={handleDeleteDocument}
      />
    </div>
  );
};

export default CompanyDetailPage;