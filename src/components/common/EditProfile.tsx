import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface EditProfileProps {
  onBack: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ onBack }) => {
  const { user } = useAuth();
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
        className="absolute left-8 top-15 p-4 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Volver"
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.5625 32.5L33.5625 46.5L30 50L10 30L30 10L33.5625 13.5L19.5625 27.5H50V32.5H19.5625Z" fill="#1D1B20"/>
        </svg>
      </button>

      <div className="px-6 lg:px-44 py-15 max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-15">
          <h2 className="text-black text-2xl lg:text-4xl font-bold">Editar Información</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
            {/* First Name */}
            <div className="flex-1">
              <label className="block text-black text-sm font-normal mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Escribe tu nombre"
                className="w-full px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Last Name */}
            <div className="flex-1">
              <label className="block text-black text-sm font-normal mb-1">
                Apellido
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Escribe tu apellido"
                className="w-full px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div className="flex-1">
              <label className="block text-black text-sm font-normal mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-md bg-gray-50 cursor-not-allowed"
              />
              <p className="text-gray-500 text-xs mt-1">No editable</p>
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
