import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { SecurityInfo } from '../../types/company.types';

interface SecurityInfoFormProps {
  initialData: SecurityInfo;
  onSave: (securityInfo: SecurityInfo) => Promise<void>;
  isLoading?: boolean;
}

const SecurityInfoForm: React.FC<SecurityInfoFormProps> = ({
  initialData,
  onSave,
  isLoading = false,
}) => {
  const [securityInfo, setSecurityInfo] = useState<SecurityInfo>({
    informationAssets: initialData.informationAssets || [],
    threats: initialData.threats || [],
    vulnerabilities: initialData.vulnerabilities || [], 
    existingMeasures: initialData.existingMeasures || [],
  });

  const [newItem, setNewItem] = useState({
    informationAssets: '',
    threats: '',
    vulnerabilities: '',
    existingMeasures: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleAddItem = (
    category: keyof SecurityInfo,
    item: string
  ) => {
    if (!item.trim()) return;

    // Check if item already exists
    if (securityInfo[category].includes(item.trim())) {
      setError(`"${item}" ya existe en la lista de ${getCategoryLabel(category)}`);
      return;
    }

    setSecurityInfo({
      ...securityInfo,
      [category]: [...securityInfo[category], item.trim()],
    });

    // Clear input
    setNewItem({
      ...newItem,
      [category]: '',
    });

    // Clear error
    setError(null);
  };

  const handleRemoveItem = (
    category: keyof SecurityInfo,
    index: number
  ) => {
    const newArray = [...securityInfo[category]];
    newArray.splice(index, 1);
    
    setSecurityInfo({
      ...securityInfo,
      [category]: newArray,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    category: keyof typeof newItem
  ) => {
    setNewItem({
      ...newItem,
      [category]: e.target.value,
    });
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    category: keyof SecurityInfo
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem(category, newItem[category]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await onSave(securityInfo);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la información de seguridad');
    }
  };

  const getCategoryLabel = (category: keyof SecurityInfo): string => {
    const labels = {
      informationAssets: 'Activos de Información',
      threats: 'Amenazas',
      vulnerabilities: 'Vulnerabilidades',
      existingMeasures: 'Medidas Existentes',
    };
    return labels[category];
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Information Assets */}
          <div>
            <h3 className="text-lg font-medium text-neutral-900">
              Activos de Información
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Identifica los recursos de información críticos para tu organización.
            </p>

            <div className="mt-4">
              <div className="flex">
                <input
                  type="text"
                  value={newItem.informationAssets}
                  onChange={(e) => handleInputChange(e, 'informationAssets')}
                  onKeyDown={(e) => handleInputKeyDown(e, 'informationAssets')}
                  placeholder="Añadir activo de información..."
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                />
                <Button
                  type="button"
                  variant="primary"
                  className="ml-2"
                  onClick={() => handleAddItem('informationAssets', newItem.informationAssets)}
                >
                  Añadir
                </Button>
              </div>

              <div className="mt-3">
                {securityInfo.informationAssets.length > 0 ? (
                  <div className="space-y-2">
                    {securityInfo.informationAssets.map((asset, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2 bg-neutral-50 rounded-md border border-neutral-200"
                      >
                        <span className="text-sm text-neutral-700">{asset}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem('informationAssets', index)}
                          className="text-neutral-400 hover:text-red-500"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-neutral-500">
                    No hay activos de información definidos
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Threats */}
          <div>
            <h3 className="text-lg font-medium text-neutral-900">
              Amenazas
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Identifica potenciales amenazas que podrían afectar a tus activos de información.
            </p>

            <div className="mt-4">
              <div className="flex">
                <input
                  type="text"
                  value={newItem.threats}
                  onChange={(e) => handleInputChange(e, 'threats')}
                  onKeyDown={(e) => handleInputKeyDown(e, 'threats')}
                  placeholder="Añadir amenaza..."
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                />
                <Button
                  type="button"
                  variant="primary"
                  className="ml-2"
                  onClick={() => handleAddItem('threats', newItem.threats)}
                >
                  Añadir
                </Button>
              </div>

              <div className="mt-3">
                {securityInfo.threats.length > 0 ? (
                  <div className="space-y-2">
                    {securityInfo.threats.map((threat, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2 bg-neutral-50 rounded-md border border-neutral-200"
                      >
                        <span className="text-sm text-neutral-700">{threat}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem('threats', index)}
                          className="text-neutral-400 hover:text-red-500"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-neutral-500">
                    No hay amenazas definidas
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vulnerabilities */}
          <div>
            <h3 className="text-lg font-medium text-neutral-900">
              Vulnerabilidades
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Identifica debilidades que podrían ser explotadas por las amenazas.
            </p>

            <div className="mt-4">
              <div className="flex">
                <input
                  type="text"
                  value={newItem.vulnerabilities}
                  onChange={(e) => handleInputChange(e, 'vulnerabilities')}
                  onKeyDown={(e) => handleInputKeyDown(e, 'vulnerabilities')}
                  placeholder="Añadir vulnerabilidad..."
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                />
                <Button
                  type="button"
                  variant="primary"
                  className="ml-2"
                  onClick={() => handleAddItem('vulnerabilities', newItem.vulnerabilities)}
                >
                  Añadir
                </Button>
              </div>

              <div className="mt-3">
                {securityInfo.vulnerabilities.length > 0 ? (
                  <div className="space-y-2">
                    {securityInfo.vulnerabilities.map((vulnerability, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2 bg-neutral-50 rounded-md border border-neutral-200"
                      >
                        <span className="text-sm text-neutral-700">{vulnerability}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem('vulnerabilities', index)}
                          className="text-neutral-400 hover:text-red-500"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-neutral-500">
                    No hay vulnerabilidades definidas
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Existing Measures */}
          <div>
            <h3 className="text-lg font-medium text-neutral-900">
              Medidas Existentes
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Identifica controles y medidas de seguridad ya implementados.
            </p>

            <div className="mt-4">
              <div className="flex">
                <input
                  type="text"
                  value={newItem.existingMeasures}
                  onChange={(e) => handleInputChange(e, 'existingMeasures')}
                  onKeyDown={(e) => handleInputKeyDown(e, 'existingMeasures')}
                  placeholder="Añadir medida existente..."
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                />
                <Button
                  type="button"
                  variant="primary"
                  className="ml-2"
                  onClick={() => handleAddItem('existingMeasures', newItem.existingMeasures)}
                >
                  Añadir
                </Button>
              </div>

              <div className="mt-3">
                {securityInfo.existingMeasures.length > 0 ? (
                  <div className="space-y-2">
                    {securityInfo.existingMeasures.map((measure, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2 bg-neutral-50 rounded-md border border-neutral-200"
                      >
                        <span className="text-sm text-neutral-700">{measure}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem('existingMeasures', index)}
                          className="text-neutral-400 hover:text-red-500"
                        >
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-neutral-500">
                    No hay medidas existentes definidas
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-8 pt-6 border-t border-neutral-200 flex justify-end space-x-3">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            Guardar Información de Seguridad
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SecurityInfoForm;