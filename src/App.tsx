import React, { useState } from 'react';
import { ActiveView } from './types/navigation';
import { Person } from './types/person';
import { GiftIdea, GiftStatus } from './types/gift';
import { INITIAL_PEOPLE } from './data/mockData';
import { AppLayout } from './components/layout/AppLayout';
import { PersonList } from './components/people/PersonList';
import { PersonDetailView } from './components/people/PersonDetailView';
import { PersonFormModal } from './components/people/PersonFormModal';
import { GiftView } from './components/gifts/GiftView';
import { GiftFormModal } from './components/gifts/GiftFormModal';
import { SearchView } from './components/search/SearchView';
import { SettingsView } from './components/settings/SettingsView';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('people');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [people, setPeople] = useState<Person[]>(INITIAL_PEOPLE);

  // Modals state
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [giftRecipientId, setGiftRecipientId] = useState<string | undefined>(undefined);

  // Navigation handlers
  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
    if (view !== 'person-detail') {
      setSelectedPersonId(null);
    }
  };

  const handleSelectPerson = (personId: string) => {
    setSelectedPersonId(personId);
    setActiveView('person-detail');
  };

  const handleBackToPeople = () => {
    setSelectedPersonId(null);
    setActiveView('people');
  };

  // Person CRUD
  const handleOpenAddPerson = () => {
    setEditingPerson(null);
    setIsPersonModalOpen(true);
  };

  const handleOpenEditPerson = (person: Person) => {
    setEditingPerson(person);
    setIsPersonModalOpen(true);
  };

  const handleSavePerson = (personData: Partial<Person>) => {
    const timestamp = new Date().toISOString();

    if (editingPerson) {
      setPeople((prev) =>
        prev.map((p) =>
          p.id === editingPerson.id
            ? {
                ...p,
                ...personData,
                updatedAt: timestamp,
              } as Person
            : p
        )
      );
    } else {
      const newPerson: Person = {
        id: `p-${Date.now()}`,
        name: personData.name || 'Untitled',
        relationship: personData.relationship,
        birthday: personData.birthday,
        avatarColor: '#DCE5DB',
        details: personData.details || { customFields: [] },
        preferences: personData.preferences || {
          colors: [],
          brands: [],
          scents: [],
          hobbies: [],
          likes: [],
          dislikes: [],
        },
        food: personData.food || {
          allergies: [],
          intolerances: [],
          dietaryRestrictions: [],
          favoriteFoods: [],
          dislikedFoods: [],
        },
        gifts: personData.gifts || [],
        notes: personData.notes || [],
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      setPeople((prev) => [newPerson, ...prev]);
    }
  };

  const handleDeletePerson = (personId: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== personId));
    if (selectedPersonId === personId) {
      setSelectedPersonId(null);
      setActiveView('people');
    }
  };

  // Gift handlers
  const handleOpenAddGift = (personId?: string) => {
    setGiftRecipientId(personId || selectedPersonId || people[0]?.id);
    setIsGiftModalOpen(true);
  };

  const handleSaveGift = (giftData: Omit<GiftIdea, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = new Date().toISOString();
    const newGift: GiftIdea = {
      ...giftData,
      id: `g-${Date.now()}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setPeople((prev) =>
      prev.map((p) => {
        if (p.id === giftData.personId) {
          return {
            ...p,
            gifts: [newGift, ...p.gifts],
            updatedAt: timestamp,
          };
        }
        return p;
      })
    );
  };

  const handleUpdateGiftStatus = (giftId: string, newStatus: GiftStatus) => {
    const timestamp = new Date().toISOString();
    setPeople((prev) =>
      prev.map((p) => ({
        ...p,
        gifts: p.gifts.map((g) =>
          g.id === giftId ? { ...g, status: newStatus, updatedAt: timestamp } : g
        ),
      }))
    );
  };

  // Note handler
  const handleAddNote = (personId: string, noteContent: string) => {
    const timestamp = new Date().toISOString();
    setPeople((prev) =>
      prev.map((p) => {
        if (p.id === personId) {
          return {
            ...p,
            notes: [
              {
                id: `n-${Date.now()}`,
                content: noteContent,
                createdAt: timestamp,
              },
              ...p.notes,
            ],
            updatedAt: timestamp,
          };
        }
        return p;
      })
    );
  };

  // Export & Erase data
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(people, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `little-details-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClearAllData = () => {
    setPeople([]);
    setSelectedPersonId(null);
    setActiveView('people');
  };

  // Counts
  const totalGiftsCount = people.reduce((acc, p) => acc + p.gifts.length, 0);
  const selectedPerson = people.find((p) => p.id === selectedPersonId);

  return (
    <AppLayout
      activeView={activeView}
      onNavigate={handleNavigate}
      peopleCount={people.length}
      giftsCount={totalGiftsCount}
      onQuickAdd={handleOpenAddPerson}
    >
      {/* View routing */}
      {activeView === 'people' && (
        <PersonList
          people={people}
          onSelectPerson={handleSelectPerson}
          onAddPerson={handleOpenAddPerson}
        />
      )}

      {activeView === 'person-detail' && selectedPerson && (
        <PersonDetailView
          person={selectedPerson}
          onBack={handleBackToPeople}
          onEditPerson={handleOpenEditPerson}
          onDeletePerson={handleDeletePerson}
          onAddGift={handleOpenAddGift}
          onAddNote={handleAddNote}
          onUpdateGiftStatus={handleUpdateGiftStatus}
        />
      )}

      {activeView === 'gifts' && (
        <GiftView
          people={people}
          onAddGift={() => handleOpenAddGift()}
          onSelectPerson={handleSelectPerson}
          onUpdateGiftStatus={handleUpdateGiftStatus}
        />
      )}

      {activeView === 'search' && (
        <SearchView
          people={people}
          onSelectPerson={handleSelectPerson}
        />
      )}

      {activeView === 'settings' && (
        <SettingsView
          onClearAllData={handleClearAllData}
          onExportData={handleExportData}
        />
      )}

      {/* Modals */}
      <PersonFormModal
        isOpen={isPersonModalOpen}
        onClose={() => setIsPersonModalOpen(false)}
        onSave={handleSavePerson}
        initialPerson={editingPerson}
      />

      <GiftFormModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        onSave={handleSaveGift}
        people={people}
        defaultPersonId={giftRecipientId}
      />
    </AppLayout>
  );
};

export default App;
