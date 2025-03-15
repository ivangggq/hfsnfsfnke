import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/context/ToastContext';

// Esquema de validación
const forgotPasswordSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage: React.FC = () => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      console.log(data);
      // Aquí llamaríamos al servicio de recuperación de contraseña
      // Por ahora simplemente simulamos un éxito
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmailSent(true);
      showToast('Se ha enviado un correo con instrucciones para restablecer tu contraseña', 'success');
    } catch (error: any) {
      let errorMessage = 'Error al enviar el correo de recuperación';
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">
          Correo enviado
        </h2>
        <p className="mt-2 text-gray-600">
          Hemos enviado un correo con instrucciones para restablecer tu contraseña.
        </p>
        <p className="mt-6">
          <Link to="/login" className="font-medium text-primary hover:text-primary-700">
            Volver a inicio de sesión
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-center text-3xl font-extrabold text-gray-900">
        Recuperar contraseña
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Te enviaremos un correo electrónico con instrucciones para restablecer tu contraseña.
      </p>
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className={`appearance-none block w-full px-3 py-2 border ${
                errors.email ? 'border-error' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-error">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              <Link to="/login" className="font-medium text-primary hover:text-primary-700">
                Volver a inicio de sesión
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;