
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '../types';

interface NotesTabProps {
  tagFilter: string;
  setTagFilter: (filter: string) => void;
  filteredNotes: Message[];
  allTags: string[];
  formatTime: (date: Date) => string;
  formatCodeContent: (content: string) => React.ReactNode;
}

export const NotesTab: React.FC<NotesTabProps> = ({
  tagFilter,
  setTagFilter,
  filteredNotes,
  allTags,
  formatTime,
  formatCodeContent
}) => {
  return (
    <>
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
        {allTags.length > 0 && (
          <div className="flex gap-1 flex-wrap mt-2">
            {allTags.map(tag => (
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
            {filteredNotes.map((message) => (
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
    </>
  );
};
