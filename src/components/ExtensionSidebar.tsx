
import React, { useState, useEffect } from 'react';
import { MessageSquare, Code, Save, Check, X, Hash, Clock, Trophy, Users, User, Search, Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
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

interface Friend {
  handle: string;
  name: string;
  rating: number;
  isOnline: boolean;
}

interface Submission {
  id: string;
  handle: string;
  problemName: string;
  problemRating: number;
  verdict: string;
  timestamp: Date;
  problemUrl: string;
}

interface GroupChat {
  id: string;
  name: string;
  members: string[];
  createdBy: string;
}

const ExtensionSidebar = () => {
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

  const fetchCodeforcesData = async (handle: string) => {
    try {
      // Fetch user info
      const userResponse = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
      const userData = await userResponse.json();
      
      if (userData.status === 'OK') {
        // Fetch user's friends
        const friendsResponse = await fetch(`https://codeforces.com/api/user.friends?onlyOnline=false`);
        const friendsData = await friendsResponse.json();
        
        if (friendsData.status === 'OK') {
          const fetchedFriends = friendsData.result.map((friend: any) => ({
            handle: friend,
            name: friend,
            rating: Math.floor(Math.random() * 2000) + 1000, // Mock rating
            isOnline: Math.random() > 0.5
          }));
          setFriends(fetchedFriends);
        }
        
        setCurrentUserHandle(handle);
      }
    } catch (error) {
      console.error('Error fetching Codeforces data:', error);
      // Set some mock data for development
      setFriends([
        { handle: 'tourist', name: 'Gennady', rating: 3900, isOnline: true },
        { handle: 'jiangly', name: 'Jiang Ly', rating: 3800, isOnline: true },
        { handle: 'benq', name: 'Benjamin Qi', rating: 3600, isOnline: false },
        { handle: 'ecnerwala', name: 'Eric Chen', rating: 3500, isOnline: true },
      ]);
      setCurrentUserHandle(handle);
    }
  };

  const handleCodeforcesSubmit = () => {
    if (codeforcesHandle.trim()) {
      fetchCodeforcesData(codeforcesHandle.trim());
    }
  };

  const createGroupChat = () => {
    if (newGroupName.trim() && selectedGroupMembers.length > 0) {
      const newGroup: GroupChat = {
        id: Date.now().toString(),
        name: newGroupName,
        members: [...selectedGroupMembers, currentUserHandle],
        createdBy: currentUserHandle
      };
      setGroupChats(prev => [...prev, newGroup]);
      setNewGroupName('');
      setSelectedGroupMembers([]);
      setShowCreateGroup(false);
    }
  };

  const toggleGroupMember = (handle: string) => {
    setSelectedGroupMembers(prev => 
      prev.includes(handle) 
        ? prev.filter(h => h !== handle)
        : [...prev, handle]
    );
  };

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

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      author: 'You',
      content: newMessage,
      timestamp: new Date(),
      isCode: isCodeMode,
      isSaved: false,
      tags: [],
      isResolved: false,
      recipient: chatMode === 'individual' ? selectedIndividualFriend : undefined,
      groupId: chatMode === 'group' ? selectedGroupChat : undefined
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const saveMessage = (messageId: string, tags: string[]) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, isSaved: true, tags }
          : msg
      )
    );
    setShowTagInput(null);
    setTagInput('');
  };

  const resolveMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'Accepted': return 'text-green-500';
      case 'Wrong Answer': return 'text-red-500';
      case 'Time Limit Exceeded': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  const formatCodeContent = (content: string) => {
    return (
      <ScrollArea className="max-h-64 w-full">
        <pre className="bg-slate-900 p-3 rounded border overflow-x-auto whitespace-pre">
          <code className="text-sm text-slate-200">{content}</code>
        </pre>
      </ScrollArea>
    );
  };

  const getFilteredMessages = () => {
    if (chatMode === 'individual') {
      return messages.filter(msg => 
        (msg.recipient === selectedIndividualFriend && msg.author === 'You') ||
        (msg.author === selectedIndividualFriend) ||
        msg.id === 'pinned'
      );
    } else {
      return messages.filter(msg => 
        msg.groupId === selectedGroupChat || msg.id === 'pinned'
      );
    }
  };

  const getFilteredNotes = () => {
    const savedMessages = messages.filter(m => m.isSaved);
    if (!tagFilter) return savedMessages;
    
    return savedMessages.filter(msg => 
      msg.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
    );
  };

  const getAllTags = () => {
    const allTags = messages.flatMap(msg => msg.tags);
    return [...new Set(allTags)];
  };

  if (!isExpanded) {
    return (
      <div className="fixed right-0 top-0 h-full w-12 bg-gradient-to-b from-slate-900 to-slate-800 border-l border-slate-700 flex flex-col items-center py-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <MessageSquare size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-blue-400" />
          <h2 className="font-semibold text-white">Codeforces Chat</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(false)}
          className="text-slate-400 hover:text-white hover:bg-slate-700"
        >
          <X size={16} />
        </Button>
      </div>

      {/* Codeforces Handle Input */}
      {!currentUserHandle && (
        <div className="p-3 border-b border-slate-700 bg-slate-800/30 flex-shrink-0">
          <div className="text-xs text-slate-400 mb-2">Enter your Codeforces handle:</div>
          <div className="flex gap-2">
            <Input
              placeholder="Handle (e.g., tourist)"
              value={codeforcesHandle}
              onChange={(e) => setCodeforcesHandle(e.target.value)}
              className="h-8 bg-slate-800 border-slate-600 text-white text-xs"
              onKeyPress={(e) => e.key === 'Enter' && handleCodeforcesSubmit()}
            />
            <Button
              size="sm"
              onClick={handleCodeforcesSubmit}
              className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-xs"
            >
              Connect
            </Button>
          </div>
        </div>
      )}

      {/* Chat Mode Selection */}
      {currentUserHandle && (
        <div className="p-3 border-b border-slate-700 bg-slate-800/30 flex-shrink-0">
          <div className="flex gap-2 mb-3">
            <Button
              variant={chatMode === 'individual' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChatMode('individual')}
              className="flex-1 text-xs"
            >
              <User size={14} className="mr-1" />
              Individual
            </Button>
            <Button
              variant={chatMode === 'group' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setChatMode('group')}
              className="flex-1 text-xs"
            >
              <Users size={14} className="mr-1" />
              Group
            </Button>
          </div>

          {chatMode === 'individual' ? (
            <div>
              <div className="text-xs text-slate-400 mb-2">Chat with:</div>
              <Select value={selectedIndividualFriend} onValueChange={setSelectedIndividualFriend}>
                <SelectTrigger className="w-full h-8 bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Select a friend" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {friends.map(friend => (
                    <SelectItem key={friend.handle} value={friend.handle} className="text-white">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${friend.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                        {friend.handle} ({friend.rating})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-slate-400">Group chats:</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateGroup(!showCreateGroup)}
                  className="h-6 px-2 text-xs"
                >
                  <Plus size={12} className="mr-1" />
                  Create
                </Button>
              </div>
              
              {showCreateGroup && (
                <div className="mb-3 p-2 bg-slate-800/50 rounded border border-slate-600">
                  <Input
                    placeholder="Group name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="h-7 mb-2 bg-slate-800 border-slate-600 text-white text-xs"
                  />
                  <div className="text-xs text-slate-400 mb-1">Select members:</div>
                  <div className="max-h-20 overflow-y-auto">
                    {friends.map(friend => (
                      <div key={friend.handle} className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={selectedGroupMembers.includes(friend.handle)}
                          onChange={() => toggleGroupMember(friend.handle)}
                          className="w-3 h-3"
                        />
                        <span className="text-xs text-slate-300">{friend.handle}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={createGroupChat}
                      className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                    >
                      Create
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCreateGroup(false)}
                      className="h-6 px-2 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              <Select value={selectedGroupChat} onValueChange={setSelectedGroupChat}>
                <SelectTrigger className="w-full h-8 bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {groupChats.map(group => (
                    <SelectItem key={group.id} value={group.id} className="text-white">
                      {group.name} ({group.members.length} members)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Main Content - Now with proper flex layout */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-b border-slate-700 flex-shrink-0">
            <TabsTrigger value="chat" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
              Chat
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
              Notes
            </TabsTrigger>
            <TabsTrigger value="submissions" className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-700">
              Recent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col m-0 min-h-0 overflow-hidden">
            {/* Messages - Now properly sized */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-3">
                <div className="space-y-3">
                  {getFilteredMessages().map((message) => (
                    <div key={message.id} className={`${message.id === 'pinned' ? 'bg-blue-500/10 border border-blue-500/30 rounded-lg p-3' : ''}`}>
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-medium ${message.author === 'System' ? 'text-blue-400' : message.author === 'You' ? 'text-green-400' : 'text-purple-400'}`}>
                              {message.author}
                            </span>
                            {message.recipient && (
                              <span className="text-xs text-slate-500">→ {message.recipient}</span>
                            )}
                            <span className="text-xs text-slate-500">{formatTime(message.timestamp)}</span>
                            {message.id === 'pinned' && (
                              <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-300">
                                Pinned
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-slate-200 break-words">
                            {message.isCode ? 
                              formatCodeContent(message.content) : 
                              message.content.split('\n').map((line, idx) => (
                                <div key={idx}>{line}</div>
                              ))
                            }
                          </div>
                          {message.tags.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {message.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        {message.id !== 'pinned' && (
                          <div className="flex gap-1 flex-shrink-0">
                            {!message.isSaved && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowTagInput(message.id)}
                                className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-slate-700"
                              >
                                <Save size={12} />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => resolveMessage(message.id)}
                              className="h-6 w-6 p-0 text-slate-400 hover:text-green-400 hover:bg-slate-700"
                            >
                              <Check size={12} />
                            </Button>
                          </div>
                        )}
                      </div>
                      {showTagInput === message.id && (
                        <div className="mt-2 flex gap-2">
                          <Input
                            placeholder="Enter tags (comma-separated)"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            className="h-7 text-xs bg-slate-800 border-slate-600 text-white"
                          />
                          <Button
                            size="sm"
                            onClick={() => saveMessage(message.id, tagInput.split(',').map(t => t.trim()).filter(Boolean))}
                            className="h-7 px-2 bg-blue-600 hover:bg-blue-700"
                          >
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="flex-1 m-0 flex flex-col min-h-0 overflow-hidden">
            {/* Filter Section */}
            <div className="p-3 border-b border-slate-700 bg-slate-800/30 flex-shrink-0">
              <div className="flex gap-2 items-center">
                <Search size={16} className="text-slate-400" />
                <Input
                  placeholder="Filter by tags..."
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="flex-1 h-8 bg-slate-800 border-slate-600 text-white text-xs"
                />
                {tagFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTagFilter('')}
                    className="h-8 px-2 text-slate-400 hover:text-white"
                  >
                    <X size={14} />
                  </Button>
                )}
              </div>
              {getAllTags().length > 0 && (
                <div className="flex gap-1 flex-wrap mt-2">
                  {getAllTags().map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs border-slate-600 text-slate-400 cursor-pointer hover:bg-slate-700"
                      onClick={() => setTagFilter(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-3">
                <div className="space-y-3">
                  {getFilteredNotes().map((message) => (
                    <Card key={message.id} className="bg-slate-800/50 border-slate-700">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm text-slate-200">{message.author}</CardTitle>
                          <span className="text-xs text-slate-500">{formatTime(message.timestamp)}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="text-sm text-slate-300 mb-2 break-words">
                          {message.isCode ? formatCodeContent(message.content) : message.content}
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {message.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs border-slate-600 text-slate-400">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="flex-1 m-0 min-h-0 overflow-hidden">
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-3">
                <div className="space-y-3">
                  {recentSubmissions.map((submission) => (
                    <Card key={submission.id} className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                              {submission.handle}
                            </Badge>
                            <span className="text-xs text-slate-500">{formatTime(submission.timestamp)}</span>
                          </div>
                          <Trophy size={14} className="text-yellow-500" />
                        </div>
                        <div className="text-sm text-slate-200 mb-1 break-words">{submission.problemName}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Rating: {submission.problemRating}</span>
                          <span className={`text-xs font-medium ${getVerdictColor(submission.verdict)}`}>
                            {submission.verdict}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>

        {/* Input - Fixed at bottom */}
        {currentUserHandle && (
          <div className="p-3 border-t border-slate-700 bg-slate-800/50 flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCodeMode(!isCodeMode)}
                className={`h-7 px-2 text-xs ${isCodeMode ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Code size={14} className="mr-1" />
                Code
              </Button>
              {((chatMode === 'individual' && !selectedIndividualFriend) || (chatMode === 'group' && !selectedGroupChat)) && (
                <span className="text-xs text-red-400">
                  Select a {chatMode === 'individual' ? 'friend' : 'group'} first
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {isCodeMode ? (
                <textarea
                  placeholder="Enter code..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                  className="flex-1 bg-slate-800 border-slate-600 text-white font-mono text-sm p-2 rounded resize-none min-h-[80px]"
                  style={{ tabSize: 4 }}
                />
              ) : (
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="bg-slate-800 border-slate-600 text-white"
                />
              )}
              <Button 
                onClick={sendMessage} 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={
                  (chatMode === 'individual' && !selectedIndividualFriend) ||
                  (chatMode === 'group' && !selectedGroupChat)
                }
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtensionSidebar;
