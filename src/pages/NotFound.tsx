import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import logo from '../assets/logo-csi.png';

export default function NotFound() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const isCollaborator = (user?.role ?? 3) === 3;

  const handleGoBack = () => {
    if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
      navigate(-1);
    } else {
      navigate(isCollaborator ? '/projects' : '/dashboard');
    }
  };

  const handleGoHome = () => {
    navigate(isCollaborator ? "/projects" : "/dashboard");
  };

  return (
    <div className={`min-h-screen w-full flex flex-col ${darkMode ? "bg-[#1A0F30] text-white" : "bg-slate-100 text-gray-900"}`}>
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
              darkMode ? "bg-[#3A2B5A]" : "bg-gray-100"
            }`}>
              <svg 
                className={`w-16 h-16 sm:w-20 sm:h-20 ${darkMode ? "text-purple-400" : "text-purple-600"}`} 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                {/* Cara triste */}
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                {/* Ojos tristes */}
                <path d="M8 10c0 .5-.2 1-.5 1s-.5-.5-.5-1 .2-1 .5-1 .5.5.5 1z" fill="currentColor"/>
                <path d="M17 10c0 .5-.2 1-.5 1s-.5-.5-.5-1 .2-1 .5-1 .5.5.5 1z" fill="currentColor"/>
                {/* Boca triste */}
                <path d="M8 16s1.5-2 4-2 4 2 4 2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" transform="rotate(180 12 15)"/>
              </svg>
            </div>

            <h1
              className={`text-6xl sm:text-7xl lg:text-8xl font-manrope font-bold mb-4 ${
                darkMode ? "text-purple-400" : "text-purple-700"
              }`}
            >
              ¡Ups!
            </h1>

            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-manrope font-bold mb-4 ${
                darkMode ? "text-purple-200" : "text-gray-800"
              }`}
            >
              Me perdí en el código
            </h2>

            <p
              className={`text-base sm:text-lg lg:text-xl font-manrope leading-relaxed max-w-2xl mx-auto ${
                darkMode ? "text-purple-300" : "text-gray-600"
              }`}
            >
              Parece que esta página se fue de vacaciones sin avisar. No te preocupes, te ayudo a volver al camino correcto.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-lg">
            <button
              onClick={handleGoBack}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 ${
                darkMode
                  ? "bg-[#3A2B5A] text-white hover:bg-purple-700 border border-purple-600/50"
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
              {isCollaborator ? 'Ir a Proyectos' : 'Ir al Dashboard'}
            </button>
          </div>

          {/* Additional help text */}
          <div className="mt-8 sm:mt-12">
            <p className={`text-sm ${darkMode ? "text-purple-400" : "text-gray-500"}`}>
              ¿Necesitas ayuda? Contacta al administrador del sistema
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
