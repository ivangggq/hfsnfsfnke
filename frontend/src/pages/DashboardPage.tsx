import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService } from '@/services/company.service';
import { documentService } from '@/services/document.service';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { 
  BuildingOfficeIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon,
  PlusCircleIcon,
  ArrowRightIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { Company, Document } from '@/types/models';
import DeleteDocumentModal from '@/components/documents/DeleteDocumentModal';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  // Obtener empresas del usuario
  const { 
    data: companiesData,
    isLoading: isLoadingCompanies,
    error: companiesError
  } = useQuery(
    ['companies'], 
    () => companyService.getUserCompanies(),
    {
      onError: () => {
        showToast('Error al cargar las empresas', 'error');
      }
    }
  );

  // Obtener documentos de la empresa seleccionada
  const {
    data: documentsData,
    isLoading: isLoadingDocuments,
    refetch: refetchDocuments
  } = useQuery(
    ['documents', selectedCompany],
    () => selectedCompany ? documentService.getCompanyDocuments(selectedCompany) : null,
    {
      enabled: !!selectedCompany,
      onError: () => {
        showToast('Error al cargar los documentos', 'error');
      }
    }
  );

  // Mutación para eliminar documento
  const deleteDocumentMutation = useMutation(
    (documentId: string) => documentService.deleteDocument(documentId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['documents', selectedCompany]);
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

  const companies = companiesData?.data || [];
  const documents = documentsData?.data || [];

  // Seleccionar la primera empresa por defecto
  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0].id);
    }
  }, [companies, selectedCompany]);

  // Cuando se cambia la empresa seleccionada
  useEffect(() => {
    if (selectedCompany) {
      refetchDocuments();
    }
  }, [selectedCompany, refetchDocuments]);

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompany(companyId);
    setIsCompanyDropdownOpen(false);
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

  // Obtener el nombre de la empresa seleccionada
  const getSelectedCompanyName = () => {
    const company = companies.find((company: Company) => company.id === selectedCompany);
    return company ? company.name : 'Seleccionar empresa';
  };

  if (isLoadingCompanies) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (companiesError) {
    return (
      <div className="bg-error-100 border border-error-200 text-error-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> No se pudieron cargar las empresas. Por favor, intenta nuevamente.</span>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-gray-500">
            Bienvenido de nuevo, {user?.firstName}
          </p>
        </div>
      </div>

      {/* Estadísticas/Resumen */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <BuildingOfficeIcon className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Empresas
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {companies.length}
                  </div>
                </dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <Link to="/companies" className="text-sm font-medium text-primary hover:text-primary-700 flex items-center">
              Ver todas las empresas
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-secondary-100 rounded-md p-3">
                <DocumentTextIcon className="h-6 w-6 text-secondary" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Documentos Generados
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {selectedCompany && !isLoadingDocuments ? documents.length : '-'}
                  </div>
                </dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            {selectedCompany ? (
              <Link 
                to={`/companies/${selectedCompany}/documents`} 
                className="text-sm font-medium text-secondary hover:text-secondary-700 flex items-center"
              >
                Ver todos los documentos
                <ArrowRightIcon className="ml-1 h-4 w-4" />
              </Link>
            ) : (
              <span className="text-sm text-gray-500">Selecciona una empresa</span>
            )}
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-success/20 rounded-md p-3">
                <ShieldCheckIcon className="h-6 w-6 text-success" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Plan de Suscripción
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    <span className="inline-flex items-center">
                      Profesional
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Activo
                      </span>
                    </span>
                  </div>
                </dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <a href="#" className="text-sm font-medium text-success hover:text-green-700 flex items-center">
              Administrar suscripción
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Sección principal */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Empresas y Documentación
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Gestiona tus empresas y su documentación de certificación ISO 27001
            </p>
          </div>
          <Link
            to="/companies/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Nueva Empresa
          </Link>
        </div>

        {companies.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-500">
              No tienes empresas registradas. Crea una nueva empresa para comenzar.
            </p>
            <div className="mt-5">
              <Link
                to="/companies/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Crear Empresa
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Selector de empresa mejorado */}
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6 bg-gray-50">
              <div className="flex justify-between mb-4">
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Empresa
                </label>
                
                {selectedCompany && (
                  <div className="flex space-x-2">
                    <Link
                      to={`/companies/${selectedCompany}/security-info`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <ShieldCheckIcon className="-ml-1 mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                      Seguridad
                    </Link>
                    <Link
                      to={`/companies/${selectedCompany}/documents`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <DocumentTextIcon className="-ml-1 mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                      Documentos
                    </Link>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <div 
                  className="cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                >
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                    <span className="block truncate">{getSelectedCompanyName()}</span>
                  </div>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </div>
                
                {isCompanyDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {companies.map((company: Company) => (
                      <div
                        key={company.id}
                        className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-primary-50 ${
                          selectedCompany === company.id ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                        }`}
                        onClick={() => handleCompanySelect(company.id)}
                      >
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                          <span className="block truncate font-medium">{company.name}</span>
                        </div>
                        {selectedCompany === company.id && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Lista de documentos */}
            {selectedCompany && (
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-6 w-6 text-secondary mr-2" aria-hidden="true" />
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Documentos
                    </h3>
                  </div>
                  <Link
                    to={`/companies/${selectedCompany}/documents/new`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                  >
                    <PlusCircleIcon className="-ml-1 mr-1 h-4 w-4" aria-hidden="true" />
                    Nuevo Documento
                  </Link>
                </div>

                {isLoadingDocuments ? (
                  <div className="px-4 py-5 sm:p-6 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                    <p>No hay documentos generados para esta empresa.</p>
                    <div className="mt-3">
                      <Link
                        to={`/companies/${selectedCompany}/documents/new`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-700"
                      >
                        Generar Documento
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
                                <th scope="col" className="relative px-6 py-3">
                                  <span className="sr-only">Acciones</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {documents.map((document: Document) => (
                                <tr key={document.id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                                        <DocumentTextIcon className="h-6 w-6 text-gray-400" />
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
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-3">
                                      <Link
                                        to={`/companies/${selectedCompany}/documents/${document.id}`}
                                        className="text-secondary hover:text-secondary-800"
                                        title="Ver documento"
                                      >
                                        Ver
                                      </Link>
                                      <button
                                        onClick={() => handleDownloadDocument(document.id)}
                                        className="text-secondary hover:text-secondary-800"
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
          </>
        )}
      </div>

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

export default DashboardPage;