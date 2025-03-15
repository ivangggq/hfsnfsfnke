import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuthContext } from '../../context/AuthContext';
import companyService from '../../services/company.service';
import documentService from '../../services/document.service';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, color }) => (
  <Card className="h-full">
    <div className="flex items-start">
      <div className={`flex-shrink-0 p-3 rounded-md ${color}`}>
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="text-sm font-medium text-neutral-500">{title}</h3>
        <p className="mt-1 text-2xl font-semibold text-neutral-900">{value}</p>
        {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      </div>
    </div>
  </Card>
);

const Dashboard: React.FC = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    companiesCount: 0,
    documentsCount: 0,
    pendingDocuments: 0,
    recentDocuments: [],
    recentCompanies: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch companies
        const companies = await companyService.getCompanies();
        
        // Fetch documents (assuming we're fetching all documents across companies)
        let allDocuments = [];
        for (const company of companies) {
          const companyDocuments = await documentService.getDocuments(company.id);
          allDocuments = [...allDocuments, ...companyDocuments];
        }
        
        // Calculate stats
        const pendingDocs = allDocuments.filter(doc => doc.status === 'draft').length;
        
        setStats({
          companiesCount: companies.length,
          documentsCount: allDocuments.length,
          pendingDocuments: pendingDocs,
          recentDocuments: allDocuments.slice(0, 5),
          recentCompanies: companies.slice(0, 5),
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-neutral-500">
          Bienvenido, {user?.firstName}. Aquí tienes una visión general de tu progreso.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Empresas"
          value={stats.companiesCount}
          description="Total de empresas registradas"
          icon={
            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          color="bg-primary-600"
        />
        <StatCard
          title="Documentos Generados"
          value={stats.documentsCount}
          description="Total de documentos creados"
          icon={
            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          color="bg-secondary-600"
        />
        <StatCard
          title="Documentos Pendientes"
          value={stats.pendingDocuments}
          description="Documentos en borrador"
          icon={
            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="bg-yellow-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button 
          variant="primary"
          icon={
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
        >
          <Link to="/companies/create">Añadir Empresa</Link>
        </Button>

        <Button 
          variant="secondary"
          icon={
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        >
          <Link to="/documents/generate">Generar Documento</Link>
        </Button>
      </div>

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Companies */}
        <Card 
          title="Empresas Recientes" 
          icon={
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          footer={
            <Link 
              to="/companies" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Ver todas las empresas →
            </Link>
          }
        >
          {stats.recentCompanies.length > 0 ? (
            <ul className="divide-y divide-neutral-200">
              {stats.recentCompanies.map((company: any) => (
                <li key={company.id} className="py-3">
                  <Link 
                    to={`/companies/${company.id}`}
                    className="flex justify-between items-center hover:bg-neutral-50 -mx-4 px-4 py-2 rounded-md"
                  >
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{company.name}</p>
                      <p className="text-xs text-neutral-500">{company.industry || 'Sin industria'}</p>
                    </div>
                    <div className="text-neutral-400">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-5">
              <p className="text-neutral-500 text-sm">No hay empresas registradas aún</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
              >
                <Link to="/companies/create">Crear empresa</Link>
              </Button>
            </div>
          )}
        </Card>

        {/* Recent Documents */}
        <Card 
          title="Documentos Recientes" 
          icon={
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          footer={
            <Link 
              to="/documents" 
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Ver todos los documentos →
            </Link>
          }
        >
          {stats.recentDocuments.length > 0 ? (
            <ul className="divide-y divide-neutral-200">
              {stats.recentDocuments.map((doc: any) => (
                <li key={doc.id} className="py-3">
                  <Link 
                    to={`/documents/${doc.id}`}
                    className="flex justify-between items-center hover:bg-neutral-50 -mx-4 px-4 py-2 rounded-md"
                  >
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{doc.name}</p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doc.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doc.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                        <span className="text-xs text-neutral-500 ml-2">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-neutral-400">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-5">
              <p className="text-neutral-500 text-sm">No hay documentos generados aún</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
              >
                <Link to="/documents/generate">Generar documento</Link>
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;