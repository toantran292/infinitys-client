export type Conversation = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isGroup: boolean;
  isUnread: boolean;
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
  };
  participants: {
    user?: {
      id: string;
      fullName: string;
      avatar: {
        url: string;
      };
    };
    page?: {
      id: string;
      name: string;
      avatar: {
        url: string;
      };
    };
  }[];
};
