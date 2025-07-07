
import React from 'react';
import { Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Submission } from '../types';

interface SubmissionsTabProps {
  submissions: Submission[];
  formatTime: (date: Date) => string;
  getVerdictColor: (verdict: string) => string;
}

export const SubmissionsTab: React.FC<SubmissionsTabProps> = ({
  submissions,
  formatTime,
  getVerdictColor
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full p-3">
        <div className="space-y-3">
          {submissions.map((submission) => (
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
  );
};
