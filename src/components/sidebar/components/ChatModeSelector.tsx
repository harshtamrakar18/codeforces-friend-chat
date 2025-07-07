
import React from 'react';
import { User, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Friend, GroupChat } from '../types';

interface ChatModeSelectorProps {
  chatMode: 'individual' | 'group';
  setChatMode: (mode: 'individual' | 'group') => void;
  friends: Friend[];
  selectedIndividualFriend: string;
  setSelectedIndividualFriend: (friend: string) => void;
  groupChats: GroupChat[];
  selectedGroupChat: string;
  setSelectedGroupChat: (group: string) => void;
  showCreateGroup: boolean;
  setShowCreateGroup: (show: boolean) => void;
  newGroupName: string;
  setNewGroupName: (name: string) => void;
  selectedGroupMembers: string[];
  toggleGroupMember: (handle: string) => void;
  createGroupChat: () => void;
}

export const ChatModeSelector: React.FC<ChatModeSelectorProps> = ({
  chatMode,
  setChatMode,
  friends,
  selectedIndividualFriend,
  setSelectedIndividualFriend,
  groupChats,
  selectedGroupChat,
  setSelectedGroupChat,
  showCreateGroup,
  setShowCreateGroup,
  newGroupName,
  setNewGroupName,
  selectedGroupMembers,
  toggleGroupMember,
  createGroupChat
}) => {
  return (
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
  );
};
