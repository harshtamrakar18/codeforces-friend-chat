
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CodeforcesInputProps {
  codeforcesHandle: string;
  setCodeforcesHandle: (handle: string) => void;
  onSubmit: () => void;
}

export const CodeforcesInput: React.FC<CodeforcesInputProps> = ({
  codeforcesHandle,
  setCodeforcesHandle,
  onSubmit
}) => {
  return (
    <div className="p-3 border-b border-slate-700 bg-slate-800/30 flex-shrink-0">
      <div className="text-xs text-slate-400 mb-2">Enter your Codeforces handle:</div>
      <div className="flex gap-2">
        <Input
          placeholder="Handle (e.g., tourist)"
          value={codeforcesHandle}
          onChange={(e) => setCodeforcesHandle(e.target.value)}
          className="h-8 bg-slate-800 border-slate-600 text-white text-xs"
          onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
        />
        <Button
          size="sm"
          onClick={onSubmit}
          className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-xs"
        >
          Connect
        </Button>
      </div>
    </div>
  );
};
