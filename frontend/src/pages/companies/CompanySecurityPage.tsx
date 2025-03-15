import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService } from '@/services/company.service';
import { securityTemplateService } from '@/services/security-template.service';
import { useToast } from '@/context/ToastContext';
import {
  ArrowLeftIcon,
  XMarkIcon,
  PlusIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

const CompanySecurityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);

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

  // Obtener plantillas de seguridad
  const {
    data: templatesData,
    isLoading: isLoadingTemplates,
  } = useQuery(
    ['security-templates', { default: true }],
    () => securityTemplateService.getTemplates(undefined, true),
    {
      onError: () => {
        showToast('Error al cargar las plantillas de seguridad', 'error');
      },
    }
  );

  // Mutación para actualizar la información de seguridad
  const updateCompanyMutation = useMutation(
    (data: { securityInfo?: any; securityTemplateId?: string }) =>
      companyService.updateCompany(id!, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['company', id]);
        showToast('Información de seguridad actualizada', 'success');
        setSelectedTemplate('');
      },
      onError: () => {
        showToast('Error al actualizar la información de seguridad', 'error');
      },
    }
  );

  const company = companyData?.data;
  const templates = templatesData?.data || [];

  // Aplicar plantilla seleccionada
  const handleApplyTemplate = () => {
    if (selectedTemplate) {
      updateCompanyMutation.mutate({ securityTemplateId: selectedTemplate });
      setIsTemplateDropdownOpen(false);
    }
  };

  // Agregar un nuevo elemento a una lista de seguridad
  const handleAddItem = (
    category: 'informationAssets' | 'threats' | 'vulnerabilities' | 'existingMeasures',
    item: string
  ) => {
    if (!item.trim()) return;

    const securityInfo = { ...(company?.securityInfo || {}) };
    securityInfo[category] = [...(securityInfo[category] || []), item.trim()];

    updateCompanyMutation.mutate({ securityInfo });
  };

  // Eliminar un elemento de una lista de seguridad
  const handleRemoveItem = (
    category: 'informationAssets' | 'threats' | 'vulnerabilities' | 'existingMeasures',
    index: number
  ) => {
    const securityInfo = { ...(company?.securityInfo || {}) };
    if (securityInfo[category] && Array.isArray(securityInfo[category])) {
      securityInfo[category] = securityInfo[category].filter((_, i) => i !== index);
      updateCompanyMutation.mutate({ securityInfo });
    }
  };

  // Obtener el nombre de la plantilla seleccionada
  const getSelectedTemplateName = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    return template ? `${template.name} - ${template.industry}` : 'Seleccionar plantilla';
  };

  // CSS común para inputs y botones
  const inputCommonStyles = "h-10 shadow-sm block w-full sm:text-sm border-gray-300 rounded-md px-3";
  const buttonCommonStyles = "h-10 ml-3 inline-flex items-center px-3 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2";

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
          to={`/companies/${id}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Volver a la empresa
        </Link>
      </div>

      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Información de Seguridad
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {company.name} - Gestión de activos, amenazas, vulnerabilidades y controles
          </p>
        </div>
      </div>

      {/* Sección de plantillas mejorada */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-4">
            <DocumentCheckIcon className="h-8 w-8 text-primary mr-3" />
            <h3 className="text-xl leading-6 font-bold text-primary">
              Plantillas de Seguridad
            </h3>
          </div>
          
          <div className="mt-2 max-w-xl text-sm text-gray-700">
            <p>
              Puedes aplicar una plantilla predefinida para poblar automáticamente la información
              de seguridad según la industria de tu empresa.
            </p>
            <p className="mt-1 font-medium text-warning-700 bg-warning-50 px-3 py-1 rounded-md inline-block mt-2">
              <ExclamationTriangleIcon className="inline-block h-4 w-4 mr-1" />
              Esto reemplazará cualquier información actual.
            </p>
          </div>
          
          {/* Select con posicionamiento corregido */}
          <div className="mt-5 sm:flex sm:items-center">
            <div className="w-full max-w-md">
              <div className="static">
                <div 
                  className="h-10 cursor-pointer bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                >
                  <div className="flex items-center">
                    <DocumentCheckIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                    <span className="block truncate">{getSelectedTemplateName()}</span>
                  </div>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </div>
                
                {isTemplateDropdownOpen && (
                  <div className="absolute left-0 z-50 mt-1 max-w-md w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm max-h-60">
                    {isLoadingTemplates ? (
                      <div className="py-2 px-3 text-gray-700">Cargando plantillas...</div>
                    ) : templates.length === 0 ? (
                      <div className="py-2 px-3 text-gray-700">No hay plantillas disponibles</div>
                    ) : (
                      templates.map((template) => (
                        <div
                          key={template.id}
                          className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-primary-50 ${
                            selectedTemplate === template.id ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                          }`}
                          onClick={() => {
                            setSelectedTemplate(template.id);
                            setIsTemplateDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            <DocumentCheckIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                            <span className="block truncate font-medium">{template.name} - {template.industry}</span>
                          </div>
                          {selectedTemplate === template.id && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600">
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleApplyTemplate}
              disabled={!selectedTemplate}
              className={`h-10 mt-3 sm:mt-0 sm:ml-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md ${
                !selectedTemplate
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
              }`}
            >
              Aplicar Plantilla
            </button>
          </div>
        </div>
      </div>

      {/* Información de seguridad mejorada */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  {/* Activos de información */}
  <div className="bg-white shadow overflow-hidden sm:rounded-lg flex flex-col h-full">
    <div className="px-4 py-5 sm:p-6 flex flex-col h-full">
      <div>
        <div className="flex items-center mb-4">
          <ClipboardDocumentListIcon className="h-7 w-7 text-blue-600 mr-2" />
          <h3 className="text-lg leading-6 font-bold text-gray-900">Activos de Información</h3>
        </div>
        <p className="max-w-2xl text-sm text-gray-500 mb-4">Lista de activos de información valiosos para la empresa</p>

        <div className="mt-4 flex flex-wrap gap-2 mb-4">
          {company.securityInfo?.informationAssets && company.securityInfo.informationAssets.length > 0 ? (
            company.securityInfo.informationAssets.map((asset, index) => (
              <div
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
              >
                {asset}
                <button
                  type="button"
                  onClick={() => handleRemoveItem('informationAssets', index)}
                  className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:text-blue-700 focus:outline-none focus:text-blue-700"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No hay activos de información registrados</p>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4">
        <form onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.querySelector('input') as HTMLInputElement;
          if (input.value) {
            handleAddItem('informationAssets', input.value);
            input.value = '';
          }
        }} className="flex items-center">
          <input
            type="text"
            className={`${inputCommonStyles} focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Agregar activo de información"
          />
          <button
            type="submit"
            className={`${buttonCommonStyles} bg-blue-600 hover:bg-blue-700 focus:ring-blue-500`}
          >
            <PlusIcon className="-ml-1 mr-1 h-4 w-4" />
            Agregar
          </button>
        </form>
      </div>
    </div>
  </div>

  {/* Amenazas */}
  <div className="bg-white shadow overflow-hidden sm:rounded-lg flex flex-col h-full">
    <div className="px-4 py-5 sm:p-6 flex flex-col h-full">
      <div>
        <div className="flex items-center mb-4">
          <ExclamationTriangleIcon className="h-7 w-7 text-red-600 mr-2" />
          <h3 className="text-lg leading-6 font-bold text-gray-900">Amenazas</h3>
        </div>
        <p className="max-w-2xl text-sm text-gray-500 mb-4">Posibles amenazas que podrían afectar a los activos de información</p>

        <div className="mt-4 flex flex-wrap gap-2 mb-4">
          {company.securityInfo?.threats && company.securityInfo.threats.length > 0 ? (
            company.securityInfo.threats.map((threat, index) => (
              <div
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-100"
              >
                {threat}
                <button
                  type="button"
                  onClick={() => handleRemoveItem('threats', index)}
                  className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-red-400 hover:text-red-700 focus:outline-none focus:text-red-700"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No hay amenazas registradas</p>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4">
        <form onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.querySelector('input') as HTMLInputElement;
          if (input.value) {
            handleAddItem('threats', input.value);
            input.value = '';
          }
        }} className="flex items-center">
          <input
            type="text"
            className={`${inputCommonStyles} focus:ring-red-500 focus:border-red-500`}
            placeholder="Agregar amenaza"
          />
          <button
            type="submit"
            className={`${buttonCommonStyles} bg-red-600 hover:bg-red-700 focus:ring-red-500`}
          >
            <PlusIcon className="-ml-1 mr-1 h-4 w-4" />
            Agregar
          </button>
        </form>
      </div>
    </div>
  </div>

  {/* Vulnerabilidades */}
  <div className="bg-white shadow overflow-hidden sm:rounded-lg flex flex-col h-full">
    <div className="px-4 py-5 sm:p-6 flex flex-col h-full">
      <div>
        <div className="flex items-center mb-4">
          <ShieldCheckIcon className="h-7 w-7 text-amber-600 mr-2" />
          <h3 className="text-lg leading-6 font-bold text-gray-900">Vulnerabilidades</h3>
        </div>
        <p className="max-w-2xl text-sm text-gray-500 mb-4">Debilidades que podrían ser explotadas por las amenazas</p>

        <div className="mt-4 flex flex-wrap gap-2 mb-4">
          {company.securityInfo?.vulnerabilities && company.securityInfo.vulnerabilities.length > 0 ? (
            company.securityInfo.vulnerabilities.map((vulnerability, index) => (
              <div
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-100"
              >
                {vulnerability}
                <button
                  type="button"
                  onClick={() => handleRemoveItem('vulnerabilities', index)}
                  className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-amber-400 hover:text-amber-700 focus:outline-none focus:text-amber-700"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No hay vulnerabilidades registradas</p>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4">
        <form onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.querySelector('input') as HTMLInputElement;
          if (input.value) {
            handleAddItem('vulnerabilities', input.value);
            input.value = '';
          }
        }} className="flex items-center">
          <input
            type="text"
            className={`${inputCommonStyles} focus:ring-amber-500 focus:border-amber-500`}
            placeholder="Agregar vulnerabilidad"
          />
          <button
            type="submit"
            className={`${buttonCommonStyles} bg-amber-600 hover:bg-amber-700 focus:ring-amber-500`}
          >
            <PlusIcon className="-ml-1 mr-1 h-4 w-4" />
            Agregar
          </button>
        </form>
      </div>
    </div>
  </div>

  {/* Medidas existentes */}
  <div className="bg-white shadow overflow-hidden sm:rounded-lg flex flex-col h-full">
    <div className="px-4 py-5 sm:p-6 flex flex-col h-full">
      <div>
        <div className="flex items-center mb-4">
          <LockClosedIcon className="h-7 w-7 text-green-600 mr-2" />
          <h3 className="text-lg leading-6 font-bold text-gray-900">Medidas Existentes</h3>
        </div>
        <p className="max-w-2xl text-sm text-gray-500 mb-4">Controles y medidas de seguridad implementadas actualmente</p>

        <div className="mt-4 flex flex-wrap gap-2 mb-4">
          {company.securityInfo?.existingMeasures && company.securityInfo.existingMeasures.length > 0 ? (
            company.securityInfo.existingMeasures.map((measure, index) => (
              <div
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100"
              >
                {measure}
                <button
                  type="button"
                  onClick={() => handleRemoveItem('existingMeasures', index)}
                  className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-400 hover:text-green-700 focus:outline-none focus:text-green-700"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No hay medidas existentes registradas</p>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4">
        <form onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.querySelector('input') as HTMLInputElement;
          if (input.value) {
            handleAddItem('existingMeasures', input.value);
            input.value = '';
          }
        }} className="flex items-center">
          <input
            type="text"
            className={`${inputCommonStyles} focus:ring-green-500 focus:border-green-500`}
            placeholder="Agregar medida existente"
          />
          <button
            type="submit"
            className={`${buttonCommonStyles} bg-green-600 hover:bg-green-700 focus:ring-green-500`}
          >
            <PlusIcon className="-ml-1 mr-1 h-4 w-4" />
            Agregar
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

      {/* Escenarios de riesgo mejorados */}
      {company.riskScenarios && company.riskScenarios.length > 0 && (
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="bg-gray-50 px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-amber-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Escenarios de Riesgo</h2>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Escenarios de riesgo generados a partir de la información de seguridad
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col">
              <div className="overflow-x-auto">
                <div className="py-2 align-middle inline-block min-w-full">
                  <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ID
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Activo
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Amenaza / Vulnerabilidad
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Riesgo
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Controles
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {company.riskScenarios.map((scenario, index) => (
                          <tr key={scenario.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {scenario.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {scenario.asset}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              <div className="font-medium">{scenario.threat}</div>
                              <div className="mt-1 text-xs text-gray-500">
                                {scenario.vulnerability}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                  ${
                                    scenario.riskLevel === 'Alto'
                                      ? 'bg-red-100 text-red-800 border border-red-200'
                                      : scenario.riskLevel === 'Medio'
                                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                                  }`}
                              >
                                {scenario.riskLevel}
                              </span>
                              <div className="mt-1 text-xs text-gray-500">
                                <span className={`inline-block px-2 py-0.5 rounded mr-1 ${
                                  scenario.probability === 'Alto' 
                                    ? 'bg-red-50 text-red-700' 
                                    : scenario.probability === 'Medio'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-blue-50 text-blue-700'
                                }`}>
                                  Prob: {scenario.probability}
                                </span>
                                <span className={`inline-block px-2 py-0.5 rounded ${
                                  scenario.impact === 'Alto' 
                                    ? 'bg-red-50 text-red-700' 
                                    : scenario.impact === 'Medio'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-blue-50 text-blue-700'
                                }`}>
                                  Impacto: {scenario.impact}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              <ul className="list-disc list-inside space-y-1">
                                {scenario.controls.map((control, i) => (
                                  <li key={i} className="text-xs">
                                    {control}
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanySecurityPage;