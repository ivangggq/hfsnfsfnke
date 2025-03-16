import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { securityTemplateService } from '@/services/security-template.service';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import {
  ChevronRightIcon,
  ShieldCheckIcon,
  DocumentMagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { SecurityTemplate } from '@/types/models';

const TemplatesPage: React.FC = () => {
  const { showToast } = useToast();
  const { isAdmin } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [filterIndustry, setFilterIndustry] = useState<string>('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Obtener plantillas de seguridad
  const {
    data: templatesData,
    isLoading,
    error,
  } = useQuery(
    ['security-templates'],
    () => securityTemplateService.getTemplates(),
    {
      onError: () => {
        showToast('Error al cargar las plantillas de seguridad', 'error');
      },
    }
  );

  const templates = templatesData?.data || [];

  // Industrias únicas para el filtro
  const industries = Array.from(
    new Set(templates.map((template: SecurityTemplate) => template.industry))
  ).sort();

  // Filtrar plantillas por industria
  const filteredTemplates = filterIndustry
    ? templates.filter((template: SecurityTemplate) => template.industry === filterIndustry)
    : templates;

  // Alternar sección expandida
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Comprobar si una sección está expandida
  const isSectionExpanded = (section: string) => {
    return expandedSections[section] || false;
  };
  
  // Sin auto-expansión al seleccionar una plantilla

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm" role="alert">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-1 text-sm text-red-700">
              No se pudieron cargar las plantillas de seguridad. Por favor, intenta nuevamente.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-10 w-10 text-primary mr-3" aria-hidden="true" />
            <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              Plantillas de Seguridad
            </h1>
          </div>
          <p className="mt-2 text-lg text-gray-600">
            Plantillas predefinidas de información de seguridad para diferentes industrias
          </p>
        </div>
        {isAdmin && (
          <div className="mt-5 md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
            >
              <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Nueva Plantilla
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md overflow-hidden sm:rounded-lg mb-8">
        <div className="px-6 py-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Filtrar por Industria
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setFilterIndustry('')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                filterIndustry === ''
                  ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-opacity-50'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setFilterIndustry(industry)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  filterIndustry === industry
                    ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-opacity-50'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template: SecurityTemplate) => (
          <div key={template.id} className="flex flex-col">
            {/* Tarjeta principal */}
            <div 
              className={`bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg border-2 transform hover:-translate-y-1 transition-transform duration-200 ${
                selectedTemplate === template.id ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-transparent'
              }`}
            >
              <div className="px-5 py-5 flex flex-col" style={{ minHeight: '200px' }}>
                <div>
                  <h3 className="text-lg leading-6 font-bold text-gray-900">{template.name}</h3>
                  <span className="text-sm text-gray-500">
                    {template.industry}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{template.description}</p>
                <div className="mt-auto pt-4 flex justify-between items-center">
                  <button
                    onClick={() => setSelectedTemplate(selectedTemplate === template.id ? null : template.id)}
                    className={`inline-flex items-center px-3 py-2 border ${
                      selectedTemplate === template.id
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 bg-white text-primary hover:bg-primary-50'
                    } text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                  >
                    <DocumentMagnifyingGlassIcon
                      className="-ml-1 mr-1.5 h-4 w-4"
                      aria-hidden="true"
                    />
                    {selectedTemplate === template.id ? 'Ocultar detalles' : 'Ver detalles'}
                  </button>
                  <span className={`text-xs px-2 py-1 rounded-md ${
                    template.isDefault 
                      ? 'bg-gray-100 text-gray-700' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {template.isDefault ? 'Plantilla predefinida' : 'Plantilla personalizada'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sección de detalles */}
            {selectedTemplate === template.id && (
              <div className="mt-2 bg-gray-50 rounded-lg shadow-md overflow-hidden">
                <div className="px-5 py-5">
                  <div className="space-y-4">
                    {/* Activos de información */}
                    <div className="bg-white rounded-md shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                      <button
                        className="flex justify-between items-center w-full text-left font-medium text-gray-900"
                        onClick={() => toggleSection(`${template.id}-assets`)}
                      >
                        <span className="flex items-center text-blue-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Activos de información
                        </span>
                        {isSectionExpanded(`${template.id}-assets`) ? (
                          <ChevronUpIcon className="h-5 w-5 text-blue-500" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-blue-500" />
                        )}
                      </button>
                      {isSectionExpanded(`${template.id}-assets`) && (
                        <div className="mt-3 pl-4 border-l-2 border-blue-200">
                          <ul className="space-y-2">
                            {template.template?.informationAssets && template.template.informationAssets.length > 0 ? (
                              template.template.informationAssets.map((asset, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start bg-blue-50 p-2 rounded-md">
                                  <ChevronRightIcon
                                    className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0 mt-0.5"
                                    aria-hidden="true"
                                  />
                                  {asset}
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-gray-500 italic">No hay activos de información definidos</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Amenazas */}
                    <div className="bg-white rounded-md shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                      <button
                        className="flex justify-between items-center w-full text-left font-medium text-gray-900"
                        onClick={() => toggleSection(`${template.id}-threats`)}
                      >
                        <span className="flex items-center text-red-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          Amenazas
                        </span>
                        {isSectionExpanded(`${template.id}-threats`) ? (
                          <ChevronUpIcon className="h-5 w-5 text-red-500" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-red-500" />
                        )}
                      </button>
                      {isSectionExpanded(`${template.id}-threats`) && (
                        <div className="mt-3 pl-4 border-l-2 border-red-200">
                          <ul className="space-y-2">
                            {template.template?.threats && template.template.threats.length > 0 ? (
                              template.template.threats.map((threat, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start bg-red-50 p-2 rounded-md">
                                  <ChevronRightIcon
                                    className="h-4 w-4 text-red-500 mr-2 flex-shrink-0 mt-0.5"
                                    aria-hidden="true"
                                  />
                                  {threat}
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-gray-500 italic">No hay amenazas definidas</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Vulnerabilidades */}
                    <div className="bg-white rounded-md shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                      <button
                        className="flex justify-between items-center w-full text-left font-medium text-gray-900"
                        onClick={() => toggleSection(`${template.id}-vulnerabilities`)}
                      >
                        <span className="flex items-center text-amber-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                          Vulnerabilidades
                        </span>
                        {isSectionExpanded(`${template.id}-vulnerabilities`) ? (
                          <ChevronUpIcon className="h-5 w-5 text-amber-500" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-amber-500" />
                        )}
                      </button>
                      {isSectionExpanded(`${template.id}-vulnerabilities`) && (
                        <div className="mt-3 pl-4 border-l-2 border-amber-200">
                          <ul className="space-y-2">
                            {template.template?.vulnerabilities && template.template.vulnerabilities.length > 0 ? (
                              template.template.vulnerabilities.map((vulnerability, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start bg-amber-50 p-2 rounded-md">
                                  <ChevronRightIcon
                                    className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5"
                                    aria-hidden="true"
                                  />
                                  {vulnerability}
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-gray-500 italic">No hay vulnerabilidades definidas</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Medidas existentes */}
                    <div className="bg-white rounded-md shadow-sm p-4 hover:shadow-md transition-shadow duration-200">
                      <button
                        className="flex justify-between items-center w-full text-left font-medium text-gray-900"
                        onClick={() => toggleSection(`${template.id}-measures`)}
                      >
                        <span className="flex items-center text-green-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Medidas existentes
                        </span>
                        {isSectionExpanded(`${template.id}-measures`) ? (
                          <ChevronUpIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-green-500" />
                        )}
                      </button>
                      {isSectionExpanded(`${template.id}-measures`) && (
                        <div className="mt-3 pl-4 border-l-2 border-green-200">
                          <ul className="space-y-2">
                            {template.template?.existingMeasures && template.template.existingMeasures.length > 0 ? (
                              template.template.existingMeasures.map((measure, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start bg-green-50 p-2 rounded-md">
                                  <ChevronRightIcon
                                    className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                                    aria-hidden="true"
                                  />
                                  {measure}
                                </li>
                              ))
                            ) : (
                              <li className="text-sm text-gray-500 italic">No hay medidas existentes definidas</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="bg-white shadow-md overflow-hidden sm:rounded-lg">
          <div className="px-4 py-12 sm:p-12 text-center">
            <ShieldCheckIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No hay plantillas disponibles</h3>
            <p className="mt-2 text-base text-gray-500">
              No se encontraron plantillas para los filtros seleccionados.
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setFilterIndustry('')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
              >
                Ver todas las plantillas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatesPage;