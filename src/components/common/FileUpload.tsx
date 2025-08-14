// src/components/ui/FileUpload.tsx
import React, { useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

interface FileUploadProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  required?: boolean;
  error?: string;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onFileSelect,
  required = false,
  error,
  accept = "image/*"
}) => {
  const { darkMode } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className={`font-inter text-base font-normal leading-[140%] ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200 ${darkMode ? 'bg-[#3A2B5A]' : 'bg-white'}
          ${dragOver 
            ? (darkMode ? "border-purple-400 bg-purple-900/20" : "border-[#6F43D6] bg-purple-50")
            : (darkMode ? "border-purple-600/50" : "border-gray-300")
          }
          ${error 
            ? "border-red-500" 
            : (darkMode ? "hover:border-purple-400" : "hover:border-[#6F43D6]")
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
        
        {selectedFile ? (
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>{selectedFile.name}</span>
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg
              className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className={darkMode ? 'text-white' : 'text-gray-600'}>
              <span className="font-medium">Click para subir</span> o arrastra y suelta
            </div>
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              PNG, JPG, GIF hasta 10MB
            </span>
          </div>
        )}
      </div>
      
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
};