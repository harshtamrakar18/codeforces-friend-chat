
export interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  isCode: boolean;
  isSaved: boolean;
  tags: string[];
  isResolved: boolean;
  recipient?: string;
  groupId?: string;
}

export interface Friend {
  handle: string;
  name: string;
  rating: number;
  isOnline: boolean;
}

export interface Submission {
  id: string;
  handle: string;
  problemName: string;
  problemRating: number;
  verdict: string;
  timestamp: Date;
  problemUrl: string;
}

export interface GroupChat {
  id: string;
  name: string;
  members: string[];
  createdBy: string;
}
