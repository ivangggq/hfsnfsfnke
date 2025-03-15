import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { userService } from '@/services/user.service';

const profileSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe tener al menos una letra minúscula')
    .regex(/[0-9!@#$%^&*(),.?":{}|<>]/, 'La contraseña debe tener al menos un número o carácter especial')
    .optional()
    .or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine(
  (data) => {
    // Si hay una nueva contraseña, debe haber una contraseña actual
    if (data.newPassword && !data.currentPassword) {
      return false;
    }
    return true;
  },
  {
    message: 'Debes ingresar tu contraseña actual para cambiar la contraseña',
    path: ['currentPassword'],
  }
).refine(
  (data) => {
    // Si hay una nueva contraseña, debe coincidir con la confirmación
    if (data.newPassword && data.confirmPassword && data.newPassword !== data.confirmPassword) {
      return false;
    }
    return true;
  },
  {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  }
);

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const updateData: any = {
        firstName: data.firstName,
      };

      // Solo incluir contraseña si se está cambiando
      if (changePassword && data.newPassword) {
        updateData.password = data.newPassword;
      }

      await userService.updateProfile(updateData);
      showToast('Perfil actualizado correctamente', 'success');
      
      // Resetear estado de cambio de contraseña
      setChangePassword(false);
      reset({
        ...data,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      const errorMessage = error.error?.message || 'Error al actualizar el perfil';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center py-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <div className="h-24 w-24 rounded-full bg-primary text-white flex items-center justify-center">
            <User className="h-12 w-12 text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Mi Perfil
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Nombre completo
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="firstName"
                  autoComplete="name"
                  className={`
                    appearance-none block w-full px-3 py-2 pl-10 border 
                    ${errors.firstName ? 'border-red-500' : 'border-gray-300'}
                    rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-primary 
                    focus:border-primary sm:text-sm
                  `}
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  disabled
                  className="
                    appearance-none block w-full px-3 py-2 border border-gray-300 
                    rounded-md shadow-sm bg-gray-50 
                    sm:text-sm
                  "
                  {...register('email')}
                />
                <p className="mt-1 text-xs text-gray-500">
                  El correo electrónico no se puede cambiar
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <input
                  id="changePassword"
                  name="changePassword"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={changePassword}
                  onChange={(e) => setChangePassword(e.target.checked)}
                />
                <label htmlFor="changePassword" className="ml-2 block text-sm text-gray-900">
                  Cambiar contraseña
                </label>
              </div>
            </div>

            {changePassword && (
              <>
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Contraseña actual
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      autoComplete="current-password"
                      className={`
                        appearance-none block w-full px-3 py-2 border 
                        ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'}
                        rounded-md shadow-sm 
                        focus:outline-none focus:ring-2 focus:ring-primary 
                        focus:border-primary sm:text-sm pr-10
                      `}
                      {...register('currentPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.currentPassword.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    Nueva contraseña
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      autoComplete="new-password"
                      className={`
                        appearance-none block w-full px-3 py-2 border 
                        ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}
                        rounded-md shadow-sm 
                        focus:outline-none focus:ring-2 focus:ring-primary 
                        focus:border-primary sm:text-sm pr-10
                      `}
                      {...register('newPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar nueva contraseña
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      autoComplete="new-password"
                      className={`
                        appearance-none block w-full px-3 py-2 border 
                        ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}
                        rounded-md shadow-sm 
                        focus:outline-none focus:ring-2 focus:ring-primary 
                        focus:border-primary sm:text-sm pr-10
                      `}
                      {...register('confirmPassword')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="flex space-x-3">
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
                onClick={() => {
                  reset({
                    firstName: user?.firstName || '',
                    email: user?.email || '',
                  });
                  setChangePassword(false);
                }}
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
    </div>
  );
};

export default ProfilePage;