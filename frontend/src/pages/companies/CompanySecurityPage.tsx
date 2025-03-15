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
} from '@heroicons/react/24/outline';

const CompanySecurityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

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

      {/* Sección de plantillas */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Aplicar plantilla de seguridad
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Puedes aplicar una plantilla predefinida para poblar automáticamente la información
              de seguridad según la industria de tu empresa.
            </p>
            <p className="mt-1 font-medium text-warning">
              Nota: Esto reemplazará cualquier información actual.
            </p>
          </div>
          <div className="mt-5 sm:flex sm:items-center">
            <div className="max-w-xs w-full">
              <select
                id="template"
                name="template"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <option value="">Seleccionar plantilla</option>
                {templatesData?.data?.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} - {template.industry}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Información de seguridad */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900">Información de Seguridad</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona los activos de información, amenazas, vulnerabilidades y controles de seguridad.
          </p>

          <div className="mt-6 border-t border-gray-200 pt-6">
            {/* Activos de información */}
            <div className="mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Activos de Información</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Lista de activos de información valiosos para la empresa</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {company.securityInfo?.informationAssets && company.securityInfo.informationAssets.length > 0 ? (
                  company.securityInfo.informationAssets.map((asset, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {asset}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('informationAssets', index)}
                        className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No hay elementos</p>
                )}
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.querySelector('input') as HTMLInputElement;
                if (input.value) {
                  handleAddItem('informationAssets', input.value);
                  input.value = '';
                }
              }} className="mt-3 flex">
                <input
                  type="text"
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Agregar activo de información"
                />
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <PlusIcon className="-ml-1 mr-1 h-4 w-4" />
                  Agregar
                </button>
              </form>
            </div>

            {/* Amenazas */}
            <div className="mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Amenazas</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Posibles amenazas que podrían afectar a los activos de información</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {company.securityInfo?.threats && company.securityInfo.threats.length > 0 ? (
                  company.securityInfo.threats.map((threat, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {threat}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('threats', index)}
                        className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No hay elementos</p>
                )}
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.querySelector('input') as HTMLInputElement;
                if (input.value) {
                  handleAddItem('threats', input.value);
                  input.value = '';
                }
              }} className="mt-3 flex">
                <input
                  type="text"
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Agregar amenaza"
                />
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <PlusIcon className="-ml-1 mr-1 h-4 w-4" />
                  Agregar
                </button>
              </form>
            </div>

            {/* Vulnerabilidades */}
            <div className="mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Vulnerabilidades</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Debilidades que podrían ser explotadas por las amenazas</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {company.securityInfo?.vulnerabilities && company.securityInfo.vulnerabilities.length > 0 ? (
                  company.securityInfo.vulnerabilities.map((vulnerability, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {vulnerability}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('vulnerabilities', index)}
                        className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No hay elementos</p>
                )}
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.querySelector('input') as HTMLInputElement;
                if (input.value) {
                  handleAddItem('vulnerabilities', input.value);
                  input.value = '';
                }
              }} className="mt-3 flex">
                <input
                  type="text"
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Agregar vulnerabilidad"
                />
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <PlusIcon className="-ml-1 mr-1 h-4 w-4" />
                  Agregar
                </button>
              </form>
            </div>

            {/* Medidas existentes */}
            <div className="mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Medidas Existentes</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Controles y medidas de seguridad implementadas actualmente</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {company.securityInfo?.existingMeasures && company.securityInfo.existingMeasures.length > 0 ? (
                  company.securityInfo.existingMeasures.map((measure, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {measure}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem('existingMeasures', index)}
                        className="ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No hay elementos</p>
                )}
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.querySelector('input') as HTMLInputElement;
                if (input.value) {
                  handleAddItem('existingMeasures', input.value);
                  input.value = '';
                }
              }} className="mt-3 flex">
                <input
                  type="text"
                  className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Agregar medida existente"
                />
                <button
                  type="submit"
                  className="ml-3 inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <PlusIcon className="-ml-1 mr-1 h-4 w-4" />
                  Agregar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Escenarios de riesgo */}
      {company.riskScenarios && company.riskScenarios.length > 0 && (
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900">Escenarios de Riesgo</h2>
            <p className="mt-1 text-sm text-gray-500">
              Escenarios de riesgo generados a partir de la información de seguridad
            </p>

            <div className="mt-6">
              <div className="flex flex-col">
                <div className="overflow-x-auto">
                  <div className="py-2 align-middle inline-block min-w-full">
                    <div className="overflow-hidden border-b border-gray-200 sm:rounded-lg">
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
                            <tr key={scenario.id || index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {scenario.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {scenario.asset}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                <div>{scenario.threat}</div>
                                <div className="mt-1 text-xs text-gray-400">
                                  {scenario.vulnerability}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${
                                      scenario.riskLevel === 'Alto'
                                        ? 'bg-error-100 text-error-800'
                                        : scenario.riskLevel === 'Medio'
                                        ? 'bg-warning-100 text-warning-800'
                                        : 'bg-success-100 text-success-800'
                                    }`}
                                >
                                  {scenario.riskLevel}
                                </span>
                                <div className="mt-1 text-xs text-gray-400">
                                  P: {scenario.probability} / I: {scenario.impact}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                <ul className="list-disc list-inside">
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
        </div>
      )}
    </div>
  );
};

export default CompanySecurityPage;