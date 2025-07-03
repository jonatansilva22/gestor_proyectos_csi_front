// src/components/permissions/StudentRow.tsx
import React from "react";
import {
  Student,
  STUDENT_STATUS_LABELS,
  STUDENT_STATUS_COLORS,
} from "../../types/permissions";
import { useTheme } from "../../context/ThemeContext";

interface StudentRowProps {
  student: Student;
  onPermissionsClick: (student: Student) => void;
  onDeleteClick: (student: Student) => void;
}

export const StudentRow: React.FC<StudentRowProps> = ({
  student,
  onPermissionsClick,
  onDeleteClick,
}) => {
  const { darkMode } = useTheme();

  const getStatusColor = (status: string) => {
    return (
      STUDENT_STATUS_COLORS[status as keyof typeof STUDENT_STATUS_COLORS] ||
      "text-gray-500"
    );
  };

  const getStatusLabel = (status: string) => {
    return (
      STUDENT_STATUS_LABELS[status as keyof typeof STUDENT_STATUS_LABELS] ||
      status
    );
  };

  return (
    <>
      <div
        className={`flex items-center py-4 px-6 ${darkMode ? "hover:bg-purple-800" : "hover:bg-purple-50"} transition-colors duration-200`}
      >
        {/* User Icon */}
        <div className="flex items-center space-x-4 flex-1">
          <svg
            width="29"
            height="27"
            viewBox="0 0 29 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${darkMode ? "text-white" : "text-black"}`}
          >
            <g clipPath="url(#clip0_388_483)">
              <path
                d="M14.5 13.5C16.6975 13.5 18.805 12.7888 20.3589 11.523C21.9128 10.2571 22.7857 8.54021 22.7857 6.75C22.7857 4.95979 21.9128 3.2429 20.3589 1.97703C18.805 0.711159 16.6975 0 14.5 0C12.3025 0 10.195 0.711159 8.64111 1.97703C7.08724 3.2429 6.21429 4.95979 6.21429 6.75C6.21429 8.54021 7.08724 10.2571 8.64111 11.523C10.195 12.7888 12.3025 13.5 14.5 13.5ZM11.5417 16.0312C5.16563 16.0312 0 20.2395 0 25.4338C0 26.2986 0.860938 27 1.92254 27H27.0775C28.1391 27 29 26.2986 29 25.4338C29 20.2395 23.8344 16.0312 17.4583 16.0312H11.5417Z"
                fill="currentColor"
              />
            </g>
            <defs>
              <clipPath id="clip0_388_483">
                <rect width="29" height="27" fill="white" />
              </clipPath>
            </defs>
          </svg>

          {/* Student Name */}
          <div className="flex flex-col">
            <span
              className={`font-inter text-sm font-bold ${darkMode ? "text-white" : "text-black"}`}
            >
              {student.name}
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="flex-1 flex justify-center">
          <span
            className={`font-inter text-xl font-normal ${getStatusColor(student.status)}`}
          >
            {getStatusLabel(student.status)}
          </span>
        </div>

        {/* Email */}
        <div className="flex-1 flex justify-center">
          <span
            className={`font-inter text-xl font-normal ${darkMode ? "text-white" : "text-black"}`}
          >
            {student.email}
          </span>
        </div>

        {/* Permissions Button */}
        <div className="flex-1 flex justify-center">
          <button
            onClick={() => onPermissionsClick(student)}
            className="w-46 h-9 bg-gray-200 hover:bg-gray-300 transition-colors duration-200 rounded flex items-center justify-center"
          >
            <span className="font-inter text-2xl font-normal text-black">
              [Permisos]
            </span>
          </button>
        </div>

        {/* Delete Button */}
        <div className="flex justify-center">
          <button
            onClick={() => onDeleteClick(student)}
            className="w-9 h-9 bg-red-500 hover:bg-red-600 transition-colors duration-200 rounded-full flex items-center justify-center"
            aria-label={`Eliminar ${student.name}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M2.5 5H4.16667H17.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.66699 5V3.33333C6.66699 2.89131 6.84259 2.46738 7.15516 2.15482C7.46772 1.84226 7.89164 1.66667 8.33366 1.66667H11.667C12.109 1.66667 12.5329 1.84226 12.8455 2.15482C13.1581 2.46738 13.3337 2.89131 13.3337 3.33333V5M15.8337 5V16.6667C15.8337 17.1087 15.6581 17.5326 15.3455 17.8452C15.0329 18.1577 14.609 18.3333 14.167 18.3333H5.83366C5.39164 18.3333 4.96772 18.1577 4.65516 17.8452C4.34259 17.5326 4.16699 17.1087 4.16699 16.6667V5H15.8337Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.33301 9.16667V14.1667"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.667 9.16667V14.1667"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>


    </>
  );
};
