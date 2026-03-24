// ─── Astrologer ───────────────────────────────────────────────────────────────

export interface AstrologerMeta {
  speciality: string;
  exp: string;
  rating: number;
  reviews: number;
  languages: string;
  emoji: string;
  online: boolean;
  price: number;
  about: string;
}

export interface Astrologer {
  id: string;
  name: string;
  phone: string;
  interests: string[] | null;
  meta: AstrologerMeta;
  isOnboarded: boolean;
  createdAt: string;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export interface ConsultationService {
  id: string;
  astrologerId: string;
  serviceCode: 101 | 102 | 103 | 104;
  title: string;
  shortDescription: string;
  coverImage: string;
  about: string;
  durationMinutes: number;
  price: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  meta: Record<string, unknown> | null;
}

// ─── Slot ─────────────────────────────────────────────────────────────────────

export interface AvailabilitySlot {
  id: string;
  astrologerId: string;
  date: string; // "2026-03-13"
  startTime: string; // "11:00:00"
  endTime: string; // "17:00:00"
  timezone: string; // "Asia/Kolkata"
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  meta: Record<string, unknown> | null;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface GetAstrologersResponse {
  astrologers: Astrologer[];
}

export interface GetAstrologerResponse {
  astrologer: Astrologer;
}

export interface GetServicesResponse {
  services: ConsultationService[];
}

export interface GetSlotsResponse {
  slots: AvailabilitySlot[];
}
