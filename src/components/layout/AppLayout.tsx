import React from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { ContentContainer } from './ContentContainer';
import { ActiveView } from '../../types/navigation';

interface AppLayoutProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  peopleCount: number;
  giftsCount: number;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeView,
  onNavigate,
  peopleCount,
  giftsCount,
  children,
}) => {
  return (
    <div className="min-h-screen bg-canvas text-primary flex flex-col md:flex-row antialiased">
      {/* Desktop & Tablet Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar
          activeView={activeView}
          onNavigate={onNavigate}
          peopleCount={peopleCount}
          giftsCount={giftsCount}
        />
      </div>

      {/* Mobile Top Header */}
      <Header activeView={activeView} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-24 md:pb-10">
        <ContentContainer>
          {children}
        </ContentContainer>
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
