import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import SecurityInfoForm from '../../components/company/SecurityInfoForm';
import DocumentsList from '../../components/documents/DocumentsList';
import companyService from '../../services/company.service';
import documentService from '../../services/document.service';
import { Company } from '../../types/company.types';
import { Document } from '../../types/document.types';
import { InferredRiskScenario } from '../../types/risk.types';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const CompanyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  useEffect(() => {
    if (id) {
      fetchCompany(id);
      fetchDocuments(id);
    }
  }, [id]);

  const fetchCompany = async (companyId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await companyService.getCompanyById(companyId);
      setCompany(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la empresa');
      console.error('Error fetching company:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async (companyId: string) => {
    setIsLoadingDocuments(true);

    try {
      const data = await documentService.getDocuments(companyId);
      setDocuments(data);
    } catch (err: any) {
      console.error('Error fetching documents:', err);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  const handleUpdateSecurityInfo = async (securityInfo: any) => {
    if (!company || !id) return;

    setIsUpdating(true);
    setError(null);

    try {
      const updatedCompany = await companyService.updateSecurityInfo(id, securityInfo);
      setCompany(updatedCompany);
      // Show success message
      alert('Información de seguridad actualizada correctamente.');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la información de seguridad');
      console.error('Error updating security info:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await documentService.deleteDocument(documentId);
      setDocuments(documents.filter(doc => doc.id !== documentId));
    } catch (err: any) {
      console.error('Error deleting document:', err);
      alert('Error al eliminar el documento: ' + err.message);
    }
  };

  const handleDeleteCompany = async () => {
    if (!company || !id) return;

    if (window.confirm('¿Estás seguro de que deseas eliminar esta empresa? Esta acción no se puede deshacer y eliminará todos los documentos asociados.')) {
      try {
        await companyService.deleteCompany(id);
        navigate('/companies');
      } catch (err: any) {
        setError(err.message || 'Error al eliminar la empresa');
        console.error('Error deleting company:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="bg-white shadow overflow-hidden rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-neutral-900">Empresa no encontrada</h3>
        <p className="mt-1 text-sm text-neutral-500">
          La empresa que estás buscando no existe o no tienes permiso para acceder a ella.
        </p>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => navigate('/companies')}
        >
          Volver a Empresas
        </Button>
      </div>
    );
  }

  return (
    <div>
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

      {/* Company header */}
      <div className="mb-6 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-neutral-900">
              {company.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-neutral-500">
              {company.industry || 'Sin industria'} • {company.location || 'Sin ubicación'}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="light"
              onClick={() => navigate(`/companies/${id}/edit`)}
              icon={
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              }
            >
              Editar
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCompany}
              icon={
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
            >
              Eliminar
            </Button>
          </div>
        </div>
        <div className="border-t border-neutral-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-neutral-500">
                Descripción
              </dt>
              <dd className="mt-1 text-sm text-neutral-900">
                {company.description || 'Sin descripción'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-neutral-500">
                Tamaño
              </dt>
              <dd className="mt-1 text-sm text-neutral-900">
                {company.size ? `${company.size} empleados` : 'No especificado'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-neutral-500">
                Email
              </dt>
              <dd className="mt-1 text-sm text-neutral-900">
                {company.email || 'No especificado'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-neutral-500">
                Teléfono
              </dt>
              <dd className="mt-1 text-sm text-neutral-900">
                {company.phone || 'No especificado'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-neutral-500">
                Web
              </dt>
              <dd className="mt-1 text-sm text-neutral-900">
                {company.website ? (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    {company.website}
                  </a>
                ) : 'No especificado'}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-neutral-500">
                Creado
              </dt>
              <dd className="mt-1 text-sm text-neutral-900">
                {new Date(company.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex p-1 space-x-1 bg-white rounded-xl shadow mb-6">
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm leading-5 font-medium rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-neutral-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-neutral-600 hover:bg-primary-100 hover:text-primary-700'
              )
            }
          >
            Seguridad
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm leading-5 font-medium rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-neutral-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-neutral-600 hover:bg-primary-100 hover:text-primary-700'
              )
            }
          >
            Documentos
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                'w-full py-2.5 text-sm leading-5 font-medium rounded-lg',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-neutral-400 ring-white ring-opacity-60',
                selected
                  ? 'bg-primary-600 text-white shadow'
                  : 'text-neutral-600 hover:bg-primary-100 hover:text-primary-700'
              )
            }
          >
            Análisis de Riesgos
          </Tab>
        </Tab.List>
        <Tab.Panels>
          {/* Seguridad Tab */}
          <Tab.Panel>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-neutral-900">Información de Seguridad</h2>
              <div>
                <Button
                  variant="primary"
                  icon={
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                >
                  <Link to="/documents/generate">Generar Documento</Link>
                </Button>
              </div>
            </div>
            <SecurityInfoForm
              initialData={company.securityInfo}
              onSave={handleUpdateSecurityInfo}
              isLoading={isUpdating}
            />
          </Tab.Panel>

          {/* Documentos Tab */}
          <Tab.Panel>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-neutral-900">Documentos</h2>
              <div>
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
            <DocumentsList
              documents={documents}
              onDeleteDocument={handleDeleteDocument}
              isLoading={isLoadingDocuments}
            />
          </Tab.Panel>

          {/* Análisis de Riesgos Tab */}
          <Tab.Panel>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-neutral-900">Análisis de Riesgos</h2>
              <div>
                <span className="text-sm text-neutral-500">
                  Última actualización: {company.lastRiskInference ? 
                    new Date(company.lastRiskInference).toLocaleString() : 
                    'Nunca'
                  }
                </span>
              </div>
            </div>
            
            {company.riskScenarios && company.riskScenarios.length > 0 ? (
              <Card>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Activo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Amenaza
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Vulnerabilidad
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Prob.
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Impacto
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                          Riesgo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                      {company.riskScenarios.map((scenario: InferredRiskScenario) => (
                        <tr key={scenario.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                            {scenario.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {scenario.asset}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {scenario.threat}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {scenario.vulnerability}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              scenario.probability === 'Alto' ? 'bg-red-100 text-red-800' :
                              scenario.probability === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {scenario.probability}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              scenario.impact === 'Alto' ? 'bg-red-100 text-red-800' :
                              scenario.impact === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {scenario.impact}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              scenario.riskLevel === 'Alto' ? 'bg-red-100 text-red-800' :
                              scenario.riskLevel === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {scenario.riskLevel}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-10">
                  <svg className="mx-auto h-12 w-12 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-neutral-900">No hay análisis de riesgos</h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    Primero debes completar la información de seguridad para generar un análisis de riesgos.
                  </p>
                  <div className="mt-6">
                    <Button
                      variant="primary"
                      onClick={() => setSelectedTab(0)}
                    >
                      Completar Información de Seguridad
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default CompanyDetails;