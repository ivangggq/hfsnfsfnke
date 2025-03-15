import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import CompanyForm from '../../components/company/CompanyForm';
import companyService from '../../services/company.service';
import { Company } from '../../types/company.types';
import { useToast } from '../../context/ToastContext';

const CompanyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCompany(id);
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
      showToast('Error al cargar la empresa', 'error');
      console.error('Error fetching company:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="bg-white shadow overflow-hidden rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-neutral-900">Empresa no encontrada</h3>
        <p className="mt-1 text-sm text-neutral-500">
          La empresa que estás buscando no existe o no tienes permiso para acceder a ella.
        </p>
        <div className="mt-6">
          <Link
            to="/companies"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Volver a Empresas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link
          to={`/companies/${id}`}
          className="text-primary-600 hover:text-primary-900 mr-2"
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">Editar Empresa</h1>
      </div>
      <CompanyForm initialData={company} isEditing={true} />
    </div>
  );
};

export default CompanyEdit;