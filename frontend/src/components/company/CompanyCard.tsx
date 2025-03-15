import React from 'react';
import { Link } from 'react-router-dom';
import { Company } from '../../types/company.types';

interface CompanyCardProps {
  company: Company;
  onDelete?: (id: string) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onDelete && window.confirm('¿Estás seguro de que deseas eliminar esta empresa? Esta acción no se puede deshacer.')) {
      onDelete(company.id);
    }
  };

  // Function to create initials from company name
  const getInitials = (name: string): string => {
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Function to get image or placeholder
  const getImageElement = () => {
    if (company.logo) {
      return (
        <img
          src={company.logo}
          alt={company.name}
          className="h-24 w-24 object-cover rounded-full"
        />
      );
    }
    return (
      <div className="h-24 w-24 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-3xl font-bold">
        {getInitials(company.name)}
      </div>
    );
  };

  return (
    <Link to={`/companies/${company.id}`} className="block">
      <div className="bg-white rounded-lg shadow-card overflow-hidden transition-shadow hover:shadow-card-hover">
        <div className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {getImageElement()}
            </div>
            <div className="ml-5 flex-1">
              <h3 className="text-lg font-medium text-neutral-900 truncate">
                {company.name}
              </h3>
              
              <div className="mt-1 flex items-center">
                {company.industry && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {company.industry}
                  </span>
                )}
                
                {company.location && (
                  <div className="flex items-center ml-2 text-sm text-neutral-500">
                    <svg className="flex-shrink-0 mr-1 h-4 w-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {company.location}
                  </div>
                )}
              </div>
              
              {company.description && (
                <p className="mt-2 text-sm text-neutral-500 line-clamp-2">
                  {company.description}
                </p>
              )}
            </div>
            {onDelete && (
              <div className="ml-4">
                <button
                  onClick={handleDelete}
                  className="text-neutral-400 hover:text-red-500"
                  aria-label="Eliminar empresa"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-3">
          <div className="flex justify-between text-sm">
            <div className="flex items-center text-neutral-500">
              <svg className="flex-shrink-0 mr-1 h-4 w-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {company.documents?.length || 0} documentos
            </div>
            <div className="flex items-center text-neutral-500">
              <svg className="flex-shrink-0 mr-1 h-4 w-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {company.size || 'N/A'} empleados
            </div>
            <div className="flex items-center text-neutral-500">
              <svg className="flex-shrink-0 mr-1 h-4 w-4 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(company.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard;