import React, { useState } from 'react';
import HeaderSidebarLayout from '../../../components/common/HeaderSidebarLayout';
import { useTheme } from '../../../context/ThemeContext';
import { notifySuccess, notifyError } from '../../../components/common/ToastNotify';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
}

const NotificationsPage: React.FC = () => {
  const { darkMode } = useTheme();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'push_notifications',
      title: 'Notificaciones Push',
      description: 'Recibe alertas inmediatas en tu navegador',
      enabled: false,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19l-7-7 7-7m0 14l8-8-8-8" />
        </svg>
      )
    },
    {
      id: 'email_summaries',
      title: 'Notificaciones por Email',
      description: 'Recibe un resumen diario de actividades importantes',
      enabled: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = (settingId: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === settingId 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      notifySuccess('Configuración de notificaciones actualizada');
    } catch (error) {
      notifyError('Error al guardar la configuración');
    } finally {
      setIsSubmitting(false);
    }
  };

  const enabledCount = settings.filter(s => s.enabled).length;

  return (
    <HeaderSidebarLayout headerTitle="Configuración de Notificaciones">
      <div className={`max-w-4xl mx-auto p-6 min-h-screen transition-colors ${
        darkMode ? 'bg-[#1A0F30]' : 'bg-slate-100'
      }`}>
        {/* Header Section */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 8l7-7M9 8l7 7M9 8h7v7" />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-white text-3xl font-bold mb-2">Notificaciones</h1>
              <p className="text-purple-100 text-lg opacity-90">Gestiona cómo y cuándo quieres recibir notificaciones</p>
            </div>
            <div className="text-right">
              <div className="text-white text-2xl font-bold">{enabledCount}</div>
              <div className="text-purple-100 text-sm opacity-90">activas</div>
            </div>
          </div>
        </div>


        {/* Notification Settings */}
        <div className={`rounded-2xl shadow-lg border overflow-hidden ${
          darkMode 
            ? 'bg-[#3A2B5A] border-purple-700/30 shadow-purple-900/20' 
            : 'bg-white border-gray-100'
        }`}>
          <div className="p-8">
            <h3 className={`text-xl font-bold mb-6 ${
              darkMode ? 'text-purple-200' : 'text-gray-900'
            }`}>Configuración de notificaciones</h3>
            
            <div className="space-y-4">
              {settings.map((setting) => (
                <div 
                  key={setting.id}
                  className={`flex items-center justify-between p-6 rounded-2xl transition-colors ${
                    darkMode 
                      ? 'bg-purple-800/20 hover:bg-purple-700/30 border border-purple-700/20'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      setting.enabled 
                        ? darkMode
                          ? 'bg-purple-600/40 text-purple-300' 
                          : 'bg-purple-100 text-purple-600'
                        : darkMode
                          ? 'bg-purple-800/30 text-purple-500'
                          : 'bg-gray-200 text-gray-400'
                    }`}>
                      {setting.icon}
                    </div>
                    <div>
                      <h4 className={`font-semibold mb-1 ${
                        darkMode ? 'text-purple-200' : 'text-gray-900'
                      }`}>{setting.title}</h4>
                      <p className={`text-sm ${
                        darkMode ? 'text-purple-300' : 'text-gray-600'
                      }`}>{setting.description}</p>
                    </div>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={setting.enabled}
                      onChange={() => handleToggle(setting.id)}
                    />
                    <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 ${
                      darkMode 
                        ? 'bg-purple-800/50 after:border-purple-600'
                        : 'bg-gray-200 after:border-gray-300'
                    }`}></div>
                  </label>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className={`mt-8 p-6 rounded-2xl border ${
              darkMode 
                ? 'bg-purple-900/20 border-purple-600/30'
                : 'bg-purple-50 border-purple-200'
            }`}>
              <h4 className={`font-semibold mb-4 ${
                darkMode ? 'text-purple-200' : 'text-purple-900'
              }`}>Acciones rápidas</h4>
              <div className="flex gap-4">
                <button
                  onClick={() => setSettings(prev => prev.map(s => ({ ...s, enabled: true })))}
                  className={`px-4 py-2 text-white rounded-xl transition-colors text-sm font-semibold ${
                    darkMode
                      ? 'bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-900/30'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  Activar todas
                </button>
                <button
                  onClick={() => setSettings(prev => prev.map(s => ({ ...s, enabled: false })))}
                  className={`px-4 py-2 text-white rounded-xl transition-colors text-sm font-semibold ${
                    darkMode
                      ? 'bg-purple-800 hover:bg-purple-700'
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  Desactivar todas
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex items-center justify-end gap-4 pt-6 border-t mt-8 ${
              darkMode ? 'border-purple-700/30' : 'border-gray-100'
            }`}>
              <button
                type="button"
                className={`px-6 py-3 font-semibold transition-colors ${
                  darkMode 
                    ? 'text-purple-300 hover:text-purple-200'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => window.history.back()}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={isSubmitting}
                className={`px-8 py-3 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-purple-900/30'
                    : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </div>
                ) : (
                  'Guardar configuración'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </HeaderSidebarLayout>
  );
};

export default NotificationsPage;
