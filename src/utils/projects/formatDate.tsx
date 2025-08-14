export const formatDate = (val: string) => {
  if (!val) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const [y, m, d] = val.split("-");
    return `${d}/${m}/${y}`;
  }
  const [y, m, d] = val.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};