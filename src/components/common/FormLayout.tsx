interface FormLayoutProps {
  title?: string;
  error?: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  children: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
}

export const FormLayout = ({
  title,
  error,
  onSubmit,
  onCancel,
  children,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
}: FormLayoutProps) => (
  <form className="space-y-4 sm:space-y-6" onSubmit={onSubmit}>
    {title && (
      <div className="font-semibold text-lg sm:text-xl mb-2 sm:mb-4 text-gray-900 dark:text-white">
        {title}
      </div>
    )}
    <div className="space-y-4 sm:space-y-6">
      {children}
    </div>
    {error && (
      <div className="text-red-500 text-sm sm:text-base bg-red-50 dark:bg-red-900/20 p-3 sm:p-4 rounded-lg border border-red-200 dark:border-red-800">
        {error}
      </div>
    )}
    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 sm:px-4 sm:py-1.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95 min-h-[40px] bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer
                     dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 
                     focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                     dark:focus:ring-gray-500 dark:focus:ring-offset-gray-800
                     transition-colors duration-200"
        >
          {cancelLabel}
        </button>
      )}
      <button
        type="submit"
        className="px-4 py-3 sm:px-6 sm:py-2 text-base sm:text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-95 min-h-[44px] bg-purple-600 text-white hover:bg-purple-700 cursor-pointer
                   focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                   focus:ring-offset-white dark:focus:ring-offset-gray-800
                   disabled:opacity-50 disabled:cursor-not-allowed
                   font-semibold transition-all duration-200 transform active:scale-95"
      >
        {submitLabel}
      </button>
    </div>
  </form>
)