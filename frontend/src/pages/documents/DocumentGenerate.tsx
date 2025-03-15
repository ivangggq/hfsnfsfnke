import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import companyService from '../../services/company.service';
import documentService from '../../services/document.service';
import { Company } from '../../types/company.types';
import { DocumentType } from '../../types/document.types';

interface DocumentTypeOption {
  value: DocumentType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const DocumentGenerate: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [documentName, setDocumentName] = useState<string>('');
  const [documentDescription, setDocumentDescription] = useState<string>('');
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | ''>('');
  const [step, setStep] = useState<number>(1);

  // Document type options with descriptions and icons
  const documentTypes: DocumentTypeOption[] = [
    {
      value: 'isms_scope',
      label: 'Alcance del SGSI',
      description: 'Define los límites del Sistema de Gestión de Seguridad de la Información',
      icon: (
        <svg className="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      value: 'security_policy',
      label: 'Política de Seguridad',
      description: 'Establece los principios y directrices de seguridad de la información',
      icon: (
        <svg className="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      value: 'risk_assessment',
      label: 'Evaluación de Riesgos',
      description: 'Identifica, analiza y evalúa los riesgos para la seguridad de la información',
      icon: (
        <svg className="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      value: 'statement_of_applicability',
      label: 'Declaración de Aplicabilidad',
      description: 'Detalla los controles de seguridad aplicables según ISO 27001',
      icon: (
        <svg className="h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
  ];

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await companyService.getCompanies();
        setCompanies(data);

        // If there's only one company, select it by default
        if (data.length === 1) {
          setSelectedCompany(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('No se pudieron cargar las empresas');
      }
    };

    fetchCompanies();
  }, []);

  // Generate document name based on type selection
  useEffect(() => {
    if (selectedDocType) {
      const selectedType = documentTypes.find(type => type.value === selectedDocType);
      if (selectedType) {
        const companyName = selectedCompany ? 
          companies.find(c => c.id === selectedCompany)?.name : '';
          
        setDocumentName(`${selectedType.label} - ${companyName || 'Mi Empresa'}`);
      }
    }
  }, [selectedDocType, selectedCompany, companies]);

  const handleCompanySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompany(e.target.value);
  };

  const handleDocTypeSelect = (docType: DocumentType) => {
    setSelectedDocType(docType);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCompany || !selectedDocType) {
      setError('Por favor selecciona una empresa y un tipo de documento');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newDocument = await documentService.generateDocument({
        name: documentName,
        type: selectedDocType,
        description: documentDescription,
        companyId: selectedCompany,
        parameters: {}
      });

      navigate(`/documents/${newDocument.id}`);
    } catch (err) {
      console.error('Error generating document:', err);
      setError('Ocurrió un error al generar el documento. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (companies.length === 0 && !error) {
    return (
      <Card className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-neutral-900">No hay empresas registradas</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Para generar documentos, primero debes crear una empresa.
        </p>
        <div className="mt-6">
          <Button
            variant="primary"
            onClick={() => navigate('/companies/create')}
          >
            Crear Empresa
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Generar Documento</h1>
        <p className="mt-1 text-neutral-500">
          Genera documentos ISO 27001 automáticamente para tu empresa.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <div className="border-b border-neutral-200 pb-4 mb-6">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                  step >= 1 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  1
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    step >= 1 ? 'text-neutral-900' : 'text-neutral-500'
                  }`}>Seleccionar tipo de documento</h3>
                </div>
              </div>
            </div>
            <div className="w-12 flex justify-center">
              <div className={`h-0.5 w-full ${step >= 2 ? 'bg-primary-600' : 'bg-neutral-200'}`}></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                  step >= 2 ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-500'
                }`}>
                  2
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${
                    step >= 2 ? 'text-neutral-900' : 'text-neutral-500'
                  }`}>Configurar y generar</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Document Type Selection */}
          {step === 1 && (
            <div>
              <div className="mb-6">
                <label htmlFor="company" className="block text-sm font-medium text-neutral-700">
                  Empresa
                </label>
                <select
                  id="company"
                  name="company"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                  value={selectedCompany}
                  onChange={handleCompanySelect}
                  required
                >
                  <option value="">Selecciona una empresa</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium text-neutral-900">
                  Selecciona el tipo de documento a generar
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  ¿Qué documento de ISO 27001 necesitas crear?
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {documentTypes.map(docType => (
                  <div
                    key={docType.value}
                    className={`relative rounded-lg border border-neutral-300 bg-white px-6 py-5 shadow-sm cursor-pointer hover:border-primary-500 ${
                      selectedDocType === docType.value ? 'border-primary-500 ring-2 ring-primary-500' : ''
                    }`}
                    onClick={() => handleDocTypeSelect(docType.value)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {docType.icon}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-base font-medium text-neutral-900">{docType.label}</h4>
                        <p className="mt-1 text-sm text-neutral-500">
                          {docType.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Document Configuration */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-neutral-900">
                  {documentTypes.find(dt => dt.value === selectedDocType)?.label}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Configura los detalles del documento a generar
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="documentName" className="block text-sm font-medium text-neutral-700">
                    Nombre del documento
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="documentName"
                      id="documentName"
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="documentDescription" className="block text-sm font-medium text-neutral-700">
                    Descripción (opcional)
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="documentDescription"
                      name="documentDescription"
                      rows={3}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                      value={documentDescription}
                      onChange={(e) => setDocumentDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                      <p className="text-sm text-blue-700">
                        {selectedDocType === 'risk_assessment' ? (
                          'La evaluación de riesgos utilizará IA para generar escenarios de riesgo basados en la información de seguridad de la empresa.'
                        ) : (
                          'El documento se generará automáticamente en base a la información de la empresa.'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="mt-8 pt-6 border-t border-neutral-200 flex justify-between">
            {step === 2 ? (
              <>
                <Button
                  type="button"
                  variant="light"
                  onClick={() => setStep(1)}
                >
                  Anterior
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  disabled={!selectedCompany || !selectedDocType}
                >
                  Generar Documento
                </Button>
              </>
            ) : (
              <div className="ml-auto">
                <Button
                  type="button"
                  variant="primary"
                  disabled={!selectedCompany || !selectedDocType}
                  onClick={() => setStep(2)}
                >
                  Continuar
                </Button>
              </div>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default DocumentGenerate;