// src/features/astrologers/service/astrologer.service.ts
import { apiClient } from '@/src/core/api/apiClient';
import type {
  GetAstrologerResponse,
  GetAstrologersResponse,
  GetServicesResponse,
  GetSlotsResponse,
} from '../types/index';

export const astrologerService = {
  getAll: () => apiClient.get<GetAstrologersResponse>('/astrologers'),

  getById: (id: string) => apiClient.get<GetAstrologerResponse>(`/astrologers/${id}`),

  getServices: (id: string) => apiClient.get<GetServicesResponse>(`/astrologers/${id}/services`),

  getSlots: (id: string) => apiClient.get<GetSlotsResponse>(`/astrologers/${id}/slots`),
};
