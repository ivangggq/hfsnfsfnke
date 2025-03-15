import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Document, DocumentStatus, DocumentType } from '../../types/document.types';
import documentService from '../../services/document.service';

interface DocumentsListProps {
  documents: Document[];
  onDeleteDocument?: (id: string) => Promise<void>;
  isLoading?: boolean;
}

const DocumentsList: React.FC<DocumentsListProps> = ({
  documents,
  onDeleteDocument,
  isLoading = false,
}) => {
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
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      [DocumentType.SECURITY_POLICY]: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      [DocumentType.RISK_ASSESSMENT]: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      [DocumentType.STATEMENT_OF_APPLICABILITY]: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      [DocumentType.SECURITY_PROCEDURE]: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    };
    return icons[type] || (
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  const handleDownload = (document: Document) => {
    const fileName = `${document.name.replace(/\s+/g, '_').toLowerCase()}_v${document.version}.pdf`;
    documentService.downloadDocument(document.id, fileName);
  };

  const handleDelete = async (id: string) => {
    if (!onDeleteDocument) return;
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer.')) {
      await onDeleteDocument(id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-neutral-900">No hay documentos</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Crea tu primer documento para comenzar.
          </p>
          <div className="mt-6">
            <Button variant="primary">
              <Link to="/documents/generate">Generar Documento</Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <ul className="divide-y divide-neutral-200">
        {documents.map((document) => (
          <li key={document.id} className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 text-primary-600">
                {getDocumentIcon(document.type)}
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/documents/${document.id}`}>
                  <p className="text-base font-medium text-neutral-900 truncate hover:text-primary-600">
                    {document.name}
                  </p>
                </Link>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-neutral-500 mr-2">
                    {getDocumentTypeLabel(document.type)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentStatusClass(document.status)}`}>
                    {getDocumentStatusLabel(document.status)}
                  </span>
                </div>
                <div className="flex items-center mt-1 text-xs text-neutral-500">
                  <span>
                    Versión {document.version}
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    Creado el {new Date(document.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center space-x-2">
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => handleDownload(document)}
                  icon={
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  }
                >
                  Descargar
                </Button>
                
                {onDeleteDocument && (
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => handleDelete(document.id)}
                    icon={
                      <svg className="h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    }
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default DocumentsList;