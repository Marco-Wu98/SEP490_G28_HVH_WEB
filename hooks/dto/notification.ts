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
