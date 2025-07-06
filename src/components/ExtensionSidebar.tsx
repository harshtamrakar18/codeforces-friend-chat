import React, { useState, useEffect } from 'react';
import { MessageSquare, Code, Save, Check, X, Hash, Clock, Trophy, Users, User, Search } from 'lucide-react';
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
  recipient?: string; // for individual messages
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

const ExtensionSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState<string | null>(null);
  const [selectedFriends, setSelectedFriends] = useState<string[]>(['tourist', 'jiangly']);
  const [chatMode, setChatMode] = useState<'group' | 'individual'>('group');
  const [selectedIndividualFriend, setSelectedIndividualFriend] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string>('');

  // Mock data
  const friends: Friend[] = [
    { handle: 'tourist', name: 'Gennady', rating: 3900, isOnline: true },
    { handle: 'jiangly', name: 'Jiang Ly', rating: 3800, isOnline: true },
    { handle: 'benq', name: 'Benjamin Qi', rating: 3600, isOnline: false },
    { handle: 'ecnerwala', name: 'Eric Chen', rating: 3500, isOnline: true },
  ];

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
    // Initialize with pinned message
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
      recipient: chatMode === 'individual' ? selectedIndividualFriend : undefined
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
    if (chatMode === 'group') {
      return messages.filter(msg => !msg.recipient);
    } else {
      return messages.filter(msg => 
        msg.recipient === selectedIndividualFriend || 
        (msg.author !== 'You' && msg.author === selectedIndividualFriend) ||
        msg.id === 'pinned'
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

      {/* Chat Mode Selection */}
      <div className="p-3 border-b border-slate-700 bg-slate-800/30 flex-shrink-0">
        <div className="flex gap-2 mb-3">
          <Button
            variant={chatMode === 'group' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChatMode('group')}
            className="flex-1 text-xs"
          >
            <Users size={14} className="mr-1" />
            Group
          </Button>
          <Button
            variant={chatMode === 'individual' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChatMode('individual')}
            className="flex-1 text-xs"
          >
            <User size={14} className="mr-1" />
            Individual
          </Button>
        </div>

        {chatMode === 'group' ? (
          <div>
            <div className="text-xs text-slate-400 mb-2">Group chat with:</div>
            <div className="flex gap-1 flex-wrap">
              {selectedFriends.map(handle => {
                const friend = friends.find(f => f.handle === handle);
                return (
                  <Badge key={handle} variant="secondary" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                    <div className={`w-2 h-2 rounded-full mr-1 ${friend?.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                    {handle}
                  </Badge>
                );
              })}
            </div>
          </div>
        ) : (
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
                      {friend.handle}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

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

        <TabsContent value="chat" className="flex-1 flex flex-col m-0 min-h-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-3">
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

          {/* Input */}
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
              {chatMode === 'individual' && !selectedIndividualFriend && (
                <span className="text-xs text-red-400">Select a friend first</span>
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
                disabled={chatMode === 'individual' && !selectedIndividualFriend}
              >
                Send
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="flex-1 m-0 flex flex-col min-h-0">
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

          <ScrollArea className="flex-1 p-3">
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
        </TabsContent>

        <TabsContent value="submissions" className="flex-1 m-0 min-h-0">
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3">
              {recentSubmissions.map((submission) => (
                <Card key={submission.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          {submission.handle}
                        </Badge>
                        <span className="text-xs text-slate-500">{formatTime(message.timestamp)}</span>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExtensionSidebar;
