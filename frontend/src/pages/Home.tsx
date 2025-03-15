import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 h-full w-full" aria-hidden="true">
          <div className="relative h-full">
            <svg
              className="absolute right-full transform translate-y-1/3 translate-x-1/4 md:translate-y-1/2 sm:translate-x-1/2 lg:translate-x-full"
              width="404"
              height="784"
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="e229dbec-10e9-49ee-8ec3-0286ca089edf"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect x="0" y="0" width="4" height="4" className="text-neutral-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="784" fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)" />
            </svg>
            <svg
              className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 sm:-translate-x-1/2 md:-translate-y-1/2 lg:-translate-x-3/4"
              width="404"
              height="784"
              fill="none"
              viewBox="0 0 404 784"
            >
              <defs>
                <pattern
                  id="d2a68204-c383-44b1-b99f-42ccff4e5365"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <rect x="0" y="0" width="4" height="4" className="text-neutral-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="784" fill="url(#d2a68204-c383-44b1-b99f-42ccff4e5365)" />
            </svg>
          </div>
        </div>

        <div className="relative pt-6 pb-16 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-neutral-900 sm:text-5xl md:text-6xl">
                <span className="block">Simplifica tu camino hacia la</span>
                <span className="block text-primary-600">certificación ISO 27001</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-neutral-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                EasyCert te ayuda a generar automáticamente la documentación necesaria para obtener la certificación ISO 27001 de forma sencilla y rápida.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                {isAuthenticated ? (
                  <>
                    <div className="rounded-md shadow">
                      <Link
                        to="/dashboard"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                      >
                        Ir al Dashboard
                      </Link>
                    </div>
                    <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                      <Link
                        to="/companies"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-neutral-50 md:py-4 md:text-lg md:px-10"
                      >
                        Mis Empresas
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-md shadow">
                      <Link
                        to="/register"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                      >
                        Empezar Gratis
                      </Link>
                    </div>
                    <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                      <Link
                        to="/login"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-neutral-50 md:py-4 md:text-lg md:px-10"
                      >
                        Iniciar Sesión
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-neutral-50 overflow-hidden lg:py-24">
        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
          <div className="relative">
            <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
              Simplifica el proceso de certificación ISO 27001
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-neutral-500">
              Genera automáticamente la documentación requerida y ahorra tiempo y recursos
            </p>
          </div>

          <div className="relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div className="relative">
              <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight sm:text-3xl">
                Documentación ISO 27001 en minutos
              </h3>
              <p className="mt-3 text-lg text-neutral-500">
                Genera automáticamente todos los documentos necesarios para la certificación ISO 27001 con solo unos clics.
              </p>

              <dl className="mt-10 space-y-10">
                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-neutral-900">Políticas de Seguridad</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-neutral-500">
                    Crea políticas de seguridad personalizadas para tu organización, adaptadas a tu industria y contexto.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-neutral-900">Evaluación de Riesgos</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-neutral-500">
                    Identifica y evalúa riesgos de seguridad con nuestra tecnología de inferencia inteligente.
                  </dd>
                </div>

                <div className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-neutral-900">Declaración de Aplicabilidad</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-neutral-500">
                    Genera automáticamente tu Declaración de Aplicabilidad (SoA) con los controles relevantes para tu organización.
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-10 -mx-4 relative lg:mt-0" aria-hidden="true">
              <div className="relative mx-auto rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <img
                    className="w-full"
                    src="https://tailwindui.com/img/component-images/full-width-with-sidebar.jpg"
                    alt="Dashboard de EasyCert"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      variant="primary"
                      size="lg"
                      icon={
                        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      }
                    >
                      Ver demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-12 sm:mt-16 lg:mt-24">
            <div className="lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="lg:col-start-2">
                <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight sm:text-3xl">
                  Plantillas personalizadas por industria
                </h3>
                <p className="mt-3 text-lg text-neutral-500">
                  Utiliza nuestras plantillas predefinidas específicas para tu industria y personalízalas según tus necesidades.
                </p>

                <dl className="mt-10 space-y-10">
                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-neutral-900">Específicas por sector</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-neutral-500">
                      Plantillas específicas para tecnología, salud, finanzas, comercio electrónico y más.
                    </dd>
                  </div>

                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-neutral-900">Personalizables</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-neutral-500">
                      Adapta cada plantilla a las necesidades específicas de tu organización con facilidad.
                    </dd>
                  </div>

                  <div className="relative">
                    <dt>
                      <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <p className="ml-16 text-lg leading-6 font-medium text-neutral-900">Conformes con ISO 27001</p>
                    </dt>
                    <dd className="mt-2 ml-16 text-base text-neutral-500">
                      Todas las plantillas cumplen con los requisitos de la norma ISO 27001:2013.
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-10 -mx-4 relative lg:mt-0 lg:col-start-1">
                <div className="relative mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-md">
                  <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                    <img
                      className="w-full"
                      src="https://tailwindui.com/img/component-images/top-nav-with-dropdown.jpg"
                      alt="Plantillas de EasyCert"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        variant="primary"
                        size="lg"
                        icon={
                          <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        }
                      >
                        Ver plantillas
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-primary-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">¿Listo para simplificar tu certificación ISO 27001?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Únete a EasyCert hoy y comienza a generar la documentación ISO 27001 de forma rápida y sencilla.
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
          >
            {isAuthenticated ? "Ir al Dashboard" : "Comenzar ahora"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;