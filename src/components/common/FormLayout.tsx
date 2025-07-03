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
  <form className="space-y-4" onSubmit={onSubmit}>
    {title && <div className="font-semibold text-lg mb-2">{title}</div>}
    {children}
    {error && <div className="text-red-500 text-sm">{error}</div>}
    <div className="flex justify-end gap-4 mt-6">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-600 hover:underline cursor-pointer"
        >
          {cancelLabel}
        </button>
      )}
      <button
        type="submit"
        className="bg-purple-600 text-white px-6 py-2 rounded font-semibold hover:bg-purple-700 transition cursor-pointer"
      >
        {submitLabel}
      </button>
    </div>
  </form>
);