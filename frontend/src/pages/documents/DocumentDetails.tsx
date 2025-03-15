import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import documentService from '../../services/document.service';
import { Document, DocumentStatus, DocumentType } from '../../types/document.types';

const DocumentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchDocument(id);
    }
  }, [id]);

  const fetchDocument = async (documentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await documentService.getDocumentById(documentId);
      setDocument(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el documento');
      console.error('Error fetching document:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!document) return;
    
    const fileName = `${document.name.replace(/\s+/g, '_').toLowerCase()}_v${document.version}.pdf`;
    documentService.downloadDocument(document.id, fileName);
  };

  const handleDelete = async () => {
    if (!document || !id) return;

    if (window.confirm('¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer.')) {
      try {
        await documentService.deleteDocument(id);
        navigate('/documents');
      } catch (err: any) {
        setError(err.message || 'Error al eliminar el documento');
        console.error('Error deleting document:', err);
      }
    }
  };

  const getDocumentTypeLabel = (type: DocumentType): string => {
    const labels = {
      [DocumentType.ISMS_SCOPE]: 'Alcance del SGSI',
      [DocumentType.SECURITY_POLICY]: 'Política de Seguridad',
      [DocumentType.RISK_ASSESSMENT]: 'Evaluación de Riesgos',
      [DocumentType.STATEMENT_OF_APPLICABILITY]: 'Declaración de Aplicabilidad',
      [DocumentType.SECURITY_PROCEDURE]: 'Procedimiento de Seguridad',
    };
    return labels[type] || type;
  };

  const getDocumentStatusLabel = (status: DocumentStatus): string => {
    const labels = {
      [DocumentStatus.DRAFT]: 'Borrador',
      [DocumentStatus.PUBLISHED]: 'Publicado',
      [DocumentStatus.ARCHIVED]: 'Archivado',
    };
    return labels[status] || status;
  };

  const getDocumentStatusClass = (status: DocumentStatus): string => {
    const classes = {
      [DocumentStatus.DRAFT]: 'bg-yellow-100 text-yellow-800',
      [DocumentStatus.PUBLISHED]: 'bg-green-100 text-green-800',
      [DocumentStatus.ARCHIVED]: 'bg-neutral-100 text-neutral-800',
    };
    return classes[status] || 'bg-neutral-100 text-neutral-800';
  };

  const getDocumentIcon = (type: DocumentType): JSX.Element => {
    const icons = {
      [DocumentType.ISMS_SCOPE]: (
        <svg className="h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      [DocumentType.SECURITY_POLICY]: (
        <svg className="h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      [DocumentType.RISK_ASSESSMENT]: (
        <svg className="h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      [DocumentType.STATEMENT_OF_APPLICABILITY]: (
        <svg className="h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      [DocumentType.SECURITY_PROCEDURE]: (
        <svg className="h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    };
    return icons[type] || (
      <svg className="h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="bg-white shadow overflow-hidden rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-neutral-900">Documento no encontrado</h3>
        <p className="mt-1 text-sm text-neutral-500">
          El documento que estás buscando no existe o no tienes permiso para acceder a él.
        </p>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => navigate('/documents')}
        >
          Volver a Documentos
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center mb-2">
            <Link
              to="/documents"
              className="text-primary-600 hover:text-primary-900 mr-2"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-neutral-900">Detalles del Documento</h1>
          </div>
          <p className="text-neutral-500">
            Ver y gestionar la información del documento.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button
            variant="danger"
            onClick={handleDelete}
            icon={
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          >
            Eliminar
          </Button>
          <Button
            variant="primary"
            onClick={handleDownload}
            icon={
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
          >
            Descargar
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Document information */}
          <Card>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getDocumentIcon(document.type)}
              </div>
              <div className="ml-5">
                <h2 className="text-xl font-bold text-neutral-900">{document.name}</h2>
                <div className="mt-1 flex items-center">
                  <span className="text-sm text-neutral-500 mr-3">
                    {getDocumentTypeLabel(document.type)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentStatusClass(document.status)}`}>
                    {getDocumentStatusLabel(document.status)}
                  </span>
                </div>
                {document.description && (
                  <p className="mt-3 text-sm text-neutral-500">
                    {document.description}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Document metadata */}
          <Card title="Información del documento">
            <div className="border-t border-neutral-200 -mx-6 px-6 py-3">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-neutral-500">
                    Empresa
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-900">
                    <Link
                      to={`/companies/${document.company.id}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      {document.company.name}
                    </Link>
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-neutral-500">
                    Versión
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-900">
                    {document.version}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-neutral-500">
                    Creado por
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-900">
                    {document.createdBy.firstName} {document.createdBy.lastName}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-neutral-500">
                    Fecha de creación
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-900">
                    {new Date(document.createdAt).toLocaleString()}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-neutral-500">
                    Última actualización
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-900">
                    {new Date(document.updatedAt).toLocaleString()}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-neutral-500">
                    Tamaño del archivo
                  </dt>
                  <dd className="mt-1 text-sm text-neutral-900">
                    {document.fileSize ? `${(document.fileSize / 1024).toFixed(2)} KB` : 'No disponible'}
                  </dd>
                </div>
              </dl>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          {/* Document preview */}
          <Card title="Vista previa del documento">
            <div className="flex flex-col items-center justify-center py-10 border border-dashed border-neutral-300 rounded-md bg-neutral-50">
              <svg className="h-16 w-16 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 text-sm text-neutral-500 text-center">
                Vista previa no disponible. Descarga el documento para verlo.
              </p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={handleDownload}
                icon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                }
              >
                Descargar PDF
              </Button>
            </div>
          </Card>

          {/* Related documents */}
          <Card 
            title="Documentos relacionados" 
            className="mt-6"
            footer={
              <Link to={`/documents?companyId=${document.company.id}`} className="text-primary-600 hover:text-primary-900">
                Ver todos los documentos →
              </Link>
            }
          >
            <p className="text-sm text-neutral-500">
              Consulta otros documentos de la misma empresa para completar tu certificación ISO 27001.
            </p>
            <div className="mt-4">
              <Button
                variant="outline"
                fullWidth
                icon={
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                }
              >
                <Link to="/documents/generate">Generar Nuevo Documento</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;