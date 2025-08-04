import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import logo from '../assets/logo-csi.png';

export default function NotFound() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleGoBack = () => {
    if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  return (
    <div className={`min-h-screen w-full flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <header className="w-full bg-purple-700 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center h-14 sm:h-16">
            <img src={logo} alt="Logo" className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 flex-shrink-0" />
            <span className="text-white text-lg sm:text-xl font-roboto">CSI PRO</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center flex-grow px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl w-full flex flex-col items-center text-center">
          {/* Error illustration */}
          <div className="mb-8 sm:mb-12">
            <div className={`mx-auto w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center mb-6 ${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            }`}>
              <svg 
                className={`w-16 h-16 sm:w-20 sm:h-20 ${darkMode ? "text-purple-400" : "text-purple-600"}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.239 0-4.236-.908-5.69-2.376M6.228 6.228A10.042 10.042 0 0112 3c1.944 0 3.724.556 5.24 1.516" 
                />
              </svg>
            </div>

            <h1
              className={`text-6xl sm:text-7xl lg:text-8xl font-manrope font-bold mb-4 ${
                darkMode ? "text-purple-400" : "text-purple-700"
              }`}
            >
              404
            </h1>

            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-manrope font-bold mb-4 ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Página no encontrada
            </h2>

            <p
              className={`text-base sm:text-lg lg:text-xl font-manrope leading-relaxed max-w-2xl mx-auto ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              La página que buscas no existe o ha sido movida. Verifica la URL o regresa al inicio.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-lg">
            <button
              onClick={handleGoBack}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 ${
                darkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600 border border-gray-600"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Regresar
            </button>

            <button
              onClick={handleGoHome}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 ${
                darkMode
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-purple-600 hover:bg-purple-700 shadow-sm"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Ir al Dashboard
            </button>
          </div>

          {/* Additional help text */}
          <div className="mt-8 sm:mt-12">
            <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
              ¿Necesitas ayuda? Contacta al administrador del sistema
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
