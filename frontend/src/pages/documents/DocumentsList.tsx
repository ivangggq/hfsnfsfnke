import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DocumentsList from '../../components/documents/DocumentsList';
import { useToast } from '../../context/ToastContext';
import companyService from '../../services/company.service';
import documentService from '../../services/document.service';
import { Company } from '../../types/company.types';
import { Document, DocumentType } from '../../types/document.types';

const Documents: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  // Parse the query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const companyId = searchParams.get('companyId');
    
    if (companyId) {
      setSelectedCompany(companyId);
    }
  }, [location]);

  // Load companies and documents
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all companies
        const companiesData = await companyService.getCompanies();
        setCompanies(companiesData);

        // Fetch all documents for all companies
        const allDocuments: Document[] = [];

        for (const company of companiesData) {
          const companyDocuments = await documentService.getDocuments(company.id);
          allDocuments.push(...companyDocuments);
        }

        setDocuments(allDocuments);
      } catch (err: any) {
        setError(err.message || 'Error al cargar los datos');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter documents when selection changes
  useEffect(() => {
    let filtered = [...documents];

    // Filter by company
    if (selectedCompany !== 'all') {
      filtered = filtered.filter(doc => doc.company.id === selectedCompany);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(doc => doc.type === selectedType);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchLower) || 
        doc.description?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredDocuments(filtered);
  }, [selectedCompany, selectedType, search, documents]);

  // Handle document deletion
  const handleDeleteDocument = async (id: string) => {
    try {
      await documentService.deleteDocument(id);
      setDocuments(documents.filter(doc => doc.id !== id));
      showToast('Documento eliminado correctamente', 'success');
    } catch (err: any) {
      showToast('Error al eliminar el documento', 'error');
      console.error('Error deleting document:', err);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Documentos</h1>
          <p className="mt-1 text-neutral-500">
            Gestiona los documentos de certificación ISO 27001 de tus empresas.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            variant="primary"
            icon={
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            <Link to="/documents/generate">Nuevo Documento</Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-card p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-1">
              Empresa
            </label>
            <select
              id="company"
              name="company"
              className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
              value={selectedCompany}
              onChange={e => setSelectedCompany(e.target.value)}
            >
              <option value="all">Todas las empresas</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="documentType" className="block text-sm font-medium text-neutral-700 mb-1">
              Tipo de documento
            </label>
            <select
              id="documentType"
              name="documentType"
              className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
            >
              <option value="all">Todos los tipos</option>
              <option value={DocumentType.ISMS_SCOPE}>Alcance del SGSI</option>
              <option value={DocumentType.SECURITY_POLICY}>Política de Seguridad</option>
              <option value={DocumentType.RISK_ASSESSMENT}>Evaluación de Riesgos</option>
              <option value={DocumentType.STATEMENT_OF_APPLICABILITY}>Declaración de Aplicabilidad</option>
              <option value={DocumentType.SECURITY_PROCEDURE}>Procedimiento de Seguridad</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-neutral-700 mb-1">
              Buscar
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-neutral-300 rounded-md"
                placeholder="Buscar por nombre o descripción"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
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

      {/* Documents list */}
      <DocumentsList
        documents={filteredDocuments}
        onDeleteDocument={handleDeleteDocument}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Documents;