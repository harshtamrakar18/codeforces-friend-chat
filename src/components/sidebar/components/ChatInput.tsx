
import React from 'react';
import { Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  currentUserHandle: string;
  chatMode: 'individual' | 'group';
  selectedIndividualFriend: string;
  selectedGroupChat: string;
  isCodeMode: boolean;
  setIsCodeMode: (mode: boolean) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessage: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  currentUserHandle,
  chatMode,
  selectedIndividualFriend,
  selectedGroupChat,
  isCodeMode,
  setIsCodeMode,
  newMessage,
  setNewMessage,
  sendMessage
}) => {
  if (!currentUserHandle) return null;

  return (
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
  );
};
