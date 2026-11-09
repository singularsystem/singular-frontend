export const ADMIN_ROLE = "ADMIN" as const;
export const TEACHER_ROLE = "TEACHER" as const;

export function isAdmin(roles?: readonly string[] | null): boolean {
  if (!Array.isArray(roles)) {
    return false;
  }
  return roles.some(
    (role) => typeof role === "string" && role.toUpperCase() === ADMIN_ROLE,
  );
}

export function isTeacher(roles?: readonly string[] | null): boolean {
  if (!Array.isArray(roles)) {
    return false;
  }
  return roles.some(
    (role) => typeof role === "string" && role.toUpperCase() === TEACHER_ROLE,
  );
}
