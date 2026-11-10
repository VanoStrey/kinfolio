import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { ActiveView } from '../../types/navigation';

interface AppLayoutProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  peopleCount: number;
  giftsCount: number;
  onQuickAdd?: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeView,
  onNavigate,
  peopleCount,
  giftsCount,
  onQuickAdd,
  children,
}) => {
  return (
    <div className="min-h-screen bg-canvas text-primary flex flex-col md:flex-row antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          activeView={activeView}
          onNavigate={onNavigate}
          peopleCount={peopleCount}
          giftsCount={giftsCount}
        />
      </div>

      {/* Mobile Top Header */}
      <Header
        activeView={activeView}
        onQuickAdd={onQuickAdd}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-20 md:pb-8">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeView={activeView}
        onNavigate={onNavigate}
        peopleCount={peopleCount}
        giftsCount={giftsCount}
      />
    </div>
  );
};
