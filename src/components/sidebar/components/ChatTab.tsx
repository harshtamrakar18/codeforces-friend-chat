
import React from 'react';
import { Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '../types';

interface ChatTabProps {
  messages: Message[];
  showTagInput: string | null;
  setShowTagInput: (id: string | null) => void;
  tagInput: string;
  setTagInput: (tag: string) => void;
  saveMessage: (messageId: string, tags: string[]) => void;
  resolveMessage: (messageId: string) => void;
  formatTime: (date: Date) => string;
  formatCodeContent: (content: string) => React.ReactNode;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  messages,
  showTagInput,
  setShowTagInput,
  tagInput,
  setTagInput,
  saveMessage,
  resolveMessage,
  formatTime,
  formatCodeContent
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full p-3">
        <div className="space-y-3">
          {messages.map((message) => (
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
  );
};
