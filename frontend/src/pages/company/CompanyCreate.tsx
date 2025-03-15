import React from 'react';
import { Link } from 'react-router-dom';
import CompanyForm from '../../components/company/CompanyForm';

const CompanyCreate: React.FC = () => {
  return (
    <div>
      <div className="mb-6 flex items-center">
        <Link
          to="/companies"
          className="text-primary-600 hover:text-primary-900 mr-2"
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">Nueva Empresa</h1>
      </div>
      <CompanyForm />
    </div>
  );
};

export default CompanyCreate;