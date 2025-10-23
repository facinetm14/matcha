export function getInitials(firstName: string, lastName: string) {
  const a = (firstName || '').trim();
  const b = (lastName || '').trim();
  const first = a ? a[0].toUpperCase() : '';
  const last = b ? b[0].toUpperCase() : '';
  return `${first}${last}`;
}
