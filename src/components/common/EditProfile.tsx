import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface EditProfileProps {
  onBack: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    firstName: user?.username?.split(' ')[0] || '',
    lastName: user?.username?.split(' ')[1] || '',
    email: user?.email || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to update the user information
    console.log('Updating user information:', formData);
    // Show success message
    alert('Información actualizada correctamente');
  };

  return (
    <div className="relative">
      {/* Back Button */}
      <button
        onClick={onBack}
        className={`absolute left-8 top-15 p-4 rounded-full transition-colors ${
          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
        }`}
        aria-label="Volver"
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.5625 32.5L33.5625 46.5L30 50L10 30L30 10L33.5625 13.5L19.5625 27.5H50V32.5H19.5625Z" fill={darkMode ? '#ffffff' : '#1D1B20'}/>
        </svg>
      </button>

      <div className="px-6 lg:px-44 py-15 max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-15">
          <h2 className={`text-2xl lg:text-4xl font-bold ${
            darkMode ? 'text-white' : 'text-black'
          }`}>Editar Información</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
            {/* First Name */}
            <div className="flex-1">
              <label className={`block text-sm font-normal mb-1 ${
                darkMode ? 'text-white' : 'text-black'
              }`}>
                Nombre
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Escribe tu nombre"
                className={`w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  darkMode 
                    ? 'text-white bg-gray-700 border-gray-600 placeholder-gray-400' 
                    : 'text-gray-500 bg-white border-gray-200'
                }`}
              />
            </div>

            {/* Last Name */}
            <div className="flex-1">
              <label className={`block text-sm font-normal mb-1 ${
                darkMode ? 'text-white' : 'text-black'
              }`}>
                Apellido
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Escribe tu apellido"
                className={`w-full px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  darkMode 
                    ? 'text-white bg-gray-700 border-gray-600 placeholder-gray-400' 
                    : 'text-gray-500 bg-white border-gray-200'
                }`}
              />
            </div>

            {/* Email */}
            <div className="flex-1">
              <label className={`block text-sm font-normal mb-1 ${
                darkMode ? 'text-white' : 'text-black'
              }`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className={`w-full px-3 py-2 text-sm rounded-md cursor-not-allowed ${
                  darkMode 
                    ? 'text-gray-400 bg-gray-800 border-gray-600' 
                    : 'text-gray-500 bg-gray-50 border-gray-200'
                }`}
              />
              <p className={`text-xs mt-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>No editable</p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-start">
            <button
              type="submit"
              className="px-6 py-3 bg-purple-700 text-white text-base font-normal rounded-lg hover:bg-purple-800 transition-colors w-full lg:w-60"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
