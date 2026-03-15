import { Point } from 'geojson';
import { EEventStatus } from '@/constants/event-status';
import { EServedTarget } from '@/constants/served-target';
import { EServingPlaceType } from '@/constants/serving-place-type';
export interface EventSessionDetailsResponse {
  endDateTime: string;
  // Define the structure of EventSessionDetailsResponse here
  // Example:
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface RejectEventRequest {
  reason: string;
}

export interface PendingEventSummaryResponse {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

export interface PendingEventsResponse {
  content: PendingEventSummaryResponse[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface EventDetailsResponseForManager {
  id: string;
  name: string;
  description: string;
  status: string;
  startedAt: string;
  endedAt: string;
  location: string;
  maxVolunteers: number;
  currentVolunteers: number;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  organizationName: string;
  [key: string]: unknown;
}

export interface EventDetailsResponseForSystemAdmin {
  id: string;
  name: string;
  imageUrls: string[];
  description: string;
  address: string;
  activitySubDomain: string;
  servedTarget: EServedTarget;
  servingPlaceType: EServingPlaceType;
  startDate: string; // ISO date string
  recruitmentEndDate: string; // ISO date string
  autoApprove: boolean;
  checkInLocation: Point;
  checkInAccuracyMeters: number;
  createdAt: string; // ISO date-time string
  hostPhone: string;
  orgName: string;
  status: EEventStatus;
  eventSessions: EventSessionDetailsResponse[];
  conflictSessions: EventSessionDetailsResponse[];
  note: string;
  // Additional fields
  numberOfRegisteredVolunteers: number;
  numberOfJoinedVolunteers: number;
  numberOfCheckedInVolunteers: number;
  averageRating: number;
}
