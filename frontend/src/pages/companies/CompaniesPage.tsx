import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { companyService } from '@/services/company.service';
import { useToast } from '@/context/ToastContext';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  DocumentTextIcon, 
  ShieldExclamationIcon,
  BuildingOfficeIcon
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
              No se pudieron cargar las empresas. Por favor, intenta nuevamente.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-10 w-10 text-primary mr-3" aria-hidden="true" />
              <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                Empresas
              </h1>
            </div>
            <p className="mt-2 text-lg text-gray-600">
              Administra las empresas para la certificación ISO 27001
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:ml-4">
            <Link
              to="/companies/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Nueva Empresa
            </Link>
          </div>
        </div>

        {companies.length === 0 ? (
          <div className="py-12">
            <div className="text-center">
              <BuildingOfficeIcon className="mx-auto h-16 w-16 text-gray-400" aria-hidden="true" />
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
          <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company: Company) => (
              <div
                key={company.id}
                className="bg-white overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 rounded-lg divide-y divide-gray-200 transform hover:-translate-y-1"
              >
                <div className="px-6 py-6">
                  <div className="flex items-center">
                    {company.logo ? (
                      <img
                        className="h-14 w-14 rounded-full object-cover border border-gray-200"
                        src={company.logo}
                        alt={`${company.name} logo`}
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <BuildingOfficeIcon className="h-8 w-8" aria-hidden="true" />
                      </div>
                    )}
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {company.industry || 'Sin industria especificada'}
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <p className="text-sm text-gray-600 line-clamp-3 min-h-[4.5rem]">
                      {company.description || 'Sin descripción'}
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium">
                      <Link
                        to={`/companies/${company.id}`}
                        className="text-primary hover:text-primary-700 font-medium"
                      >
                        Ver detalles
                      </Link>
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        to={`/companies/${company.id}/edit`}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        title="Editar empresa"
                      >
                        <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                      </Link>
                      <Link
                        to={`/companies/${company.id}/security-info`}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        title="Información de seguridad"
                      >
                        <ShieldExclamationIcon className="h-5 w-5" aria-hidden="true" />
                      </Link>
                      <Link
                        to={`/companies/${company.id}/documents`}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                        title="Documentos"
                      >
                        <DocumentTextIcon className="h-5 w-5" aria-hidden="true" />
                      </Link>
                      <button
                        onClick={() => setCompanyToDelete(company)}
                        className="text-gray-500 hover:text-red-600 transition-colors duration-200"
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