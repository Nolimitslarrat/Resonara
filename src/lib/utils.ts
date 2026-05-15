import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { ManuscriptStatus } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined, fmt = "MMM d, yyyy") {
  if (!date) return "—";
  return format(new Date(date), fmt);
}

export function timeAgo(date: Date | string | null | undefined) {
  if (!date) return "—";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatFileSize(bytes: number | null | undefined) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length = 120) {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "…";
}

export function getStatusLabel(status: ManuscriptStatus): string {
  const labels: Record<ManuscriptStatus, string> = {
    DRAFT: "Draft",
    SUBMITTED: "Submitted",
    UNDER_SCREENING: "Under Screening",
    DESK_REJECTED: "Desk Rejected",
    UNDER_REVIEW: "Under Review",
    MINOR_REVISION: "Minor Revision",
    MAJOR_REVISION: "Major Revision",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
    COPYEDITING: "Copyediting",
    PROOFREADING: "Proofreading",
    TYPESETTING: "Typesetting",
    READY_TO_PUBLISH: "Ready to Publish",
    PUBLISHED: "Published",
  };
  return labels[status] ?? status;
}

export function getStatusClass(status: ManuscriptStatus): string {
  const classes: Record<ManuscriptStatus, string> = {
    DRAFT: "status-draft",
    SUBMITTED: "status-submitted",
    UNDER_SCREENING: "status-screening",
    DESK_REJECTED: "status-rejected",
    UNDER_REVIEW: "status-under_review",
    MINOR_REVISION: "status-minor_revision",
    MAJOR_REVISION: "status-major_revision",
    ACCEPTED: "status-accepted",
    REJECTED: "status-rejected",
    COPYEDITING: "status-copyediting",
    PROOFREADING: "status-proofreading",
    TYPESETTING: "status-typesetting",
    READY_TO_PUBLISH: "status-ready_to_publish",
    PUBLISHED: "status-published",
  };
  return classes[status] ?? "status-draft";
}

export const MANUSCRIPT_STATUSES: ManuscriptStatus[] = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_SCREENING",
  "DESK_REJECTED",
  "UNDER_REVIEW",
  "MINOR_REVISION",
  "MAJOR_REVISION",
  "ACCEPTED",
  "REJECTED",
  "COPYEDITING",
  "PROOFREADING",
  "TYPESETTING",
  "READY_TO_PUBLISH",
  "PUBLISHED",
];

export const WORKFLOW_STAGES = [
  { status: "SUBMITTED" as ManuscriptStatus,       label: "Submitted",       step: 1 },
  { status: "UNDER_SCREENING" as ManuscriptStatus, label: "Screening",       step: 2 },
  { status: "UNDER_REVIEW" as ManuscriptStatus,    label: "Under Review",    step: 3 },
  { status: "ACCEPTED" as ManuscriptStatus,        label: "Decision",        step: 4 },
  { status: "COPYEDITING" as ManuscriptStatus,     label: "Production",      step: 5 },
  { status: "PUBLISHED" as ManuscriptStatus,       label: "Published",       step: 6 },
];
