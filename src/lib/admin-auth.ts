export function checkAdminAccess(password: string | null) {
  return password === process.env.ADMIN_PASSWORD;
}