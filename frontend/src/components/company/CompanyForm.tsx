import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
import companyService from '../../services/company.service';
import templateService from '../../services/template.service';
import { Company } from '../../types/company.types';
import { SecurityTemplate } from '../../types/template.types';

interface CompanyFormProps {
  initialData?: Partial<Company>;
  isEditing?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ 
  initialData = {}, 
  isEditing = false 
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<SecurityTemplate[]>([]);
  const [showTemplateSection, setShowTemplateSection] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    industry: initialData.industry || '',
    location: initialData.location || '',
    size: initialData.size || '',
    description: initialData.description || '',
    website: initialData.website || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    securityTemplateId: '',
  });

  // Fetch security templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await templateService.getDefaultTemplates();
        setTemplates(data);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('No se pudieron cargar las plantillas de seguridad');
      }
    };

    fetchTemplates();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Parse size to number
      const dataToSubmit = {
        ...formData,
        size: formData.size ? parseInt(formData.size as string, 10) : undefined
      };

      if (isEditing && initialData.id) {
        await companyService.updateCompany(initialData.id, dataToSubmit);
        navigate(`/companies/${initialData.id}`);
      } else {
        const newCompany = await companyService.createCompany(dataToSubmit);
        navigate(`/companies/${newCompany.id}`);
      }
    } catch (err) {
      console.error('Error saving company:', err);
      setError('Ocurrió un error al guardar la empresa. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-neutral-900">Información Básica</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Proporciona la información general de tu empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                Nombre de la Empresa *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="industry" className="block text-sm font-medium text-neutral-700">
                Industria
              </label>
              <div className="mt-1">
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                >
                  <option value="">Selecciona una industria</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Comercio electrónico">Comercio electrónico</option>
                  <option value="Servicios profesionales">Servicios profesionales</option>
                  <option value="Salud">Salud</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Educación">Educación</option>
                  <option value="Manufactura">Manufactura</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="size" className="block text-sm font-medium text-neutral-700">
                Tamaño (Nº de empleados)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="size"
                  id="size"
                  min="1"
                  value={formData.size}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="location" className="block text-sm font-medium text-neutral-700">
                Ubicación
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="website" className="block text-sm font-medium text-neutral-700">
                Sitio Web
              </label>
              <div className="mt-1">
                <input
                  type="url"
                  name="website"
                  id="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                Email de Contacto
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
                Teléfono
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
                Descripción
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                ></textarea>
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Breve descripción de la actividad de la empresa.
              </p>
            </div>
          </div>
        </div>

        {/* Security Template Section */}
        {!isEditing && (
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-neutral-900">Plantilla de Seguridad</h3>
                <p className="mt-1 text-sm text-neutral-500">
                  Acelera tu certificación ISO 27001 utilizando una plantilla predefinida.
                </p>
              </div>
              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showTemplateSection}
                    onChange={() => setShowTemplateSection(!showTemplateSection)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  <span className="ml-3 text-sm font-medium text-neutral-700">Usar plantilla</span>
                </label>
              </div>
            </div>

            {showTemplateSection && (
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="securityTemplateId" className="block text-sm font-medium text-neutral-700">
                    Selecciona una plantilla
                  </label>
                  <div className="mt-1">
                    <select
                      id="securityTemplateId"
                      name="securityTemplateId"
                      value={formData.securityTemplateId}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                    >
                      <option value="">Seleccionar plantilla</option>
                      {templates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name} - {template.industry}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    Las plantillas proporcionan información de seguridad predefinida según tu industria.
                  </p>
                </div>

                {formData.securityTemplateId && (
                  <div className="sm:col-span-6">
                    <div className="bg-primary-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-primary-800 mb-2">
                        {templates.find(t => t.id === formData.securityTemplateId)?.name}
                      </h4>
                      <p className="text-sm text-primary-700">
                        {templates.find(t => t.id === formData.securityTemplateId)?.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Form Actions */}
        <div className="mt-8 pt-6 border-t border-neutral-200 flex justify-end space-x-3">
          <Button
            type="button"
            variant="light"
            onClick={() => navigate(isEditing ? `/companies/${initialData.id}` : '/companies')}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {isEditing ? 'Actualizar Empresa' : 'Crear Empresa'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CompanyForm;