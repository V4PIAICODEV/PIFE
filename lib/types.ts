export type BeltType = "white" | "blue" | "purple" | "brown" | "black";
export type ItemType = "course" | "cert" | "book";
export type ProgressStatus = "pending" | "done" | "rejected";
export type ExamType = "degree" | "belt";
export type PIFEType = "P" | "I" | "F" | "E";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "player" | "coordinator" | "admin"; // Updated role types to match requirements
  squadId?: string;
  belt: BeltType;
  degree: number; // 1-4 degrees per belt
  points: number;
  streak: number;
  avatar?: string;
  profilePhoto?: string; // Added profilePhoto field for user profile pictures
  createdAt: Date;
}

export interface Step {
  id: string;
  name: string;
  belt: BeltType;
  order: number;
  description: string;
  color: string;
}

export interface Item {
  id: string;
  stepId: string;
  type: ItemType;
  title: string;
  url?: string;
  required: boolean;
  points: number;
  description?: string;
}

export interface Progress {
  id: string;
  userId: string;
  itemId: string;
  status: ProgressStatus;
  evidenceUrl?: string;
  evidenceNote?: string;
  reviewerId?: string;
  reviewNote?: string;
  completedAt?: Date;
  createdAt: Date;
}

export interface Checkin {
  id: string;
  userId: string;
  date: Date;
  pife: PIFEType;
  note: string;
  photoUrl?: string;
  points: number;
  validated: boolean;
}

export interface Exam {
  id: string;
  stepId: string;
  type: ExamType;
  date: Date;
  status: "scheduled" | "completed" | "cancelled";
  location: string;
  description?: string;
}

export interface ExamEligibility {
  id: string;
  userId: string;
  examId: string;
  eligible: boolean;
  reason: string;
  checkedAt: Date;
}

export interface Badge {
  id: string;
  code: string;
  name: string;
  icon: string;
  description: string;
  rule: string;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  awardedAt: Date;
}

export interface Squad {
  id: string;
  name: string;
  color: string;
  memberCount?: number;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number; // in minutes
  thumbnailUrl: string;
  videoUrl: string;
  category: string;
  tags: string[];
  level: "beginner" | "intermediate" | "advanced";
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
  isPublished: boolean;
}

export interface TrainingProgress {
  id: string;
  userId: string;
  trainingId: string;
  watchedDuration: number; // in seconds
  completed: boolean;
  lastWatchedAt: Date;
}

export interface TrainingCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface Position {
  id: string;
  name: string;
  description: string;
  department: string;
  level: "junior" | "pleno" | "senior" | "lead" | "manager";
  createdAt: Date;
}

export interface TrailTemplate {
  id: string;
  positionId: string;
  name: string;
  description: string;
  steps: Step[];
  items: Item[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserTrail {
  id: string;
  userId: string;
  trailTemplateId: string;
  startedAt: Date;
  completedAt?: Date;
  currentStepId: string;
  progress: number; // 0-100
}

export interface Permission {
  canView: boolean;
  canEdit: boolean;
  canCreate: boolean;
  canDelete: boolean;
}

export interface UserPermissions {
  pnp: Permission;
  organogram: Permission;
  trails: Permission;
  admin: Permission;
  general: Permission;
}
