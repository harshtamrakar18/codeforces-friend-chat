
import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarHeaderProps {
  onCollapse: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onCollapse }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800/50 flex-shrink-0">
      <div className="flex items-center gap-2">
        <MessageSquare size={20} className="text-blue-400" />
        <h2 className="font-semibold text-white">Codeforces Chat</h2>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCollapse}
        className="text-slate-400 hover:text-white hover:bg-slate-700"
      >
        <X size={16} />
      </Button>
    </div>
  );
};
