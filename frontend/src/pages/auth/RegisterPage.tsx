import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

// Esquema de validación
const registerSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe tener al menos una letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe tener al menos una letra minúscula')
    .regex(/[0-9!@#$%^&*(),.?":{}|<>]/, 'La contraseña debe tener al menos un número o carácter especial'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      const { firstName, email, password } = data;
      await registerUser({ firstName, email, password });
      showToast('Registro completado correctamente', 'success');
    } catch (error: any) {
      const errorMessage = error.error?.message || 'Error al registrar el usuario';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (type: 'password' | 'confirmPassword') => {
    if (type === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">
          Crear una cuenta
        </h2>
        <p className="text-center text-sm text-gray-600">
          Regístrate para acceder a EasyCert
        </p>
      </div>
      
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Nombre completo
          </label>
          <div className="mt-1 relative">
            <input
              type="text"
              id="firstName"
              autoComplete="name"
              className={`
                appearance-none block w-full px-3 py-2 border 
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
          <div className="mt-1 relative">
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`
                appearance-none block w-full px-3 py-2 border 
                ${errors.email ? 'border-red-500' : 'border-gray-300'}
                rounded-md shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-primary 
                focus:border-primary sm:text-sm
              `}
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div className="mt-1 relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`
                appearance-none block w-full px-3 py-2 border 
                ${errors.password ? 'border-red-500' : 'border-gray-300'}
                rounded-md shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-primary 
                focus:border-primary sm:text-sm pr-10
              `}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('password')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirmar contraseña
          </label>
          <div className="mt-1 relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
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
              onClick={() => togglePasswordVisibility('confirmPassword')}
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

        <div>
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
                Registrando...
              </div>
            ) : (
              'Registrarse'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/login" 
                className="font-medium text-primary hover:text-primary-700 transition-colors"
              >
                Iniciar sesión
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;