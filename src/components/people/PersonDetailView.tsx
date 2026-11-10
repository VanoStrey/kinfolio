import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Gift as GiftIcon,
  Plus,
  AlertTriangle,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Archive,
  Lightbulb,
} from 'lucide-react';
import { Person, UpdatePersonInput } from '../../types/person';
import { PersonProfileTab } from '../../types/navigation';
import { GiftIdea, GiftStatus } from '../../types/gift';
import { Note } from '../../types/note';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { TagManager } from '../common/TagManager';
import { CustomFieldsEditor } from './CustomFieldsEditor';
import { NoteEditorModal } from './NoteEditorModal';

interface PersonDetailViewProps {
  person: Person;
  gifts: GiftIdea[];
  notes: Note[];
  onBack: () => void;
  onEditPerson: (person: Person) => void;
  onDeletePerson: (personId: string) => void;
  onUpdatePerson: (input: UpdatePersonInput) => Promise<Person>;
  onAddGift: (personId: string) => void;
  onEditGift: (gift: GiftIdea) => void;
  onDeleteGift: (giftId: string) => void;
  onUpdateGiftStatus: (giftId: string, status: GiftStatus) => void;
  onAddNote: (content: string, category?: string) => Promise<Note>;
  onUpdateNote: (noteId: string, content: string, category?: string) => Promise<Note>;
  onDeleteNote: (noteId: string) => void;
}

export const PersonDetailView: React.FC<PersonDetailViewProps> = ({
  person,
  gifts,
  notes,
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
  const [activeTab, setActiveTab] = useState<PersonProfileTab>('details');

  // Quick note inline capture state
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingQuickNote, setIsAddingQuickNote] = useState(false);

  // Note editing modal
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Sizes editing mode
  const [isEditingSizes, setIsEditingSizes] = useState(false);
  const [clothingSize, setClothingSize] = useState(person.details.clothingSize || '');
  const [shoeSize, setShoeSize] = useState(person.details.shoeSize || '');
  const [ringSize, setRingSize] = useState(person.details.ringSize || '');
  const [height, setHeight] = useState(person.details.height || '');

  // Food note state
  const [foodNote, setFoodNote] = useState(person.food.notes || '');
  const [isEditingFoodNote, setIsEditingFoodNote] = useState(false);

  const initials = person.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const formattedUpdated = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(person.updatedAt));

  const hasAllergies = person.food.allergies && person.food.allergies.length > 0;

  const tabs: { id: PersonProfileTab; label: string; count?: number }[] = [
    { id: 'details', label: 'Details' },
    { id: 'preferences', label: 'Preferences' },
    {
      id: 'food',
      label: 'Food',
      count: hasAllergies ? person.food.allergies.length : undefined,
    },
    { id: 'gifts', label: 'Gifts', count: gifts.length },
    { id: 'notes', label: 'Notes', count: notes.length },
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

  const getStatusBadge = (status: GiftStatus) => {
    switch (status) {
      case 'idea':
        return (
          <Badge size="sm" variant="default">
            <Lightbulb className="w-3 h-3 mr-1 text-secondary" /> Idea
          </Badge>
        );
      case 'bought':
        return (
          <Badge size="sm" variant="accent">
            <Clock className="w-3 h-3 mr-1 text-accent-dark" /> Bought
          </Badge>
        );
      case 'given':
        return (
          <Badge size="sm" variant="success">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-700" /> Given
          </Badge>
        );
      case 'archived':
        return (
          <Badge size="sm" variant="default">
            <Archive className="w-3 h-3 mr-1 text-muted" /> Archived
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back button & Action controls */}
      <div className="flex items-center justify-between pb-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-secondary hover:text-primary transition-colors py-1 px-2 -ml-2 rounded-md hover:bg-canvas"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to People</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEditPerson(person)}
            icon={<Edit3 className="w-3.5 h-3.5" />}
          >
            Edit Profile
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-status-danger-text hover:bg-red-50"
            onClick={() => {
              if (window.confirm(`Are you sure you want to move ${person.name} to trash?`)) {
                onDeletePerson(person.id);
              }
            }}
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Person Header Card */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent text-accent-dark flex items-center justify-center font-medium text-lg border border-accent/80 shrink-0 shadow-subtle">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold tracking-tight text-primary">
                  {person.name}
                </h1>
                {person.relationship && (
                  <Badge size="sm" variant="default">
                    {person.relationship}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-1.5 text-xs text-secondary">
                {person.birthday && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-secondary/80" />
                    <span>{person.birthday}</span>
                  </div>
                )}
                <span>Updated {formattedUpdated}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <Button
              size="sm"
              variant="accent"
              onClick={() => onAddGift(person.id)}
              icon={<GiftIcon className="w-3.5 h-3.5" />}
            >
              Add Gift Idea
            </Button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-1 mt-8 border-b border-border overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap -mb-px ${
                  isActive
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-secondary hover:text-primary hover:border-border-strong'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      tab.id === 'food' && hasAllergies
                        ? 'bg-red-100 text-red-700 font-bold'
                        : isActive
                        ? 'bg-primary/10 text-primary'
                        : 'bg-canvas text-secondary'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="min-h-[380px]">
        {/* DETAILS TAB */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Standard Sizes Grid */}
            <div className="bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider">
                  Body Measurements & Standard Sizes
                </h3>
                {!isEditingSizes ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setClothingSize(person.details.clothingSize || '');
                      setShoeSize(person.details.shoeSize || '');
                      setRingSize(person.details.ringSize || '');
                      setHeight(person.details.height || '');
                      setIsEditingSizes(true);
                    }}
                    icon={<Edit3 className="w-3 h-3" />}
                  >
                    Edit Sizes
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingSizes(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleSaveSizes}
                    >
                      Save Sizes
                    </Button>
                  </div>
                )}
              </div>

              {!isEditingSizes ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-canvas border border-border-subtle rounded-lg p-3.5">
                    <span className="text-[11px] text-secondary font-medium block">Clothing</span>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      {person.details.clothingSize || '—'}
                    </p>
                  </div>
                  <div className="bg-canvas border border-border-subtle rounded-lg p-3.5">
                    <span className="text-[11px] text-secondary font-medium block">Shoe</span>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      {person.details.shoeSize || '—'}
                    </p>
                  </div>
                  <div className="bg-canvas border border-border-subtle rounded-lg p-3.5">
                    <span className="text-[11px] text-secondary font-medium block">Ring</span>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      {person.details.ringSize || '—'}
                    </p>
                  </div>
                  <div className="bg-canvas border border-border-subtle rounded-lg p-3.5">
                    <span className="text-[11px] text-secondary font-medium block">Height</span>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      {person.details.height || '—'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-secondary font-medium block mb-1">Clothing Size</label>
                    <input
                      type="text"
                      value={clothingSize}
                      onChange={(e) => setClothingSize(e.target.value)}
                      placeholder="e.g. S / EU 36"
                      className="w-full bg-canvas border border-border rounded-md px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-primary/60"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-secondary font-medium block mb-1">Shoe Size</label>
                    <input
                      type="text"
                      value={shoeSize}
                      onChange={(e) => setShoeSize(e.target.value)}
                      placeholder="e.g. EU 38"
                      className="w-full bg-canvas border border-border rounded-md px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-primary/60"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-secondary font-medium block mb-1">Ring Size</label>
                    <input
                      type="text"
                      value={ringSize}
                      onChange={(e) => setRingSize(e.target.value)}
                      placeholder="e.g. 16.5 mm"
                      className="w-full bg-canvas border border-border rounded-md px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-primary/60"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-secondary font-medium block mb-1">Height</label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g. 172 cm"
                      className="w-full bg-canvas border border-border rounded-md px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-primary/60"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Custom Measurements & Fields Editor */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TagManager
              title="Scents & Fragrances"
              hint="Perfumes, candles, colognes, or home aromas"
              tags={person.preferences.scents || []}
              placeholder="e.g. Diptyque Fleur de Peau"
              onChange={(scents) => onUpdatePerson({ preferences: { ...person.preferences, scents } })}
            />

            <TagManager
              title="Favorite Brands"
              hint="Fashion, lifestyle, or homeware brands"
              tags={person.preferences.brands || []}
              placeholder="e.g. Aesop, COS, Arket"
              onChange={(brands) => onUpdatePerson({ preferences: { ...person.preferences, brands } })}
            />

            <TagManager
              title="Favorite Colors"
              hint="Tones and color palettes they wear or decorate with"
              tags={person.preferences.colors || []}
              placeholder="e.g. Sage Green, Oatmeal"
              onChange={(colors) => onUpdatePerson({ preferences: { ...person.preferences, colors } })}
            />

            <TagManager
              title="Hobbies & Passions"
              hint="Activities, sports, crafts, and interests"
              tags={person.preferences.hobbies || []}
              placeholder="e.g. 35mm photography, ceramics"
              onChange={(hobbies) => onUpdatePerson({ preferences: { ...person.preferences, hobbies } })}
            />

            <TagManager
              title="Things They Love"
              hint="General likes, styles, and comforts"
              badgeVariant="success"
              tags={person.preferences.likes || []}
              placeholder="e.g. Linen shirts, oat lattes"
              onChange={(likes) => onUpdatePerson({ preferences: { ...person.preferences, likes } })}
            />

            <TagManager
              title="Things to Avoid / Dislikes"
              hint="Materials, cuts, or items they do not enjoy"
              tags={person.preferences.dislikes || []}
              placeholder="e.g. Synthetic fabrics, neon colors"
              onChange={(dislikes) => onUpdatePerson({ preferences: { ...person.preferences, dislikes } })}
            />
          </div>
        )}

        {/* FOOD TAB — Strict Medical & Preference Distinction */}
        {activeTab === 'food' && (
          <div className="space-y-5">
            {/* Medical Allergies (Top Priority Safety Banner) */}
            <div className="bg-red-50/50 border border-red-200 rounded-xl p-5 shadow-subtle space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-700" />
                <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider">
                  Medical Allergies (High Priority)
                </h3>
              </div>
              <p className="text-[11px] text-red-800 leading-relaxed">
                Critical medical allergies. Always distinguish from preferences to prevent anaphylaxis and contamination.
              </p>

              <TagManager
                title="Active Medical Allergies"
                isAllergy={true}
                tags={person.food.allergies || []}
                placeholder="e.g. Peanuts (Anaphylaxis risk)"
                onChange={(allergies) => onUpdatePerson({ food: { ...person.food, allergies } })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TagManager
                title="Intolerances & Sensitivities"
                hint="e.g. Lactose, mild gluten sensitivity"
                badgeVariant="warning"
                tags={person.food.intolerances || []}
                placeholder="e.g. Lactose"
                onChange={(intolerances) => onUpdatePerson({ food: { ...person.food, intolerances } })}
              />

              <TagManager
                title="Dietary Restrictions"
                hint="Ethical or lifestyle diets (e.g. Vegetarian, Halal)"
                tags={person.food.dietaryRestrictions || []}
                placeholder="e.g. Pescatarian"
                onChange={(dietaryRestrictions) => onUpdatePerson({ food: { ...person.food, dietaryRestrictions } })}
              />

              <TagManager
                title="Favorite Foods & Dishes"
                badgeVariant="success"
                tags={person.food.favoriteFoods || []}
                placeholder="e.g. Truffle risotto, Shakshuka"
                onChange={(favoriteFoods) => onUpdatePerson({ food: { ...person.food, favoriteFoods } })}
              />

              <TagManager
                title="Disliked Foods"
                hint="Personal distaste or ingredients they avoid"
                tags={person.food.dislikedFoods || []}
                placeholder="e.g. Cilantro, Blue cheese"
                onChange={(dislikedFoods) => onUpdatePerson({ food: { ...person.food, dislikedFoods } })}
              />
            </div>

            {/* Dining / Kitchen Advice Note */}
            <div className="bg-surface border border-border rounded-xl p-5 shadow-subtle space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <div>
                  <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider">
                    Kitchen & Dining Advice Note
                  </h3>
                  <p className="text-[11px] text-muted mt-0.5">
                    Tips for cooking for them, restaurant ordering, or coffee preferences.
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
                    icon={<Edit3 className="w-3 h-3" />}
                  >
                    Edit Note
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingFoodNote(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleSaveFoodNote}
                    >
                      Save Note
                    </Button>
                  </div>
                )}
              </div>

              {!isEditingFoodNote ? (
                <p className="text-xs text-primary leading-relaxed whitespace-pre-wrap">
                  {person.food.notes || <span className="text-muted italic">No kitchen notes added yet.</span>}
                </p>
              ) : (
                <textarea
                  value={foodNote}
                  onChange={(e) => setFoodNote(e.target.value)}
                  placeholder="e.g. Always check with restaurant staff regarding peanut oil..."
                  rows={3}
                  className="w-full bg-canvas border border-border rounded-md p-3 text-xs text-primary placeholder:text-muted focus:outline-none focus:border-primary/60"
                />
              )}
            </div>
          </div>
        )}

        {/* GIFTS TAB */}
        {activeTab === 'gifts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs text-secondary">
                {gifts.length} {gifts.length === 1 ? 'gift idea' : 'gift ideas'} recorded
              </span>
              <Button
                size="sm"
                variant="primary"
                onClick={() => onAddGift(person.id)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Gift Idea
              </Button>
            </div>

            {gifts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gifts.map((gift) => (
                  <div
                    key={gift.id}
                    className="bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-primary">{gift.title}</h4>
                        {getStatusBadge(gift.status)}
                      </div>

                      {/* Optional Gift Image */}
                      {gift.imageUrl && (
                        <div className="mt-3 rounded-lg overflow-hidden border border-border-subtle bg-canvas max-h-40 flex items-center justify-center">
                          <img
                            src={gift.imageUrl}
                            alt={gift.title}
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      )}

                      {gift.description && (
                        <p className="text-xs text-secondary mt-2.5 leading-relaxed">
                          {gift.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs">
                        {gift.price !== undefined && (
                          <span className="font-semibold text-primary bg-canvas px-2 py-0.5 rounded border border-border-subtle">
                            {gift.currency || '€'}{gift.price}
                          </span>
                        )}
                        {gift.occasion && (
                          <span className="text-secondary bg-canvas px-2 py-0.5 rounded border border-border-subtle">
                            {gift.occasion}
                          </span>
                        )}
                        {gift.url && (
                          <a
                            href={gift.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            <span>Store link</span>
                            <ExternalLink className="w-3 h-3 text-secondary" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Status Changer & Actions */}
                    <div className="mt-4 pt-3 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        {(['idea', 'bought', 'given', 'archived'] as GiftStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => onUpdateGiftStatus(gift.id, st)}
                            className={`text-[10px] px-2 py-0.5 rounded capitalize transition-colors ${
                              gift.status === st
                                ? 'bg-primary text-white font-medium'
                                : 'text-secondary hover:text-primary hover:bg-canvas'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          onClick={() => onEditGift(gift)}
                          className="text-secondary hover:text-primary p-1 rounded hover:bg-canvas"
                          title="Edit gift"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${gift.title}"?`)) {
                              onDeleteGift(gift.id);
                            }
                          }}
                          className="text-secondary hover:text-red-600 p-1 rounded hover:bg-canvas"
                          title="Delete gift"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-surface/50 rounded-xl border border-dashed border-border p-6">
                <GiftIcon className="w-6 h-6 text-secondary mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium text-primary">No gift ideas yet for {person.name}</p>
                <p className="text-[11px] text-secondary mt-0.5 mb-4">
                  Save wishlist items, links, photos, and ideas for upcoming celebrations.
                </p>
                <Button size="sm" variant="secondary" onClick={() => onAddGift(person.id)}>
                  Add First Gift
                </Button>
              </div>
            )}
          </div>
        )}

        {/* NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs text-secondary">
                Free-form observations, memories, and personal notes ({notes.length})
              </span>
              {!isAddingQuickNote && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsAddingQuickNote(true)}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Note
                </Button>
              )}
            </div>

            {/* Inline fast capture note box */}
            {isAddingQuickNote && (
              <form
                onSubmit={handleCreateQuickNote}
                className="bg-surface border border-border-strong rounded-xl p-4 shadow-subtle space-y-3"
              >
                <label className="text-xs font-semibold text-primary block">New Note</label>
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Record an observation, story, book recommendation, or detail..."
                  rows={3}
                  autoFocus
                  className="w-full bg-canvas border border-border text-xs rounded-md p-3 text-primary placeholder:text-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20"
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
                    Cancel
                  </Button>
                  <Button size="sm" variant="primary" type="submit" disabled={!newNoteText.trim()}>
                    Save Note
                  </Button>
                </div>
              </form>
            )}

            {notes.length > 0 ? (
              <div className="space-y-3">
                {notes.map((note) => {
                  const noteDate = new Intl.DateTimeFormat('en', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }).format(new Date(note.createdAt));

                  return (
                    <div
                      key={note.id}
                      className="bg-surface border border-border rounded-xl p-5 shadow-subtle text-xs flex flex-col justify-between"
                    >
                      <div>
                        {note.category && (
                          <span className="inline-block text-[10px] uppercase font-semibold text-secondary tracking-wider mb-2 bg-canvas px-2 py-0.5 rounded border border-border-subtle">
                            {note.category}
                          </span>
                        )}
                        <p className="text-primary leading-relaxed whitespace-pre-wrap">{note.content}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-[11px] text-muted">
                        <span>Recorded on {noteDate}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingNote(note)}
                            className="p-1 text-secondary hover:text-primary rounded hover:bg-canvas"
                            title="Edit note"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this note?')) {
                                onDeleteNote(note.id);
                              }
                            }}
                            className="p-1 text-secondary hover:text-red-600 rounded hover:bg-canvas"
                            title="Delete note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              !isAddingQuickNote && (
                <div className="text-center py-12 bg-surface/50 rounded-xl border border-dashed border-border p-6">
                  <p className="text-xs font-medium text-primary">No notes yet</p>
                  <p className="text-[11px] text-secondary mt-0.5 mb-4">
                    Write down memories, things they mentioned wanting to try, or small observations.
                  </p>
                  <Button size="sm" variant="secondary" onClick={() => setIsAddingQuickNote(true)}>
                    Add First Note
                  </Button>
                </div>
              )
            )}
          </div>
        )}
      </div>

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
