export type User = {
  id: number;
  username: string;
  email: string;
  fullName: string;
  profilePic: string;
};

export type Connection = {
  id: number;
  conversationId: number;
  lastMessageAt: string;
  friendId: number;
  user: User;
};

export type RequestTypes = {
  id: number;
  message: string;
  createdAt: string;
  sender: User;
  onRequestResponse: any;
};

export type MessageType = {
  id: number;
  senderId: number | undefined;
  receiverId: number | undefined;
  conversationId: string | string[];
  message: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  isSendByMe: boolean;
};

export type SenderType = {
  id: number;
  fullName: string;
  profilePic?: string;
};
