import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { companyService } from '@/services/company.service';
import { documentService } from '@/services/document.service';
import { useToast } from '@/context/ToastContext';
import {
  ArrowLeftIcon,
  DocumentPlusIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Document } from '@/types/models';
import DeleteDocumentModal from '@/components/documents/DeleteDocumentModal';

const DocumentsPage: React.FC = () => {
  const { id: companyId } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

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

  // Obtener documentos de la empresa
  const {
    data: documentsData,
    isLoading: isLoadingDocuments,
    error: documentsError,
  } = useQuery(
    ['company-documents', companyId],
    () => documentService.getCompanyDocuments(companyId!),
    {
      enabled: !!companyId,
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
        queryClient.invalidateQueries(['company-documents', companyId]);
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

  // Mapeo de tipos de documentos a nombres legibles
  const documentTypeNames: Record<string, string> = {
    risk_assessment: 'Evaluación de Riesgos',
    security_policy: 'Política de Seguridad',
    isms_scope: 'Alcance SGSI',
    statement_of_applicability: 'Declaración de Aplicabilidad',
  };

  const handleDelete = () => {
    if (documentToDelete) {
      deleteDocumentMutation.mutate(documentToDelete.id);
    }
  };

  const handleDownload = (documentId: string) => {
    downloadDocumentMutation.mutate(documentId);
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
          to={`/companies/${companyId}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Volver a la empresa
        </Link>
      </div>

      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Documentos
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {company.name} - Documentación para certificación ISO 27001
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to={`/companies/${companyId}/documents/new`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <DocumentPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Nuevo Documento
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {isLoadingDocuments ? (
          <div className="px-4 py-5 sm:p-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : documentsError ? (
          <div className="px-4 py-5 sm:p-6">
            <div className="bg-error-100 border border-error-200 text-error-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> No se pudieron cargar los documentos.</span>
            </div>
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
                to={`/companies/${companyId}/documents/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <DocumentPlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Nuevo Documento
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {document.fileSize
                        ? `${Math.round(document.fileSize / 1024)} KB`
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          to={`/companies/${companyId}/documents/${document.id}`}
                          className="text-primary hover:text-primary-700"
                        >
                          Ver
                        </Link>
                        <button
                          onClick={() => handleDownload(document.id)}
                          className="text-secondary hover:text-secondary-700"
                          disabled={downloadDocumentMutation.isLoading}
                        >
                          <span className="sr-only">Descargar</span>
                          <ArrowDownTrayIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDocumentToDelete(document)}
                          className="text-gray-400 hover:text-error"
                        >
                          <span className="sr-only">Eliminar</span>
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmación para eliminar documento */}
      <DeleteDocumentModal
        document={documentToDelete}
        isOpen={!!documentToDelete}
        onClose={() => setDocumentToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default DocumentsPage;