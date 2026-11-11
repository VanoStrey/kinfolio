import React, { useState } from 'react';
import { ActiveView, PersonProfileTab } from './types/navigation';
import { Person, CreatePersonInput, UpdatePersonInput } from './types/person';
import { GiftIdea, CreateGiftInput, UpdateGiftInput } from './types/gift';
import { usePeople } from './hooks/usePeople';
import { useGifts, GiftWithRecipient } from './hooks/useGifts';
import { usePersonDetails } from './hooks/usePersonDetails';
import { ToastProvider } from './hooks/useToast';
import { LanguageProvider } from './i18n/LanguageContext';
import { AppLayout } from './components/layout/AppLayout';
import { PersonList } from './components/people/PersonList';
import { PersonDetailView } from './components/people/PersonDetailView';
import { PersonFormModal } from './components/people/PersonFormModal';
import { GiftView } from './components/gifts/GiftView';
import { GiftFormModal } from './components/gifts/GiftFormModal';
import { SearchView } from './components/search/SearchView';
import { SettingsView } from './components/settings/SettingsView';

const MainApp: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('people');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedPersonInitialTab, setSelectedPersonInitialTab] = useState<PersonProfileTab>('details');

  // People hook
  const {
    people,
    deletedPeople,
    createPerson,
    updatePerson,
    deletePerson,
    restorePerson,
    reloadDemoData,
    refresh: refreshPeople,
  } = usePeople();

  // Gifts hook (for global gifts view)
  const {
    gifts: globalGifts,
    addGift: addGlobalGift,
    updateGift: updateGlobalGift,
    updateGiftStatus: updateGlobalGiftStatus,
    deleteGift: deleteGlobalGift,
    refresh: refreshGifts,
  } = useGifts();

  // Person Details hook (for individual person profile)
  const {
    person: selectedPerson,
    gifts: personGifts,
    notes: personNotes,
    updatePerson: updateSelectedPerson,
    addGift: addPersonGift,
    updateGift: updatePersonGift,
    updateGiftStatus: updatePersonGiftStatus,
    deleteGift: deletePersonGift,
    addNote: addPersonNote,
    updateNote: updatePersonNote,
    deleteNote: deletePersonNote,
    refresh: refreshPersonDetails,
  } = usePersonDetails(selectedPersonId);

  // Modals state
  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<GiftIdea | null>(null);
  const [giftRecipientId, setGiftRecipientId] = useState<string | undefined>(undefined);

  // Navigation handlers
  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
    if (view !== 'person-detail') {
      setSelectedPersonId(null);
    }
  };

  const handleSelectPerson = (personId: string, initialTab?: PersonProfileTab) => {
    setSelectedPersonId(personId);
    setSelectedPersonInitialTab(initialTab || 'details');
    setActiveView('person-detail');
  };

  const handleBackToPeople = () => {
    setSelectedPersonId(null);
    setActiveView('people');
    refreshPeople();
    refreshGifts();
  };

  // Person CRUD triggers
  const handleOpenAddPerson = () => {
    setEditingPerson(null);
    setIsPersonModalOpen(true);
  };

  const handleOpenEditPerson = (personToEdit: Person) => {
    setEditingPerson(personToEdit);
    setIsPersonModalOpen(true);
  };

  const handleSavePerson = async (personData: CreatePersonInput | UpdatePersonInput) => {
    if (editingPerson) {
      await updatePerson(editingPerson.id, personData);
      if (selectedPersonId === editingPerson.id) {
        await refreshPersonDetails();
      }
    } else {
      const created = await createPerson(personData as CreatePersonInput);
      handleSelectPerson(created.id);
    }
    await refreshGifts();
  };

  const handleDeletePerson = async (personId: string) => {
    await deletePerson(personId, true);
    if (selectedPersonId === personId) {
      handleBackToPeople();
    } else {
      await refreshGifts();
    }
  };

  // Gift CRUD triggers
  const handleOpenAddGift = (personId?: string) => {
    setEditingGift(null);
    setGiftRecipientId(personId || selectedPersonId || people[0]?.id);
    setIsGiftModalOpen(true);
  };

  const handleOpenEditGift = (giftToEdit: GiftIdea) => {
    setEditingGift(giftToEdit);
    setGiftRecipientId(giftToEdit.personId);
    setIsGiftModalOpen(true);
  };

  const handleSaveGift = async (giftData: CreateGiftInput | UpdateGiftInput) => {
    if (editingGift) {
      if (selectedPersonId) {
        await updatePersonGift(editingGift.id, giftData as UpdateGiftInput);
      } else {
        await updateGlobalGift(editingGift.id, giftData as UpdateGiftInput);
      }
    } else {
      const createInput = giftData as CreateGiftInput;
      if (selectedPersonId && createInput.personId === selectedPersonId) {
        await addPersonGift(createInput);
      } else {
        await addGlobalGift(createInput);
      }
    }
    await refreshGifts();
    if (selectedPersonId) {
      await refreshPersonDetails();
    }
  };

  const handleDeleteGift = async (giftId: string) => {
    if (selectedPersonId) {
      await deletePersonGift(giftId);
    } else {
      await deleteGlobalGift(giftId);
    }
    await refreshGifts();
  };

  const handleUpdateGiftStatus = async (giftId: string, newStatus: any) => {
    if (selectedPersonId) {
      await updatePersonGiftStatus(giftId, newStatus);
    } else {
      await updateGlobalGiftStatus(giftId, newStatus);
    }
    await refreshGifts();
  };

  const handleDataReset = async () => {
    setSelectedPersonId(null);
    setActiveView('people');
    await refreshPeople();
    await refreshGifts();
  };

  // Calculate gift counts per person
  const giftCountsMap: Record<string, number> = {};
  globalGifts.forEach((g) => {
    giftCountsMap[g.personId] = (giftCountsMap[g.personId] || 0) + 1;
  });

  return (
    <AppLayout
      activeView={activeView}
      onNavigate={handleNavigate}
      peopleCount={people.length}
      giftsCount={globalGifts.length}
      onQuickAdd={activeView === 'gifts' ? () => handleOpenAddGift() : handleOpenAddPerson}
    >
      {/* People View */}
      {activeView === 'people' && (
        <PersonList
          people={people}
          deletedPeople={deletedPeople}
          giftCounts={giftCountsMap}
          onSelectPerson={handleSelectPerson}
          onAddPerson={handleOpenAddPerson}
          onRestorePerson={restorePerson}
          onLoadDemoData={reloadDemoData}
        />
      )}

      {/* Person Detail View */}
      {activeView === 'person-detail' && selectedPerson && (
        <PersonDetailView
          person={selectedPerson}
          gifts={personGifts}
          notes={personNotes}
          initialTab={selectedPersonInitialTab}
          onBack={handleBackToPeople}
          onEditPerson={handleOpenEditPerson}
          onDeletePerson={handleDeletePerson}
          onUpdatePerson={async (input) => {
            const res = await updateSelectedPerson(input);
            await refreshPeople();
            return res;
          }}
          onAddGift={handleOpenAddGift}
          onEditGift={handleOpenEditGift}
          onDeleteGift={handleDeleteGift}
          onUpdateGiftStatus={handleUpdateGiftStatus}
          onAddNote={addPersonNote}
          onUpdateNote={updatePersonNote}
          onDeleteNote={deletePersonNote}
        />
      )}

      {/* Gifts View */}
      {activeView === 'gifts' && (
        <GiftView
          gifts={globalGifts}
          people={people}
          onAddGift={() => handleOpenAddGift()}
          onEditGift={(gift: GiftWithRecipient) => handleOpenEditGift(gift)}
          onDeleteGift={handleDeleteGift}
          onSelectPerson={handleSelectPerson}
          onUpdateGiftStatus={handleUpdateGiftStatus}
        />
      )}

      {/* Search View */}
      {activeView === 'search' && (
        <SearchView
          onSelectPerson={handleSelectPerson}
        />
      )}

      {/* Settings View */}
      {activeView === 'settings' && (
        <SettingsView
          onDataReset={handleDataReset}
          onLoadDemoData={reloadDemoData}
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
        initialGift={editingGift}
      />
    </AppLayout>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </LanguageProvider>
  );
};

export default App;
