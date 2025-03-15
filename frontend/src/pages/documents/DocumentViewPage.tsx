import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Eliminado useNavigate
import { useQuery, useMutation } from '@tanstack/react-query';
import { documentService } from '@/services/document.service';
import { useToast } from '@/context/ToastContext';
import { Document } from '@/types/models';
import { 
  ArrowLeftIcon, 
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { pdfjs, Document as PDFDocument, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Configurar worker para react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocumentViewPage: React.FC = () => {
  const { id: companyId, docId } = useParams<{ id: string, docId: string }>();
  // Eliminada la variable navigate ya que no se usa
  const { showToast } = useToast();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  const [scale, setScale] = useState(1.0);

  // Obtener datos del documento
  const {
    data: documentData,
    isLoading: isLoadingDocument,
    error: documentError,
  } = useQuery(
    ['document', docId],
    () => documentService.getDocumentById(docId!),
    {
      enabled: !!docId,
      onError: () => {
        showToast('Error al cargar el documento', 'error');
      },
    }
  );

  // Descargar PDF
  const downloadMutation = useMutation(
    () => documentService.downloadDocument(docId!),
    {
      onSuccess: (data) => {
        // Convertir blob a Uint8Array para visualización
        const fileReader = new FileReader();
        fileReader.onload = () => {
          if (fileReader.result instanceof ArrayBuffer) {
            setPdfData(new Uint8Array(fileReader.result));
          }
        };
        fileReader.readAsArrayBuffer(data);
        
        // Crear objeto URL para descarga
        const url = window.URL.createObjectURL(data);
        const link = window.document.createElement('a'); // Modificado para usar window.document
        link.href = url;
        link.setAttribute('download', `${documentData?.data?.name || 'document'}.pdf`);
        window.document.body.appendChild(link); // Modificado para usar window.document
        link.click();
        window.URL.revokeObjectURL(url);
        window.document.body.removeChild(link); // Modificado para usar window.document
        
        showToast('Documento descargado correctamente', 'success');
      },
      onError: () => {
        showToast('Error al descargar el documento', 'error');
      },
    }
  );

  const document: Document | undefined = documentData?.data;

  // Función para manejar la carga correcta del PDF
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  // Cambiar página
  const changePage = (offset: number) => {
    if (!numPages) return;
    const newPageNumber = pageNumber + offset;
    if (newPageNumber >= 1 && newPageNumber <= numPages) {
      setPageNumber(newPageNumber);
    }
  };

  // Cambiar escala de zoom
  const changeZoom = (newScale: number) => {
    setScale(newScale);
  };

  // Mapeo de tipos de documentos a nombres legibles
  const documentTypeNames: Record<string, string> = {
    risk_assessment: 'Evaluación de Riesgos',
    security_policy: 'Política de Seguridad',
    isms_scope: 'Alcance SGSI',
    statement_of_applicability: 'Declaración de Aplicabilidad',
  };

  // Descargar el PDF cuando se carga el componente
  React.useEffect(() => {
    if (docId && !pdfData && !downloadMutation.isLoading) {
      downloadMutation.mutate();
    }
  }, [docId, pdfData, downloadMutation]);

  if (isLoadingDocument || downloadMutation.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500">Cargando documento...</p>
      </div>
    );
  }

  if (documentError || !document) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-error-100 border border-error-200 text-error-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> No se pudo cargar el documento.</span>
          <div className="mt-2">
            <Link
              to={`/companies/${companyId}/documents`}
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Volver a documentos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center mb-6">
        <Link
          to={`/companies/${companyId}/documents`}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Volver a documentos
        </Link>
      </div>

      {/* Encabezado del documento */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
              <DocumentTextIcon className="h-6 w-6 text-gray-400" />
            </div>
            <div className="ml-4">
              <h1 className="text-lg font-bold text-gray-900">{document.name}</h1>
              <p className="text-sm text-gray-500">
                {documentTypeNames[document.type] || document.type}
                {' · '}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
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
              </p>
            </div>
          </div>
          <button
            onClick={() => downloadMutation.mutate()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
            Descargar
          </button>
        </div>
        {document.description && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <p className="text-sm text-gray-500">{document.description}</p>
          </div>
        )}
      </div>

      {/* Visor de PDF */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center">
            <button
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              className={`p-1 rounded-full ${
                pageNumber <= 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <span className="mx-2 text-sm text-gray-700">
              Página {pageNumber} de {numPages || '?'}
            </span>
            <button
              onClick={() => changePage(1)}
              disabled={numPages === null || pageNumber >= numPages}
              className={`p-1 rounded-full ${
                numPages === null || pageNumber >= numPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Zoom:</span>
            <button
              onClick={() => changeZoom(0.75)}
              className={`px-2 py-1 text-xs rounded ${
                scale === 0.75
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              75%
            </button>
            <button
              onClick={() => changeZoom(1.0)}
              className={`px-2 py-1 text-xs rounded ${
                scale === 1.0
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              100%
            </button>
            <button
              onClick={() => changeZoom(1.25)}
              className={`px-2 py-1 text-xs rounded ${
                scale === 1.25
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              125%
            </button>
            <button
              onClick={() => changeZoom(1.5)}
              className={`px-2 py-1 text-xs rounded ${
                scale === 1.5
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              150%
            </button>
          </div>
        </div>

        <div className="p-4 overflow-auto bg-gray-100" style={{ minHeight: '60vh' }}>
          {pdfData ? (
            <div className="flex justify-center">
              <PDFDocument
                file={{ data: pdfData }}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="flex flex-col items-center justify-center p-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-500">Cargando PDF...</p>
                  </div>
                }
                error={
                  <div className="flex flex-col items-center justify-center p-10">
                    <p className="text-error">Error al cargar el PDF.</p>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="shadow-lg"
                  // Eliminada la propiedad renderInteractiveForms que causa el error
                />
              </PDFDocument>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-10">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No se pudo cargar el documento.</p>
              <button
                onClick={() => downloadMutation.mutate()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Intentar de nuevo
              </button>
            </div>
          )}
        </div>

        {/* Controles inferiores */}
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => changePage(-1)}
                disabled={pageNumber <= 1}
                className={`inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
                  pageNumber <= 1
                    ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                    : 'text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
                }`}
              >
                <ChevronLeftIcon className="-ml-1 mr-1 h-4 w-4" />
                Anterior
              </button>
              <button
                onClick={() => changePage(1)}
                disabled={numPages === null || pageNumber >= numPages}
                className={`ml-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${
                  numPages === null || pageNumber >= numPages
                    ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                    : 'text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
                }`}
              >
                Siguiente
                <ChevronRightIcon className="ml-1 -mr-1 h-4 w-4" />
              </button>
            </div>
            <div>
              <button
                onClick={() => downloadMutation.mutate()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" />
                Descargar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewPage;