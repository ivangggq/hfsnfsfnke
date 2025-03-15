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
} from '@heroicons/react/24/outline';
import { SecurityTemplate } from '@/types/models';

const TemplatesPage: React.FC = () => {
  const { showToast } = useToast();
  const { isAdmin } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<SecurityTemplate | null>(null);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-100 border border-error-200 text-error-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> No se pudieron cargar las plantillas de seguridad.</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Plantillas de Seguridad
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Plantillas predefinidas de información de seguridad para diferentes industrias
          </p>
        </div>
        {isAdmin && (
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <ShieldCheckIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Nueva Plantilla
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Filtrar por Industria
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setFilterIndustry('')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filterIndustry === ''
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setFilterIndustry(industry)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  filterIndustry === industry
                    ? 'bg-primary text-white'
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
          <div
            key={template.id}
            className={`bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 border-2 ${
              selectedTemplate?.id === template.id ? 'border-primary' : 'border-transparent'
            }`}
          >
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{template.name}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 text-center">
                  {template.industry}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{template.description}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() =>
                    setSelectedTemplate(selectedTemplate?.id === template.id ? null : template)
                  }
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <DocumentMagnifyingGlassIcon
                    className="-ml-1 mr-1 h-4 w-4"
                    aria-hidden="true"
                  />
                  {selectedTemplate?.id === template.id ? 'Ocultar detalles' : 'Ver detalles'}
                </button>
                <span className="text-xs text-gray-500">
                  {template.isDefault ? 'Plantilla predefinida' : 'Plantilla personalizada'}
                </span>
              </div>
            </div>

            {selectedTemplate?.id === template.id && (
              <div className="px-4 py-4 sm:px-6">
                <div className="space-y-4">
                  {/* Activos de información */}
                  <div>
                    <button
                      className="flex justify-between items-center w-full text-left font-medium text-gray-900"
                      onClick={() => toggleSection(`${template.id}-assets`)}
                    >
                      <span>Activos de información</span>
                      {isSectionExpanded(`${template.id}-assets`) ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {isSectionExpanded(`${template.id}-assets`) && (
                      <div className="mt-2 pl-4 border-l-2 border-gray-200">
                        <ul className="space-y-1">
                          {template.template.informationAssets.map((asset, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <ChevronRightIcon
                                className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              {asset}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Amenazas */}
                  <div>
                    <button
                      className="flex justify-between items-center w-full text-left font-medium text-gray-900"
                      onClick={() => toggleSection(`${template.id}-threats`)}
                    >
                      <span>Amenazas</span>
                      {isSectionExpanded(`${template.id}-threats`) ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {isSectionExpanded(`${template.id}-threats`) && (
                      <div className="mt-2 pl-4 border-l-2 border-gray-200">
                        <ul className="space-y-1">
                          {template.template.threats.map((threat, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <ChevronRightIcon
                                className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              {threat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Vulnerabilidades */}
                  <div>
                    <button
                      className="flex justify-between items-center w-full text-left font-medium text-gray-900"
                      onClick={() => toggleSection(`${template.id}-vulnerabilities`)}
                    >
                      <span>Vulnerabilidades</span>
                      {isSectionExpanded(`${template.id}-vulnerabilities`) ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {isSectionExpanded(`${template.id}-vulnerabilities`) && (
                      <div className="mt-2 pl-4 border-l-2 border-gray-200">
                        <ul className="space-y-1">
                          {template.template.vulnerabilities.map((vulnerability, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <ChevronRightIcon
                                className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              {vulnerability}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Medidas existentes */}
                  <div>
                    <button
                      className="flex justify-between items-center w-full text-left font-medium text-gray-900"
                      onClick={() => toggleSection(`${template.id}-measures`)}
                    >
                      <span>Medidas existentes</span>
                      {isSectionExpanded(`${template.id}-measures`) ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {isSectionExpanded(`${template.id}-measures`) && (
                      <div className="mt-2 pl-4 border-l-2 border-gray-200">
                        <ul className="space-y-1">
                          {template.template.existingMeasures.map((measure, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start">
                              <ChevronRightIcon
                                className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              {measure}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay plantillas</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se encontraron plantillas para los filtros seleccionados.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setFilterIndustry('')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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