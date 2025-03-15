import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useAuthContext } from '../../context/AuthContext';
import authService from '../../services/auth.service';

const Profile: React.FC = () => {
  const { user, loadUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await authService.updateProfile(formData);
      await loadUser(); // Reload user data
      setSuccessMessage('Perfil actualizado con éxito');
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil');
      console.error('Error updating profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get user initials for the avatar
  const getUserInitials = (): string => {
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Perfil</h1>
        <p className="mt-1 text-neutral-500">
          Administra tu información personal y preferencias de cuenta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <div className="flex flex-col items-center">
              {/* User avatar */}
              <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                {getUserInitials()}
              </div>
              
              {/* User info */}
              <h3 className="mt-4 text-lg font-medium text-neutral-900">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-neutral-500">{user.email}</p>
              
              {/* Account badges */}
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {user.roles.includes('admin') && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Administrador
                  </span>
                )}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Activo
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <div className="mt-6 border-t border-neutral-200 pt-4">
              <nav className="space-y-1">
                <Link
                  to="/settings/profile"
                  className="flex items-center px-3 py-2 text-sm font-medium text-primary-600 rounded-md bg-primary-50"
                >
                  <svg className="mr-3 h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Perfil</span>
                </Link>
                <Link
                  to="/settings/account"
                  className="flex items-center px-3 py-2 text-sm font-medium text-neutral-600 rounded-md hover:bg-neutral-50 hover:text-neutral-900"
                >
                  <svg className="mr-3 h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Cuenta</span>
                </Link>
              </nav>
            </div>
          </Card>

          {/* Account stats */}
          <Card className="mt-6">
            <h3 className="text-lg font-medium text-neutral-900">Información de la cuenta</h3>
            <div className="mt-3 border-t border-neutral-200 -mx-6 px-6 py-3">
              <dl className="divide-y divide-neutral-200">
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-neutral-500">Rol</dt>
                  <dd className="text-sm text-neutral-900">{user.roles.includes('admin') ? 'Administrador' : 'Usuario'}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-neutral-500">Estado</dt>
                  <dd className="text-sm text-neutral-900">{user.isActive ? 'Activo' : 'Inactivo'}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-neutral-500">Último acceso</dt>
                  <dd className="text-sm text-neutral-900">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'No disponible'}</dd>
                </div>
                <div className="py-3 flex justify-between">
                  <dt className="text-sm font-medium text-neutral-500">Fecha de registro</dt>
                  <dd className="text-sm text-neutral-900">{new Date(user.createdAt).toLocaleDateString()}</dd>
                </div>
              </dl>
            </div>
          </Card>
        </div>

        {/* Main content */}
        <div className="md:col-span-2">
          <Card>
            <h2 className="text-lg font-medium text-neutral-900">Información personal</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Actualiza tu información personal y cómo nos comunicamos contigo.
            </p>

            {/* Success or error messages */}
            {successMessage && (
              <div className="mt-4 rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Profile form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-neutral-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-neutral-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-neutral-300 rounded-md"
                  />
                </div>
                
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="profilePicture" className="block text-sm font-medium text-neutral-700">
                    Foto de perfil
                  </label>
                  <div className="mt-1 flex items-center">
                    <span className="h-12 w-12 rounded-full overflow-hidden bg-neutral-100">
                      <div className="h-full w-full rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold">
                        {getUserInitials()}
                      </div>
                    </span>
                    <button
                      type="button"
                      className="ml-5 bg-white py-2 px-3 border border-neutral-300 rounded-md shadow-sm text-sm leading-4 font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="pt-5 border-t border-neutral-200">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="light"
                    onClick={() => {
                      // Reset form to user values
                      setFormData({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="ml-3"
                    isLoading={isLoading}
                  >
                    Guardar
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {/* Password section */}
          <Card className="mt-6">
            <h2 className="text-lg font-medium text-neutral-900">Cambiar contraseña</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Actualiza tu contraseña para mantener tu cuenta segura.
            </p>
            <div className="mt-4">
              <Link to="/settings/account">
                <Button variant="outline">
                  Cambiar contraseña
                </Button>
              </Link>
            </div>
          </Card>

          {/* Advanced settings */}
          <Card className="mt-6">
            <h2 className="text-lg font-medium text-neutral-900">Eliminar cuenta</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Una vez que elimines tu cuenta, se perderán todos tus datos. Esta acción no se puede deshacer.
            </p>
            <div className="mt-4">
              <Button variant="danger">
                Eliminar cuenta
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;