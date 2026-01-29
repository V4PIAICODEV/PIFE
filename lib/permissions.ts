import type { User, UserPermissions } from "./types"

export function getUserPermissions(user: User): UserPermissions {
  switch (user.role) {
    case "admin":
      return {
        pnp: { canView: true, canEdit: true, canCreate: true, canDelete: true },
        organogram: { canView: true, canEdit: true, canCreate: true, canDelete: true },
        trails: { canView: true, canEdit: true, canCreate: true, canDelete: true },
        admin: { canView: true, canEdit: true, canCreate: true, canDelete: true },
        general: { canView: true, canEdit: true, canCreate: true, canDelete: true },
      }
    case "coordinator":
      return {
        pnp: { canView: true, canEdit: false, canCreate: false, canDelete: false },
        organogram: { canView: true, canEdit: false, canCreate: false, canDelete: false },
        trails: { canView: true, canEdit: false, canCreate: false, canDelete: false },
        admin: { canView: false, canEdit: false, canCreate: false, canDelete: false },
        general: { canView: true, canEdit: false, canCreate: false, canDelete: false },
      }
    case "player":
    default:
      return {
        pnp: { canView: false, canEdit: false, canCreate: false, canDelete: false },
        organogram: { canView: false, canEdit: false, canCreate: false, canDelete: false },
        trails: { canView: true, canEdit: false, canCreate: false, canDelete: false },
        admin: { canView: false, canEdit: false, canCreate: false, canDelete: false },
        general: { canView: true, canEdit: false, canCreate: false, canDelete: false },
      }
  }
}

export function hasPermission(
  user: User,
  section: keyof UserPermissions,
  action: keyof UserPermissions[keyof UserPermissions],
): boolean {
  const permissions = getUserPermissions(user)
  return permissions[section][action]
}
