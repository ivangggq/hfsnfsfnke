import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Settings, Eye, EyeOff, Info } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { settingsService } from '@/services/settings.service';
import { UserSettings } from '@/types/models';

// Esquema de validación para las configuraciones
const settingsSchema = z.object({
  openaiKey: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith('sk-'),
      {
        message: 'La clave de API de OpenAI debe comenzar con "sk-"',
      }
    ),
  inferenceMethod: z.enum(['openai', 'fallback']),
  maxRiskScenarios: z
    .number()
    .min(1, 'Debe generar al menos 1 escenario')
    .max(20, 'No puede generar más de 20 escenarios')
    .default(5),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const SettingsPage: React.FC = () => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      inferenceMethod: 'openai',
      maxRiskScenarios: 5,
    },
  });
  
  // Cargar configuraciones actuales al montar el componente
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await settingsService.getUserSettings();
        const settings = response.data;
        
        setValue('openaiKey', settings.openaiKey || '');
        // Corregimos el tipo usando as
        setValue('inferenceMethod', (settings.inferenceMethod || 'openai') as 'openai' | 'fallback');
        setValue('maxRiskScenarios', settings.maxRiskScenarios);
      } catch (error) {
        showToast('Error al cargar la configuración', 'error');
      } finally {
        setLoading(false);
      }
    }
    
    loadSettings();
  }, [setValue, showToast]);
  
  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    try {
      await settingsService.updateUserSettings(data as UserSettings);
      showToast('Configuración actualizada correctamente', 'success');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al actualizar la configuración';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
      {/* Header más compacto */}
      <div className="flex items-center mb-4">
        <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center mr-4">
          <Settings className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-sm text-gray-600">
            Ajustes de integración y generación de escenarios de riesgo
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white shadow sm:rounded-lg mt-4">
        <form className="p-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="openaiKey" className="block text-sm font-medium text-gray-700">
              Clave de API de OpenAI
            </label>
            <div className="mt-1 relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                id="openaiKey"
                placeholder="sk-..."
                className={`
                  appearance-none block w-full px-3 py-2 border 
                  ${errors.openaiKey ? 'border-red-500' : 'border-gray-300'}
                  rounded-md shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-primary 
                  focus:border-primary sm:text-sm pr-10
                `}
                {...register('openaiKey')}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showApiKey ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              {errors.openaiKey && (
                <div className="mt-1">
                  <span className="text-red-500 text-sm">{errors.openaiKey.message}</span>
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Opcional. Si no se proporciona, se utilizará el fallback interno.
            </p>
          </div>

          <div>
            <label htmlFor="inferenceMethod" className="block text-sm font-medium text-gray-700">
              Método de inferencia
            </label>
            <div className="mt-1">
              <select
                id="inferenceMethod"
                className={`
                  appearance-none block w-full px-3 py-2 border 
                  ${errors.inferenceMethod ? 'border-red-500' : 'border-gray-300'}
                  rounded-md shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-primary 
                  focus:border-primary sm:text-sm
                `}
                {...register('inferenceMethod')}
              >
                <option value="openai">OpenAI (Recomendado)</option>
                <option value="fallback">Fallback interno</option>
              </select>
              {errors.inferenceMethod && (
                <div className="mt-1">
                  <span className="text-red-500 text-sm">{errors.inferenceMethod.message}</span>
                </div>
              )}
            </div>
            <div className="mt-1 flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Info className="h-4 w-4 text-gray-400" />
              </div>
              <p className="ml-2 text-xs text-gray-500">
                OpenAI proporciona escenarios más realistas pero requiere una clave de API. El fallback genera escenarios más genéricos.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="maxRiskScenarios" className="block text-sm font-medium text-gray-700">
              Número máximo de escenarios de riesgo
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="maxRiskScenarios"
                min="1"
                max="20"
                className={`
                  appearance-none block w-full px-3 py-2 border 
                  ${errors.maxRiskScenarios ? 'border-red-500' : 'border-gray-300'}
                  rounded-md shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-primary 
                  focus:border-primary sm:text-sm
                `}
                {...register('maxRiskScenarios', { valueAsNumber: true })}
              />
              {errors.maxRiskScenarios && (
                <div className="mt-1">
                  <span className="text-red-500 text-sm">{errors.maxRiskScenarios.message}</span>
                </div>
              )}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Controla cuántos escenarios de riesgo se generarán para cada empresa.
            </p>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              className="
                w-full flex justify-center py-2 px-4 
                border border-gray-300 rounded-md shadow-sm 
                text-sm font-medium text-gray-700 
                bg-white hover:bg-gray-50 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                transition-colors duration-300
              "
              onClick={() => window.history.back()}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full flex justify-center py-2 px-4 
                border border-transparent rounded-md shadow-sm 
                text-sm font-medium text-white 
                bg-primary hover:bg-primary-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                transition-colors duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg 
                    className="animate-spin h-5 w-5 mr-2" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Guardando...
                </div>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;