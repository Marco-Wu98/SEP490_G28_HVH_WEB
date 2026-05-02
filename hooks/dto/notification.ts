export type NotificationPlatform = 'WEB' | 'ANDROID' | 'IOS';

export interface RegisterTokenRequest {
  token: string;
  platform: NotificationPlatform;
  deviceId: string;
}

export interface SendToTopicRequest {
  token: string;
  platform: NotificationPlatform;
  deviceId: string;
}

export interface SendToUserRequest {
  token: string;
  platform: NotificationPlatform;
  deviceId: string;
}

export interface NotificationResponse {
  notificationId: string;
  title?: string;
  body?: string;
  data?: Record<string, string>;
  createdAt: string; // ISO datetime string
}

export interface NotificationsResponse {
  content: NotificationResponse[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
