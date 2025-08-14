import React, { useState } from 'react';

interface NotificationSettingsProps {
  onBack: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onBack }) => {
  const [settings, setSettings] = useState({
    pushNotifications: false,
    emailSummaries: true,
    securityAlerts: true
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
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
          <h2 className="text-black text-2xl lg:text-4xl font-bold">Notificaciones</h2>
        </div>

        {/* Notification Options */}
        <div className="flex flex-col md:flex-row justify-center gap-10 mb-10">
          {/* Push Notifications */}
          <div className="flex flex-col items-center gap-5 p-3 flex-1 max-w-xs">
            <button
              onClick={() => handleToggle('pushNotifications')}
              className={`w-20 h-20 rounded-lg flex items-center justify-center transition-colors ${
                settings.pushNotifications 
                  ? 'bg-purple-700 text-white' 
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                <path d="M41.8337 68.75C43.5698 68.75 45.0462 68.1431 46.2628 66.9292C47.4795 65.7153 48.0864 64.2389 48.0837 62.5H35.5837C35.5837 64.2361 36.192 65.7125 37.4087 66.9292C38.6253 68.1458 40.1003 68.7528 41.8337 68.75ZM21.0003 58.3333H62.667V50H58.5003V39.1667C58.5003 34.9306 57.4059 31.0597 55.217 27.5542C53.0281 24.0486 49.9559 21.8083 46.0003 20.8333V18.75C46.0003 17.5694 45.6003 16.5806 44.8003 15.7833C44.0003 14.9861 43.0114 14.5861 41.8337 14.5833C40.6559 14.5806 39.667 14.9806 38.867 15.7833C38.067 16.5861 37.667 17.575 37.667 18.75V20.8333C33.7087 21.8056 30.6364 24.0458 28.4503 27.5542C26.2642 31.0625 25.1698 34.9333 25.167 39.1667V50H21.0003V58.3333ZM41.8337 83.3333C36.0698 83.3333 30.6531 82.2389 25.5837 80.05C20.5142 77.8611 16.1045 74.8931 12.3545 71.1458C8.6045 67.3986 5.63644 62.9889 3.45033 57.9167C1.26422 52.8444 0.169775 47.4278 0.166997 41.6667C0.16422 35.9056 1.25866 30.4889 3.45033 25.4167C5.642 20.3444 8.61005 15.9347 12.3545 12.1875C16.0989 8.44028 20.5087 5.47222 25.5837 3.28333C30.6587 1.09444 36.0753 0 41.8337 0C47.592 0 53.0087 1.09444 58.0837 3.28333C63.1587 5.47222 67.5684 8.44028 71.3128 12.1875C75.0573 15.9347 78.0267 20.3444 80.2212 25.4167C82.4156 30.4889 83.5087 35.9056 83.5003 41.6667C83.492 47.4278 82.3976 52.8444 80.217 57.9167C78.0364 62.9889 75.0684 67.3986 71.3128 71.1458C67.5573 74.8931 63.1475 77.8625 58.0837 80.0542C53.0198 82.2458 47.6031 83.3389 41.8337 83.3333Z" fill="currentColor"/>
              </svg>
            </button>
            <h3 className="text-black text-xl font-normal text-center">Habilitar Push</h3>
          </div>

          {/* Email Summaries */}
          <div className="flex flex-col items-center gap-5 p-3 flex-1 max-w-xs">
            <button
              onClick={() => handleToggle('emailSummaries')}
              className={`w-20 h-20 rounded-lg flex items-center justify-center transition-colors ${
                settings.emailSummaries 
                  ? 'bg-purple-700 text-white' 
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              <svg width="101" height="100" viewBox="0 0 101 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                <path d="M79.667 91.6668C75.0837 91.6668 71.16 90.0349 67.8962 86.771C64.6323 83.5071 63.0003 79.5835 63.0003 75.0002V56.2502C63.0003 53.3335 64.0073 50.8682 66.0212 48.8543C68.035 46.8404 70.5003 45.8335 73.417 45.8335C76.3337 45.8335 78.7989 46.8404 80.8128 48.8543C82.8267 50.8682 83.8337 53.3335 83.8337 56.2502V75.0002H75.5003V56.2502C75.5003 55.6946 75.292 55.2085 74.8753 54.7918C74.4587 54.3752 73.9725 54.1668 73.417 54.1668C72.8614 54.1668 72.3753 54.3752 71.9587 54.7918C71.542 55.2085 71.3337 55.6946 71.3337 56.2502V75.0002C71.3337 77.2918 72.1503 79.2543 73.7837 80.8877C75.417 82.521 77.3781 83.3363 79.667 83.3335C81.9559 83.3307 83.9184 82.5154 85.5545 80.8877C87.1906 79.2599 88.0059 77.2974 88.0003 75.0002V58.3335H96.3337V75.0002C96.3337 79.5835 94.7017 83.5071 91.4378 86.771C88.1739 90.0349 84.2503 91.6668 79.667 91.6668ZM13.0003 75.0002C10.7087 75.0002 8.74755 74.1849 7.11699 72.5543C5.48644 70.9238 4.66977 68.9613 4.66699 66.6668V16.6668C4.66699 14.3752 5.48366 12.4141 7.11699 10.7835C8.75033 9.15294 10.7114 8.33627 13.0003 8.3335H79.667C81.9587 8.3335 83.9212 9.15016 85.5545 10.7835C87.1878 12.4168 88.0031 14.3779 88.0003 16.6668V41.6668H73.417C69.3892 41.6668 65.9517 43.0904 63.1045 45.9377C60.2573 48.7849 58.8337 52.2224 58.8337 56.2502V75.0002H13.0003ZM46.3337 45.8335L79.667 25.0002V16.6668L46.3337 37.5002L13.0003 16.6668V25.0002L46.3337 45.8335Z" fill="currentColor"/>
              </svg>
            </button>
            <h3 className="text-black text-xl font-normal text-center">Resúmenes por Email</h3>
          </div>

          {/* Security Alerts */}
          <div className="flex flex-col items-center gap-5 p-3 flex-1 max-w-xs">
            <button
              onClick={() => handleToggle('securityAlerts')}
              className={`w-20 h-20 rounded-lg flex items-center justify-center transition-colors ${
                settings.securityAlerts 
                  ? 'bg-purple-700 text-white' 
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              <svg width="92" height="80" viewBox="0 0 92 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                <path d="M0.333008 79.1667L46.1663 0L91.9997 79.1667H0.333008ZM46.1663 66.6667C47.3469 66.6667 48.3372 66.2667 49.1372 65.4667C49.9372 64.6667 50.3358 63.6778 50.333 62.5C50.3302 61.3222 49.9302 60.3333 49.133 59.5333C48.3358 58.7333 47.3469 58.3333 46.1663 58.3333C44.9858 58.3333 43.9969 58.7333 43.1997 59.5333C42.4025 60.3333 42.0024 61.3222 41.9997 62.5C41.9969 63.6778 42.3969 64.6681 43.1997 65.4708C44.0025 66.2736 44.9913 66.6722 46.1663 66.6667ZM41.9997 54.1667H50.333V33.3333H41.9997V54.1667Z" fill="currentColor"/>
              </svg>
            </button>
            <h3 className="text-black text-xl font-normal text-center">Alertas de Seguridad</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
