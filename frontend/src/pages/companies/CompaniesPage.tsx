import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { companyService } from '@/services/company.service';
import { useToast } from '@/context/ToastContext';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  DocumentTextIcon, 
  ShieldExclamationIcon 
} from '@heroicons/react/24/outline';
import { Company } from '@/types/models';
import DeleteCompanyModal from '@/components/companies/DeleteCompanyModal';

const CompaniesPage: React.FC = () => {
  const { showToast } = useToast();
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);
  
  // Obtener empresas del usuario
  const { 
    data: companiesData,
    isLoading,
    error,
    refetch
  } = useQuery(
    ['companies'], 
    () => companyService.getUserCompanies(),
    {
      onError: () => {
        showToast('Error al cargar las empresas', 'error');
      }
    }
  );

  const companies = companiesData?.data || [];

  const handleDelete = () => {
    if (companyToDelete) {
      companyService.deleteCompany(companyToDelete.id)
        .then(() => {
          showToast('Empresa eliminada correctamente', 'success');
          refetch();
        })
        .catch(() => {
          showToast('Error al eliminar la empresa', 'error');
        })
        .finally(() => {
          setCompanyToDelete(null);
        });
    }
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
        <span className="block sm:inline"> No se pudieron cargar las empresas. Por favor, intenta nuevamente.</span>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Empresas
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Administra las empresas para la certificación ISO 27001
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              to="/companies/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Nueva Empresa
            </Link>
          </div>
        </div>

        {companies.length === 0 ? (
          <div className="py-12">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay empresas</h3>
              <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva empresa.</p>
              <div className="mt-6">
                <Link
                  to="/companies/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Nueva Empresa
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company: Company) => (
              <div
                key={company.id}
                className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    {company.logo ? (
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={company.logo}
                        alt={`${company.name} logo`}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <svg
                          className="h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    )}
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{company.name}</h3>
                      <div className="text-sm text-gray-500">
                        {company.industry || 'Sin industria especificada'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 line-clamp-3">
                      {company.description || 'Sin descripción'}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium">
                      <Link
                        to={`/companies/${company.id}`}
                        className="text-primary hover:text-primary-700"
                      >
                        Ver detalles
                      </Link>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/companies/${company.id}/edit`}
                        className="text-gray-400 hover:text-gray-500"
                        title="Editar empresa"
                      >
                        <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                      </Link>
                      <Link
                        to={`/companies/${company.id}/security-info`}
                        className="text-gray-400 hover:text-gray-500"
                        title="Información de seguridad"
                      >
                        <ShieldExclamationIcon className="h-5 w-5" aria-hidden="true" />
                      </Link>
                      <Link
                        to={`/companies/${company.id}/documents`}
                        className="text-gray-400 hover:text-gray-500"
                        title="Documentos"
                      >
                        <DocumentTextIcon className="h-5 w-5" aria-hidden="true" />
                      </Link>
                      <button
                        onClick={() => setCompanyToDelete(company)}
                        className="text-gray-400 hover:text-error"
                        title="Eliminar empresa"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmación para eliminar empresa */}
      <DeleteCompanyModal
        company={companyToDelete}
        isOpen={!!companyToDelete}
        onClose={() => setCompanyToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CompaniesPage;