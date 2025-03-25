export type Conversation = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isUnread: boolean;
  lastMessage: {
    content: string;
    createdAt: string;
  };
  participants: {
    user?: {
      id: string;
      name: string;
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
  };
};
