import type { User } from "@/types";

export function editorOnly(user: User) {
  if (user.role === "editor" || user.role === "admin") {
    return true
  }
  else { return false }
}

export function adminOnly(user: User, adminMode: boolean) {
  if (user.role === "admin" && adminMode) {
    return true
  }
  else { return false }
}
