
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Message, GroupChat } from '../types';

interface SidebarContextType {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  messages: Message[];
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  isCodeMode: boolean;
  setIsCodeMode: (mode: boolean) => void;
  tagInput: string;
  setTagInput: (tag: string) => void;
  showTagInput: string | null;
  setShowTagInput: (id: string | null) => void;
  chatMode: 'individual' | 'group';
  setChatMode: (mode: 'individual' | 'group') => void;
  selectedIndividualFriend: string;
  setSelectedIndividualFriend: (friend: string) => void;
  tagFilter: string;
  setTagFilter: (filter: string) => void;
  groupChats: GroupChat[];
  setGroupChats: (chats: GroupChat[] | ((prev: GroupChat[]) => GroupChat[])) => void;
  selectedGroupChat: string;
  setSelectedGroupChat: (chat: string) => void;
  showCreateGroup: boolean;
  setShowCreateGroup: (show: boolean) => void;
  newGroupName: string;
  setNewGroupName: (name: string) => void;
  selectedGroupMembers: string[];
  setSelectedGroupMembers: (members: string[] | ((prev: string[]) => string[])) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<'individual' | 'group'>('individual');
  const [selectedIndividualFriend, setSelectedIndividualFriend] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [selectedGroupChat, setSelectedGroupChat] = useState<string>('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);

  useEffect(() => {
    const pinnedMessage: Message = {
      id: 'pinned',
      author: 'System',
      content: 'Discussion for: Maximum Subarray Sum (Rating: 1900)\nhttps://codeforces.com/problemset/problem/53/B',
      timestamp: new Date(),
      isCode: false,
      isSaved: true,
      tags: ['problem-link'],
      isResolved: false
    };
    setMessages([pinnedMessage]);
  }, []);

  const value: SidebarContextType = {
    isExpanded,
    setIsExpanded,
    messages,
    setMessages,
    newMessage,
    setNewMessage,
    isCodeMode,
    setIsCodeMode,
    tagInput,
    setTagInput,
    showTagInput,
    setShowTagInput,
    chatMode,
    setChatMode,
    selectedIndividualFriend,
    setSelectedIndividualFriend,
    tagFilter,
    setTagFilter,
    groupChats,
    setGroupChats,
    selectedGroupChat,
    setSelectedGroupChat,
    showCreateGroup,
    setShowCreateGroup,
    newGroupName,
    setNewGroupName,
    selectedGroupMembers,
    setSelectedGroupMembers
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
