import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Gift as GiftIcon,
  Plus,
  AlertTriangle,
  Edit3,
  Trash2,
} from 'lucide-react';
import { Person, UpdatePersonInput } from '../../types/person';
import { PersonProfileTab } from '../../types/navigation';
import { GiftIdea, GiftStatus } from '../../types/gift';
import { Note } from '../../types/note';
import { Button } from '../common/Button';
import { IconButton } from '../common/IconButton';
import { Badge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { TagManager } from '../common/TagManager';
import { PersonAvatar } from './PersonAvatar';
import { DetailGroup, DetailItem } from './DetailGroup';
import { FoodCategory } from './FoodCategory';
import { CustomFieldsEditor } from './CustomFieldsEditor';
import { NoteEditorModal } from './NoteEditorModal';
import { GiftCard } from '../gifts/GiftCard';
import { useTranslation } from '../../i18n/LanguageContext';
import { formatShortDate, selectPluralForm } from '../../i18n/helpers';

interface PersonDetailViewProps {
  person: Person;
  gifts: GiftIdea[];
  notes: Note[];
  initialTab?: PersonProfileTab;
  onBack: () => void;
  onEditPerson: (person: Person) => void;
  onDeletePerson: (personId: string) => Promise<void> | void;
  onUpdatePerson: (input: UpdatePersonInput) => Promise<Person>;
  onAddGift: (personId: string) => void;
  onEditGift: (gift: GiftIdea) => void;
  onDeleteGift: (giftId: string) => Promise<void> | void;
  onUpdateGiftStatus: (giftId: string, status: GiftStatus) => void;
  onAddNote: (content: string, category?: string) => Promise<Note>;
  onUpdateNote: (noteId: string, content: string, category?: string) => Promise<Note>;
  onDeleteNote: (noteId: string) => Promise<void> | void;
}

export const PersonDetailView: React.FC<PersonDetailViewProps> = ({
  person,
  gifts,
  notes,
  initialTab = 'details',
  onBack,
  onEditPerson,
  onDeletePerson,
  onUpdatePerson,
  onAddGift,
  onEditGift,
  onDeleteGift,
  onUpdateGiftStatus,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<PersonProfileTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, person.id]);

  // Quick note inline capture state
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingQuickNote, setIsAddingQuickNote] = useState(false);

  // Modals & confirmation dialogs
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [giftToDelete, setGiftToDelete] = useState<GiftIdea | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Sizes editing mode
  const [isEditingSizes, setIsEditingSizes] = useState(false);
  const [clothingSize, setClothingSize] = useState(person.details.clothingSize || '');
  const [shoeSize, setShoeSize] = useState(person.details.shoeSize || '');
  const [ringSize, setRingSize] = useState(person.details.ringSize || '');
  const [height, setHeight] = useState(person.details.height || '');

  // Food note state
  const [foodNote, setFoodNote] = useState(person.food.notes || '');
  const [isEditingFoodNote, setIsEditingFoodNote] = useState(false);

  const formattedUpdated = formatShortDate(person.updatedAt, language, true);
  const hasAllergies = person.food.allergies && person.food.allergies.length > 0;

  const tabs: { id: PersonProfileTab; label: string; count?: number; isAlert?: boolean }[] = [
    { id: 'details', label: t('personDetail.tabDetails') },
    { id: 'preferences', label: t('personDetail.tabPreferences') },
    {
      id: 'food',
      label: t('personDetail.tabFood'),
      count: hasAllergies ? person.food.allergies.length : undefined,
      isAlert: hasAllergies,
    },
    { id: 'gifts', label: t('personDetail.tabGifts'), count: gifts.length },
    { id: 'notes', label: t('personDetail.tabNotes'), count: notes.length },
  ];

  const handleSaveSizes = async () => {
    await onUpdatePerson({
      details: {
        ...person.details,
        clothingSize: clothingSize.trim() || undefined,
        shoeSize: shoeSize.trim() || undefined,
        ringSize: ringSize.trim() || undefined,
        height: height.trim() || undefined,
      },
    });
    setIsEditingSizes(false);
  };

  const handleSaveFoodNote = async () => {
    await onUpdatePerson({
      food: {
        ...person.food,
        notes: foodNote.trim() || undefined,
      },
    });
    setIsEditingFoodNote(false);
  };

  const handleCreateQuickNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    await onAddNote(newNoteText.trim());
    setNewNoteText('');
    setIsAddingQuickNote(false);
  };

  const personGiftsCountText = selectPluralForm(gifts.length, language, {
    singular: t('gifts.personGiftsSingular', { count: gifts.length }),
    few: t('gifts.personGiftsFew', { count: gifts.length }),
    many: t('gifts.personGiftsMany', { count: gifts.length }),
  });

  return (
    <div className="space-y-7 pb-10">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[14px] font-medium text-secondary hover:text-primary transition-colors py-1.5 px-2.5 -ml-2.5 rounded-md hover:bg-surface-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700/40"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('personDetail.backToPeople')}</span>
        </button>
      </div>

      {/* Person Profile Header */}
      <header className="bg-surface border border-border rounded-xl p-6 sm:p-7 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div className="flex items-start gap-4 sm:gap-5 min-w-0">
            <PersonAvatar name={person.name} photoUrl={person.photoUrl} size="xl" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-[26px] sm:text-[32px] font-semibold tracking-[-0.02em] leading-[1.2] text-primary">
                  {person.name}
                </h1>
                {person.relationship && (
                  <Badge size="md" variant="accent">
                    {person.relationship}
                  </Badge>
                )}
              </div>

              {person.bio && (
                <p className="text-[14.5px] text-secondary mt-2 leading-[1.55] max-w-2xl">
                  {person.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-[13px] text-secondary">
                {person.birthday && (
                  <div className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-green-700" />
                    <span>{person.birthday}</span>
                  </div>
                )}
                <span className="text-muted">
                  {t('personDetail.updatedOn', { date: formattedUpdated })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start">
            <Button
              size="md"
              variant="secondary"
              onClick={() => onEditPerson(person)}
              icon={<Edit3 className="w-4 h-4" />}
            >
              {t('personDetail.editProfile')}
            </Button>
            <Button
              size="md"
              variant="soft"
              onClick={() => onAddGift(person.id)}
              icon={<GiftIcon className="w-4 h-4" />}
            >
              {t('personDetail.addGiftIdea')}
            </Button>
          </div>
        </div>

        {/* Profile Tabs */}
        <nav
          aria-label="Profile sections"
          className="flex items-center gap-1.5 mt-7 pt-4 border-t border-border overflow-x-auto no-scrollbar"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13.5px] transition-[background-color,color] duration-[180ms] whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700/40 ${
                  isActive
                    ? 'bg-surface-green text-green-900 font-semibold'
                    : 'text-secondary font-medium hover:text-primary hover:bg-surface-soft'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[11px] font-semibold px-1.5 py-0.2 rounded-full ${
                      tab.isAlert
                        ? 'bg-[#FAF0EF] text-danger'
                        : isActive
                        ? 'bg-surface text-green-900'
                        : 'bg-surface-soft text-secondary'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Tab Contents */}
      <div className="min-h-[360px]">
        {/* DETAILS TAB — Compact hairline-divided groups */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {isEditingSizes ? (
              <section className="bg-surface border border-border rounded-lg p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-[12px] font-semibold text-secondary uppercase tracking-[0.06em]">
                    {t('personDetail.sizesHeading')}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingSizes(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button size="sm" variant="primary" onClick={handleSaveSizes}>
                      {t('personDetail.saveSizes')}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[13px] font-medium text-primary block mb-1.5">
                      {t('personDetail.clothingSizeLabel')}
                    </label>
                    <input
                      type="text"
                      value={clothingSize}
                      onChange={(e) => setClothingSize(e.target.value)}
                      placeholder={t('personDetail.clothingPlaceholder')}
                      className="w-full h-[42px] bg-surface border border-border rounded-md px-3 text-[14px] text-primary focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-primary block mb-1.5">
                      {t('personDetail.shoeSizeLabel')}
                    </label>
                    <input
                      type="text"
                      value={shoeSize}
                      onChange={(e) => setShoeSize(e.target.value)}
                      placeholder={t('personDetail.shoePlaceholder')}
                      className="w-full h-[42px] bg-surface border border-border rounded-md px-3 text-[14px] text-primary focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-primary block mb-1.5">
                      {t('personDetail.ringSizeLabel')}
                    </label>
                    <input
                      type="text"
                      value={ringSize}
                      onChange={(e) => setRingSize(e.target.value)}
                      placeholder={t('personDetail.ringPlaceholder')}
                      className="w-full h-[42px] bg-surface border border-border rounded-md px-3 text-[14px] text-primary focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-primary block mb-1.5">
                      {t('personDetail.heightLabel')}
                    </label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder={t('personDetail.heightPlaceholder')}
                      className="w-full h-[42px] bg-surface border border-border rounded-md px-3 text-[14px] text-primary focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
                    />
                  </div>
                </div>
              </section>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <DetailGroup
                  title={t('personDetail.clothingShoesGroup')}
                  action={
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setClothingSize(person.details.clothingSize || '');
                        setShoeSize(person.details.shoeSize || '');
                        setRingSize(person.details.ringSize || '');
                        setHeight(person.details.height || '');
                        setIsEditingSizes(true);
                      }}
                      icon={<Edit3 className="w-3.5 h-3.5" />}
                    >
                      {t('personDetail.editSizes')}
                    </Button>
                  }
                >
                  <DetailItem
                    label={t('personDetail.clothingLabel')}
                    value={person.details.clothingSize}
                    emptyText={t('personDetail.notSpecified')}
                  />
                  <DetailItem
                    label={t('personDetail.shoeLabel')}
                    value={person.details.shoeSize}
                    emptyText={t('personDetail.notSpecified')}
                  />
                </DetailGroup>

                <DetailGroup title={t('personDetail.accessoriesMeasureGroup')}>
                  <DetailItem
                    label={t('personDetail.ringLabel')}
                    value={person.details.ringSize}
                    emptyText={t('personDetail.notSpecified')}
                  />
                  <DetailItem
                    label={t('personDetail.heightLabel')}
                    value={person.details.height}
                    emptyText={t('personDetail.notSpecified')}
                  />
                </DetailGroup>
              </div>
            )}

            {/* Custom Measurements & Fields */}
            <CustomFieldsEditor
              fields={person.details.customFields || []}
              onChange={(updatedCustomFields) => {
                onUpdatePerson({
                  details: {
                    ...person.details,
                    customFields: updatedCustomFields,
                  },
                });
              }}
            />
          </div>
        )}

        {/* PREFERENCES TAB */}
        {activeTab === 'preferences' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TagManager
              title={t('preferences.scentsTitle')}
              hint={t('preferences.scentsHint')}
              tags={person.preferences.scents || []}
              placeholder={t('preferences.scentsPlaceholder')}
              onChange={(scents) => onUpdatePerson({ preferences: { ...person.preferences, scents } })}
            />

            <TagManager
              title={t('preferences.brandsTitle')}
              hint={t('preferences.brandsHint')}
              tags={person.preferences.brands || []}
              placeholder={t('preferences.brandsPlaceholder')}
              onChange={(brands) => onUpdatePerson({ preferences: { ...person.preferences, brands } })}
            />

            <TagManager
              title={t('preferences.colorsTitle')}
              hint={t('preferences.colorsHint')}
              tags={person.preferences.colors || []}
              placeholder={t('preferences.colorsPlaceholder')}
              onChange={(colors) => onUpdatePerson({ preferences: { ...person.preferences, colors } })}
            />

            <TagManager
              title={t('preferences.hobbiesTitle')}
              hint={t('preferences.hobbiesHint')}
              tags={person.preferences.hobbies || []}
              placeholder={t('preferences.hobbiesPlaceholder')}
              onChange={(hobbies) => onUpdatePerson({ preferences: { ...person.preferences, hobbies } })}
            />

            <TagManager
              title={t('preferences.likesTitle')}
              hint={t('preferences.likesHint')}
              badgeVariant="success"
              tags={person.preferences.likes || []}
              placeholder={t('preferences.likesPlaceholder')}
              onChange={(likes) => onUpdatePerson({ preferences: { ...person.preferences, likes } })}
            />

            <TagManager
              title={t('preferences.dislikesTitle')}
              hint={t('preferences.dislikesHint')}
              tags={person.preferences.dislikes || []}
              placeholder={t('preferences.dislikesPlaceholder')}
              onChange={(dislikes) => onUpdatePerson({ preferences: { ...person.preferences, dislikes } })}
            />
          </div>
        )}

        {/* FOOD TAB — 4 Strict Categories */}
        {activeTab === 'food' && (
          <div className="space-y-6">
            {/* 1. Medical Allergies (Quiet yet unmistakable) */}
            <div className="bg-[#FAF0EF]/60 border border-danger/35 rounded-lg p-5 space-y-3.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-danger shrink-0" />
                <h3 className="text-[13px] font-semibold text-[#8E4740] uppercase tracking-[0.04em]">
                  {t('food.allergiesBannerTitle')}
                </h3>
              </div>
              <p className="text-[13.5px] text-[#7D4A45] leading-[1.5]">
                {t('food.allergiesBannerDesc')}
              </p>

              <FoodCategory
                title={t('food.allergiesTitle')}
                variant="allergy"
                seamless
                items={person.food.allergies || []}
                placeholder={t('food.allergiesPlaceholder')}
                onChange={(allergies) => onUpdatePerson({ food: { ...person.food, allergies } })}
              />
            </div>

            {/* 2. Intolerances & 3. Dietary Restrictions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FoodCategory
                title={t('food.intolerancesTitle')}
                hint={t('food.intolerancesHint')}
                variant="intolerance"
                items={person.food.intolerances || []}
                placeholder={t('food.intolerancesPlaceholder')}
                onChange={(intolerances) => onUpdatePerson({ food: { ...person.food, intolerances } })}
              />

              <FoodCategory
                title={t('food.dietaryTitle')}
                hint={t('food.dietaryHint')}
                variant="diet"
                items={person.food.dietaryRestrictions || []}
                placeholder={t('food.dietaryPlaceholder')}
                onChange={(dietaryRestrictions) =>
                  onUpdatePerson({ food: { ...person.food, dietaryRestrictions } })
                }
              />

              {/* 4. Likes & Dislikes */}
              <FoodCategory
                title={t('food.favoriteFoodsTitle')}
                variant="favorite"
                items={person.food.favoriteFoods || []}
                placeholder={t('food.favoriteFoodsPlaceholder')}
                onChange={(favoriteFoods) => onUpdatePerson({ food: { ...person.food, favoriteFoods } })}
              />

              <FoodCategory
                title={t('food.dislikedFoodsTitle')}
                hint={t('food.dislikedFoodsHint')}
                variant="disliked"
                items={person.food.dislikedFoods || []}
                placeholder={t('food.dislikedFoodsPlaceholder')}
                onChange={(dislikedFoods) => onUpdatePerson({ food: { ...person.food, dislikedFoods } })}
              />
            </div>

            {/* Dining / Kitchen Advice Note */}
            <div className="bg-surface border border-border rounded-lg p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h3 className="text-[12px] font-semibold text-secondary uppercase tracking-[0.06em]">
                    {t('food.kitchenNoteHeading')}
                  </h3>
                  <p className="text-[13px] text-secondary mt-0.5">
                    {t('food.kitchenNoteSubheading')}
                  </p>
                </div>

                {!isEditingFoodNote ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setFoodNote(person.food.notes || '');
                      setIsEditingFoodNote(true);
                    }}
                    icon={<Edit3 className="w-3.5 h-3.5" />}
                  >
                    {t('food.editNote')}
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingFoodNote(false)}>
                      {t('common.cancel')}
                    </Button>
                    <Button size="sm" variant="primary" onClick={handleSaveFoodNote}>
                      {t('food.saveNote')}
                    </Button>
                  </div>
                )}
              </div>

              {!isEditingFoodNote ? (
                <p className="text-[14.5px] text-primary leading-[1.55] whitespace-pre-wrap pt-1">
                  {person.food.notes || (
                    <span className="text-muted">{t('food.emptyKitchenNote')}</span>
                  )}
                </p>
              ) : (
                <textarea
                  value={foodNote}
                  onChange={(e) => setFoodNote(e.target.value)}
                  placeholder={t('food.kitchenNotePlaceholder')}
                  rows={3}
                  className="w-full bg-surface border border-border rounded-md p-3.5 text-[14px] text-primary leading-[1.55] placeholder:text-muted focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
                />
              )}
            </div>
          </div>
        )}

        {/* GIFTS TAB */}
        {activeTab === 'gifts' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[14px] text-secondary font-medium">
                {personGiftsCountText}
              </span>
              <Button
                size="md"
                variant="primary"
                onClick={() => onAddGift(person.id)}
                icon={<Plus className="w-4 h-4" />}
              >
                {t('gifts.addGiftIdea')}
              </Button>
            </div>

            {gifts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {gifts.map((gift) => (
                  <GiftCard
                    key={gift.id}
                    gift={gift}
                    showImagePlaceholder={false}
                    onEdit={() => onEditGift(gift)}
                    onDelete={() => setGiftToDelete(gift)}
                    onUpdateStatus={(st) => onUpdateGiftStatus(gift.id, st)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-surface-soft/60 rounded-lg border border-border p-6">
                <div className="w-11 h-11 rounded-full bg-surface-green text-green-700 flex items-center justify-center mx-auto mb-3">
                  <GiftIcon className="w-5 h-5" />
                </div>
                <p className="text-[16px] font-semibold text-primary">
                  {t('gifts.noPersonGiftsTitle', { name: person.name })}
                </p>
                <p className="text-[14px] text-secondary mt-1.5 mb-5 max-w-md mx-auto">
                  {t('gifts.noPersonGiftsDesc')}
                </p>
                <Button size="md" variant="secondary" onClick={() => onAddGift(person.id)}>
                  {t('gifts.addFirstGift')}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[14px] text-secondary font-medium">
                {t('notes.sectionInfo', { count: notes.length })}
              </span>
              {!isAddingQuickNote && (
                <Button
                  size="md"
                  variant="primary"
                  onClick={() => setIsAddingQuickNote(true)}
                  icon={<Plus className="w-4 h-4" />}
                >
                  {t('notes.addNote')}
                </Button>
              )}
            </div>

            {isAddingQuickNote && (
              <form
                onSubmit={handleCreateQuickNote}
                className="bg-surface border border-green-300 rounded-lg p-5 shadow-soft space-y-3"
              >
                <label className="text-[13px] font-semibold text-primary block">
                  {t('notes.newNoteLabel')}
                </label>
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder={t('notes.newNotePlaceholder')}
                  rows={3}
                  autoFocus
                  className="w-full bg-surface border border-border text-[14.5px] leading-[1.55] rounded-md p-3.5 text-primary placeholder:text-muted focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/15"
                />
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      setIsAddingQuickNote(false);
                      setNewNoteText('');
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button size="sm" variant="primary" type="submit" disabled={!newNoteText.trim()}>
                    {t('notes.saveNote')}
                  </Button>
                </div>
              </form>
            )}

            {notes.length > 0 ? (
              <div className="space-y-4">
                {notes.map((note) => {
                  const noteDate = formatShortDate(note.createdAt, language, true);
                  const editedDate =
                    note.updatedAt && note.updatedAt !== note.createdAt
                      ? formatShortDate(note.updatedAt, language, true)
                      : null;

                  return (
                    <article
                      key={note.id}
                      className="bg-surface border border-border rounded-lg p-5 sm:p-6 flex flex-col justify-between"
                    >
                      <div>
                        {note.category && (
                          <span className="inline-block text-[11.5px] uppercase font-semibold text-green-900 tracking-[0.04em] mb-2.5 bg-surface-green px-2.5 py-0.5 rounded-sm">
                            {note.category}
                          </span>
                        )}
                        <p className="text-[15px] text-primary leading-[1.6] whitespace-pre-wrap">
                          {note.content}
                        </p>
                      </div>

                      <div className="mt-4 pt-3.5 border-t border-border flex items-center justify-between text-[12px] text-muted">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span>{t('notes.recordedOn', { date: noteDate })}</span>
                          {editedDate && <span>· {t('notes.updatedOn', { date: editedDate })}</span>}
                        </div>
                        <div className="flex items-center gap-1">
                          <IconButton
                            label={t('notes.editNoteTitle')}
                            size="sm"
                            onClick={() => setEditingNote(note)}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </IconButton>
                          <IconButton
                            label={t('notes.deleteNoteTitle')}
                            variant="danger"
                            size="sm"
                            onClick={() => setNoteToDelete(note)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </IconButton>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              !isAddingQuickNote && (
                <div className="text-center py-12 bg-surface-soft/60 rounded-lg border border-border p-6">
                  <p className="text-[16px] font-semibold text-primary">{t('notes.emptyTitle')}</p>
                  <p className="text-[14px] text-secondary mt-1.5 mb-5 max-w-md mx-auto">
                    {t('notes.emptyDesc')}
                  </p>
                  <Button size="md" variant="secondary" onClick={() => setIsAddingQuickNote(true)}>
                    {t('notes.addFirstNote')}
                  </Button>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Delete Card Footer Section */}
      <div className="pt-8 border-t border-border">
        <div className="bg-surface border border-danger/30 rounded-lg p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[14px] font-semibold text-danger">
              {t('personDetail.deleteCardSectionTitle')}
            </h3>
            <p className="text-[13px] text-secondary mt-1 leading-[1.45]">
              {t('personDetail.deleteCardSectionDesc')}
            </p>
          </div>
          <Button
            size="md"
            variant="danger"
            className="shrink-0 self-start sm:self-center"
            onClick={() => setIsDeleteConfirmOpen(true)}
            icon={<Trash2 className="w-4 h-4" />}
          >
            {t('personDetail.deleteCardBtn')}
          </Button>
        </div>
      </div>

      {/* Permanent Card Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        isLoading={isDeleting}
        title={t('personDetail.deleteConfirmTitle')}
        description={t('personDetail.deleteConfirmDesc', { name: person.name })}
        confirmLabel={t('personDetail.confirmDeleteCardBtn')}
        onConfirm={async () => {
          try {
            setIsDeleting(true);
            await onDeletePerson(person.id);
            setIsDeleteConfirmOpen(false);
          } finally {
            setIsDeleting(false);
          }
        }}
      />

      {/* Gift Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!giftToDelete}
        onClose={() => setGiftToDelete(null)}
        title={t('gifts.confirmDeleteGift', { title: giftToDelete?.title || '' })}
        description={t('gifts.confirmDeleteDesc', { title: giftToDelete?.title || '' })}
        onConfirm={async () => {
          if (giftToDelete) {
            await onDeleteGift(giftToDelete.id);
            setGiftToDelete(null);
          }
        }}
      />

      {/* Note Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        title={t('notes.confirmDeleteNote')}
        description={t('notes.confirmDeleteDesc')}
        onConfirm={async () => {
          if (noteToDelete) {
            await onDeleteNote(noteToDelete.id);
            setNoteToDelete(null);
          }
        }}
      />

      {/* Note Editor Modal */}
      <NoteEditorModal
        isOpen={!!editingNote}
        onClose={() => setEditingNote(null)}
        initialNote={editingNote}
        onSave={async (content, category) => {
          if (editingNote) {
            await onUpdateNote(editingNote.id, content, category);
            setEditingNote(null);
          }
        }}
      />
    </div>
  );
};
