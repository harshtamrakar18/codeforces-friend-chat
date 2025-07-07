
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebarState } from './sidebar/hooks/useSidebarState';
import { useCodeforces } from './sidebar/hooks/useCodeforces';
import { SidebarHeader } from './sidebar/components/SidebarHeader';
import { CodeforcesInput } from './sidebar/components/CodeforcesInput';
import { ChatModeSelector } from './sidebar/components/ChatModeSelector';
import { ChatInput } from './sidebar/components/ChatInput';
import { ChatTab } from './sidebar/components/ChatTab';
import { NotesTab } from './sidebar/components/NotesTab';
import { SubmissionsTab } from './sidebar/components/SubmissionsTab';
import { Message } from './sidebar/types';

const ExtensionSidebar = () => {
  const sidebarState = useSidebarState();
  const { fetchCodeforcesData } = useCodeforces();

  const handleCodeforcesSubmit = () => {
    if (sidebarState.codeforcesHandle.trim()) {
      fetchCodeforcesData(
        sidebarState.codeforcesHandle.trim(),
        sidebarState.setFriends,
        sidebarState.setCurrentUserHandle
      );
    }
  };

  const createGroupChat = () => {
    if (sidebarState.newGroupName.trim() && sidebarState.selectedGroupMembers.length > 0) {
      const newGroup = {
        id: Date.now().toString(),
        name: sidebarState.newGroupName,
        members: [...sidebarState.selectedGroupMembers, sidebarState.currentUserHandle],
        createdBy: sidebarState.currentUserHandle
      };
      sidebarState.setGroupChats(prev => [...prev, newGroup]);
      sidebarState.setNewGroupName('');
      sidebarState.setSelectedGroupMembers([]);
      sidebarState.setShowCreateGroup(false);
    }
  };

  const toggleGroupMember = (handle: string) => {
    sidebarState.setSelectedGroupMembers(prev => 
      prev.includes(handle) 
        ? prev.filter(h => h !== handle)
        : [...prev, handle]
    );
  };

  const sendMessage = () => {
    if (!sidebarState.newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      author: 'You',
      content: sidebarState.newMessage,
      timestamp: new Date(),
      isCode: sidebarState.isCodeMode,
      isSaved: false,
      tags: [],
      isResolved: false,
      recipient: sidebarState.chatMode === 'individual' ? sidebarState.selectedIndividualFriend : undefined,
      groupId: sidebarState.chatMode === 'group' ? sidebarState.selectedGroupChat : undefined
    };

    sidebarState.setMessages(prev => [...prev, message]);
    sidebarState.setNewMessage('');
  };

  const saveMessage = (messageId: string, tags: string[]) => {
    sidebarState.setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? { ...msg, isSaved: true, tags }
          : msg
      )
    );
    sidebarState.setShowTagInput(null);
    sidebarState.setTagInput('');
  };

  const resolveMessage = (messageId: string) => {
    sidebarState.setMessages(prev => prev.filter(msg => msg.id !== messageId));
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
    if (sidebarState.chatMode === 'individual') {
      return sidebarState.messages.filter(msg => 
        (msg.recipient === sidebarState.selectedIndividualFriend && msg.author === 'You') ||
        (msg.author === sidebarState.selectedIndividualFriend) ||
        msg.id === 'pinned'
      );
    } else {
      return sidebarState.messages.filter(msg => 
        msg.groupId === sidebarState.selectedGroupChat || msg.id === 'pinned'
      );
    }
  };

  const getFilteredNotes = () => {
    const savedMessages = sidebarState.messages.filter(m => m.isSaved);
    if (!sidebarState.tagFilter) return savedMessages;
    
    return savedMessages.filter(msg => 
      msg.tags.some(tag => tag.toLowerCase().includes(sidebarState.tagFilter.toLowerCase()))
    );
  };

  const getAllTags = () => {
    const allTags = sidebarState.messages.flatMap(msg => msg.tags);
    return [...new Set(allTags)];
  };

  if (!sidebarState.isExpanded) {
    return (
      <div className="fixed right-0 top-0 h-full w-12 bg-gradient-to-b from-slate-900 to-slate-800 border-l border-slate-700 flex flex-col items-center py-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => sidebarState.setIsExpanded(true)}
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <MessageSquare size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col">
      <SidebarHeader onCollapse={() => sidebarState.setIsExpanded(false)} />

      {!sidebarState.currentUserHandle && (
        <CodeforcesInput
          codeforcesHandle={sidebarState.codeforcesHandle}
          setCodeforcesHandle={sidebarState.setCodeforcesHandle}
          onSubmit={handleCodeforcesSubmit}
        />
      )}

      {sidebarState.currentUserHandle && (
        <ChatModeSelector
          chatMode={sidebarState.chatMode}
          setChatMode={sidebarState.setChatMode}
          friends={sidebarState.friends}
          selectedIndividualFriend={sidebarState.selectedIndividualFriend}
          setSelectedIndividualFriend={sidebarState.setSelectedIndividualFriend}
          groupChats={sidebarState.groupChats}
          selectedGroupChat={sidebarState.selectedGroupChat}
          setSelectedGroupChat={sidebarState.setSelectedGroupChat}
          showCreateGroup={sidebarState.showCreateGroup}
          setShowCreateGroup={sidebarState.setShowCreateGroup}
          newGroupName={sidebarState.newGroupName}
          setNewGroupName={sidebarState.setNewGroupName}
          selectedGroupMembers={sidebarState.selectedGroupMembers}
          toggleGroupMember={toggleGroupMember}
          createGroupChat={createGroupChat}
        />
      )}

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
            <ChatTab
              messages={getFilteredMessages()}
              showTagInput={sidebarState.showTagInput}
              setShowTagInput={sidebarState.setShowTagInput}
              tagInput={sidebarState.tagInput}
              setTagInput={sidebarState.setTagInput}
              saveMessage={saveMessage}
              resolveMessage={resolveMessage}
              formatTime={formatTime}
              formatCodeContent={formatCodeContent}
            />
          </TabsContent>

          <TabsContent value="notes" className="flex-1 m-0 flex flex-col min-h-0 overflow-hidden">
            <NotesTab
              tagFilter={sidebarState.tagFilter}
              setTagFilter={sidebarState.setTagFilter}
              filteredNotes={getFilteredNotes()}
              allTags={getAllTags()}
              formatTime={formatTime}
              formatCodeContent={formatCodeContent}
            />
          </TabsContent>

          <TabsContent value="submissions" className="flex-1 m-0 min-h-0 overflow-hidden">
            <SubmissionsTab
              submissions={sidebarState.recentSubmissions}
              formatTime={formatTime}
              getVerdictColor={getVerdictColor}
            />
          </TabsContent>
        </Tabs>

        <ChatInput
          currentUserHandle={sidebarState.currentUserHandle}
          chatMode={sidebarState.chatMode}
          selectedIndividualFriend={sidebarState.selectedIndividualFriend}
          selectedGroupChat={sidebarState.selectedGroupChat}
          isCodeMode={sidebarState.isCodeMode}
          setIsCodeMode={sidebarState.setIsCodeMode}
          newMessage={sidebarState.newMessage}
          setNewMessage={sidebarState.setNewMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default ExtensionSidebar;
