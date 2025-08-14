export function getBackendErrorMsg(error: any): string {
  const data = error?.response?.data;
  if (!data) return error?.message || "Ocurrió un error al crear el proyecto";

  if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
    return data.non_field_errors[0];
  }
  for (const key in data) {
    if (Array.isArray(data[key]) && data[key].length > 0) {
      return data[key][0];
    }
    if (typeof data[key] === "string") {
      return data[key];
    }
  }
  return error?.message || "Ocurrió un error al crear el proyecto";
}