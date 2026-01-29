import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { BeltType, User } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBeltProgress(user: User): number {
  return (user.degree / 4) * 100
}

export function getNextBelt(currentBelt: BeltType): BeltType | null {
  const beltOrder: BeltType[] = ["white", "blue", "purple", "brown", "black"]
  const currentIndex = beltOrder.indexOf(currentBelt)
  return currentIndex < beltOrder.length - 1 ? beltOrder[currentIndex + 1] : null
}

export function canGainDegree(user: User, completedItems: number, totalItems: number, recentCheckins: number): boolean {
  const completionRate = totalItems > 0 ? completedItems / totalItems : 0
  return completionRate >= 0.25 && recentCheckins >= 7
}

export function canChangeBelt(
  user: User,
  completedItems: number,
  totalItems: number,
  requiredCerts: number,
  completedCerts: number,
): boolean {
  const allItemsComplete = completedItems === totalItems
  const allCertsComplete = completedCerts >= requiredCerts
  return allItemsComplete && allCertsComplete && user.degree === 4
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export function getStreakBonus(streak: number): number {
  return Math.floor(streak / 7) * 30
}
