
import { useState, useEffect } from 'react';
import { Message, Friend, GroupChat, Submission } from '../types';

export const useSidebarState = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [chatMode, setChatMode] = useState<'individual' | 'group'>('individual');
  const [selectedIndividualFriend, setSelectedIndividualFriend] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [codeforcesHandle, setCodeforcesHandle] = useState('');
  const [currentUserHandle, setCurrentUserHandle] = useState('');
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);
  const [selectedGroupChat, setSelectedGroupChat] = useState<string>('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState<string[]>([]);

  const recentSubmissions: Submission[] = [
    {
      id: '1',
      handle: 'tourist',
      problemName: 'Maximum Subarray',
      problemRating: 1900,
      verdict: 'Accepted',
      timestamp: new Date(Date.now() - 3600000),
      problemUrl: '#'
    },
    {
      id: '2',
      handle: 'jiangly',
      problemName: 'Tree DP',
      problemRating: 2100,
      verdict: 'Wrong Answer',
      timestamp: new Date(Date.now() - 7200000),
      problemUrl: '#'
    },
  ];

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

  return {
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
    friends,
    setFriends,
    chatMode,
    setChatMode,
    selectedIndividualFriend,
    setSelectedIndividualFriend,
    tagFilter,
    setTagFilter,
    codeforcesHandle,
    setCodeforcesHandle,
    currentUserHandle,
    setCurrentUserHandle,
    groupChats,
    setGroupChats,
    selectedGroupChat,
    setSelectedGroupChat,
    showCreateGroup,
    setShowCreateGroup,
    newGroupName,
    setNewGroupName,
    selectedGroupMembers,
    setSelectedGroupMembers,
    recentSubmissions
  };
};
