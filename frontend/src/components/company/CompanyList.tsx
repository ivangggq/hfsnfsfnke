import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import CompanyCard from '../../components/company/CompanyCard';
import companyService from '../../services/company.service';
import { Company } from '../../types/company.types';

const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');

  // Load companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  // Fetch companies from API
  const fetchCompanies = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await companyService.getCompanies();
      setCompanies(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las empresas');
      console.error('Error fetching companies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle company deletion
  const handleDeleteCompany = async (id: string) => {
    try {
      await companyService.deleteCompany(id);
      setCompanies(companies.filter(company => company.id !== id));
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la empresa');
      console.error('Error deleting company:', err);
    }
  };

  // Filter companies based on search and industry
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(search.toLowerCase()) ||
                         (company.description?.toLowerCase().includes(search.toLowerCase()) || false);
    const matchesIndustry = selectedIndustry === '' || company.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  // Get unique industries for filter
  const industries = Array.from(new Set(companies.map(company => company.industry).filter(Boolean)));

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Empresas</h1>
          <p className="mt-1 text-neutral-500">
            Gestiona tus empresas y su información de seguridad.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            icon={
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            <Link to="/companies/create">Nueva Empresa</Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-card p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="col-span-2">
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
                placeholder="Buscar por nombre o descripción..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-neutral-700 mb-1">
              Industria
            </label>
            <select
              id="industry"
              name="industry"
              className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
              value={selectedIndustry}
              onChange={e => setSelectedIndustry(e.target.value)}
            >
              <option value="">Todas las industrias</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
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

      {/* Loading indicator */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Companies grid */}
          {filteredCompanies.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {filteredCompanies.map(company => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onDelete={handleDeleteCompany}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-card py-12">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                
                {companies.length === 0 ? (
                  <>
                    <h3 className="mt-2 text-lg font-medium text-neutral-900">
                      No hay empresas registradas
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      Crea tu primera empresa para comenzar a usar EasyCert.
                    </p>
                    <div className="mt-6">
                      <Button
                        variant="primary"
                        icon={
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        }
                      >
                        <Link to="/companies/create">Crear Empresa</Link>
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="mt-2 text-lg font-medium text-neutral-900">
                      No se encontraron resultados
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      Prueba con otros términos de búsqueda o filtros.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompanyList;