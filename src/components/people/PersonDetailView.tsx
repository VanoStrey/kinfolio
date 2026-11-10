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
import { Person } from '../../types/person';
import { PersonProfileTab } from '../../types/navigation';
import { GiftStatus } from '../../types/gift';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface PersonDetailViewProps {
  person: Person;
  onBack: () => void;
  onEditPerson: (person: Person) => void;
  onDeletePerson: (personId: string) => void;
  onAddGift: (personId: string) => void;
  onAddNote: (personId: string, noteContent: string) => void;
  onUpdateGiftStatus?: (giftId: string, newStatus: GiftStatus) => void;
}

export const PersonDetailView: React.FC<PersonDetailViewProps> = ({
  person,
  onBack,
  onEditPerson,
  onDeletePerson,
  onAddGift,
  onAddNote,
  onUpdateGiftStatus,
}) => {
  const [activeTab, setActiveTab] = useState<PersonProfileTab>('details');
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

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

  const tabs: { id: PersonProfileTab; label: string; count?: number }[] = [
    { id: 'details', label: 'Details' },
    { id: 'preferences', label: 'Preferences' },
    {
      id: 'food',
      label: 'Food',
      count: person.food.allergies.length > 0 ? person.food.allergies.length : undefined,
    },
    { id: 'gifts', label: 'Gifts', count: person.gifts.length },
    { id: 'notes', label: 'Notes', count: person.notes.length },
  ];

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(person.id, newNoteText.trim());
    setNewNoteText('');
    setIsAddingNote(false);
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
            Edit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-status-danger-text hover:bg-red-50"
            onClick={() => {
              if (window.confirm(`Are you sure you want to remove ${person.name}?`)) {
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
                      tab.id === 'food' && person.food.allergies.length > 0
                        ? 'bg-red-100 text-red-700'
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
      <div className="min-h-[360px]">
        {/* DETAILS TAB */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface border border-border rounded-lg p-4">
                <span className="text-xs text-secondary font-medium block">Clothing Size</span>
                <p className="text-base font-semibold text-primary mt-1">
                  {person.details.clothingSize || '—'}
                </p>
              </div>

              <div className="bg-surface border border-border rounded-lg p-4">
                <span className="text-xs text-secondary font-medium block">Shoe Size</span>
                <p className="text-base font-semibold text-primary mt-1">
                  {person.details.shoeSize || '—'}
                </p>
              </div>

              <div className="bg-surface border border-border rounded-lg p-4">
                <span className="text-xs text-secondary font-medium block">Ring Size</span>
                <p className="text-base font-semibold text-primary mt-1">
                  {person.details.ringSize || '—'}
                </p>
              </div>

              <div className="bg-surface border border-border rounded-lg p-4">
                <span className="text-xs text-secondary font-medium block">Height</span>
                <p className="text-base font-semibold text-primary mt-1">
                  {person.details.height || '—'}
                </p>
              </div>
            </div>

            {/* Custom Fields */}
            {person.details.customFields && person.details.customFields.length > 0 && (
              <div className="bg-surface border border-border rounded-xl p-5">
                <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
                  Additional Measurements & Custom Fields
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {person.details.customFields.map((field) => (
                    <div key={field.id} className="bg-canvas border border-border-subtle rounded-md p-3">
                      <span className="text-[11px] text-secondary font-medium block">{field.label}</span>
                      <p className="text-xs font-medium text-primary mt-0.5">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PREFERENCES TAB */}
        {activeTab === 'preferences' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scents / Fragrances */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
                Scents & Fragrances
              </h3>
              {person.preferences.scents.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {person.preferences.scents.map((scent, i) => (
                    <span
                      key={i}
                      className="text-xs bg-canvas text-primary px-3 py-1.5 rounded-md border border-border-subtle font-medium"
                    >
                      {scent}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted">No scents or perfumes recorded.</p>
              )}
            </div>

            {/* Brands */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
                Favorite Brands
              </h3>
              {person.preferences.brands.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {person.preferences.brands.map((brand, i) => (
                    <span
                      key={i}
                      className="text-xs bg-canvas text-primary px-3 py-1.5 rounded-md border border-border-subtle font-medium"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted">No brands recorded.</p>
              )}
            </div>

            {/* Colors */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
                Favorite Colors
              </h3>
              {person.preferences.colors.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {person.preferences.colors.map((color, i) => (
                    <span
                      key={i}
                      className="text-xs bg-canvas text-primary px-3 py-1.5 rounded-md border border-border-subtle font-medium"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted">No colors recorded.</p>
              )}
            </div>

            {/* Hobbies */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
                Hobbies & Passions
              </h3>
              {person.preferences.hobbies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {person.preferences.hobbies.map((hobby, i) => (
                    <span
                      key={i}
                      className="text-xs bg-canvas text-primary px-3 py-1.5 rounded-md border border-border-subtle font-medium"
                    >
                      {hobby}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted">No hobbies recorded.</p>
              )}
            </div>

            {/* Likes */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <h3 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-3">
                Things They Love
              </h3>
              {person.preferences.likes.length > 0 ? (
                <ul className="space-y-1.5">
                  {person.preferences.likes.map((like, i) => (
                    <li key={i} className="text-xs text-primary flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{like}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted">None specified.</p>
              )}
            </div>

            {/* Dislikes */}
            <div className="bg-surface border border-border rounded-xl p-5">
              <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">
                Things to Avoid / Dislikes
              </h3>
              {person.preferences.dislikes.length > 0 ? (
                <ul className="space-y-1.5">
                  {person.preferences.dislikes.map((dislike, i) => (
                    <li key={i} className="text-xs text-secondary flex items-start gap-2">
                      <span className="text-muted font-bold">•</span>
                      <span>{dislike}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted">None specified.</p>
              )}
            </div>
          </div>
        )}

        {/* FOOD TAB — Strict Medical & Preference Distinction */}
        {activeTab === 'food' && (
          <div className="space-y-4">
            {/* Allergies Warning Card */}
            <div className={`p-5 rounded-xl border ${
              person.food.allergies.length > 0
                ? 'bg-red-50/50 border-red-200'
                : 'bg-surface border-border'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`w-4 h-4 ${person.food.allergies.length > 0 ? 'text-red-700' : 'text-secondary'}`} />
                <h3 className={`text-xs font-bold uppercase tracking-wider ${
                  person.food.allergies.length > 0 ? 'text-red-800' : 'text-secondary'
                }`}>
                  Medical Allergies (High Priority)
                </h3>
              </div>
              {person.food.allergies.length > 0 ? (
                <div className="space-y-1.5 mt-2">
                  {person.food.allergies.map((allergy, i) => (
                    <div key={i} className="text-xs font-semibold text-red-900 bg-white/80 border border-red-200 px-3 py-2 rounded-md">
                      ⚠️ {allergy}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-secondary">No known medical allergies.</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Intolerances */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <h3 className="text-xs font-semibold text-amber-900 uppercase tracking-wider mb-2">
                  Food Intolerances & Sensitivities
                </h3>
                {person.food.intolerances.length > 0 ? (
                  <div className="space-y-1.5">
                    {person.food.intolerances.map((item, i) => (
                      <span
                        key={i}
                        className="inline-block text-xs bg-amber-50 text-amber-950 border border-amber-200/70 px-2.5 py-1 rounded mr-2 mb-1 font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted">No intolerances recorded.</p>
                )}
              </div>

              {/* Dietary Restrictions */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                  Dietary Restrictions (Lifestyle / Ethical)
                </h3>
                {person.food.dietaryRestrictions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {person.food.dietaryRestrictions.map((item, i) => (
                      <span
                        key={i}
                        className="text-xs bg-canvas text-primary border border-border-subtle px-2.5 py-1 rounded font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted">No dietary restrictions.</p>
                )}
              </div>

              {/* Favorite Foods */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <h3 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
                  Favorite Foods & Dishes
                </h3>
                {person.food.favoriteFoods.length > 0 ? (
                  <ul className="space-y-1">
                    {person.food.favoriteFoods.map((item, i) => (
                      <li key={i} className="text-xs text-primary flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted">No favorite dishes listed.</p>
                )}
              </div>

              {/* Disliked Foods */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                  Disliked Foods
                </h3>
                {person.food.dislikedFoods.length > 0 ? (
                  <ul className="space-y-1">
                    {person.food.dislikedFoods.map((item, i) => (
                      <li key={i} className="text-xs text-secondary flex items-start gap-2">
                        <span className="text-muted font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted">No disliked foods listed.</p>
                )}
              </div>
            </div>

            {/* Additional Food Notes */}
            {person.food.notes && (
              <div className="bg-surface border border-border rounded-xl p-4 text-xs text-secondary">
                <span className="font-semibold text-primary block mb-1">Kitchen & Dining Note:</span>
                {person.food.notes}
              </div>
            )}
          </div>
        )}

        {/* GIFTS TAB */}
        {activeTab === 'gifts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs text-secondary">
                {person.gifts.length} {person.gifts.length === 1 ? 'gift idea' : 'gift ideas'} recorded
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

            {person.gifts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {person.gifts.map((gift) => (
                  <div
                    key={gift.id}
                    className="bg-surface border border-border rounded-xl p-5 shadow-subtle flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-primary">{gift.title}</h4>
                        {getStatusBadge(gift.status)}
                      </div>

                      {gift.description && (
                        <p className="text-xs text-secondary mt-2 leading-relaxed">
                          {gift.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
                        {gift.price !== undefined && (
                          <span className="font-semibold text-primary bg-canvas px-2 py-0.5 rounded border border-border-subtle">
                            {gift.currency || '$'}{gift.price}
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

                    {/* Quick Status Changer */}
                    {onUpdateGiftStatus && (
                      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-secondary">
                        <span>Status:</span>
                        <div className="flex items-center gap-1">
                          {(['idea', 'bought', 'given', 'archived'] as GiftStatus[]).map((st) => (
                            <button
                              key={st}
                              onClick={() => onUpdateGiftStatus(gift.id, st)}
                              className={`text-[11px] px-2 py-0.5 rounded capitalize transition-colors ${
                                gift.status === st
                                  ? 'bg-primary text-white font-medium'
                                  : 'text-secondary hover:text-primary hover:bg-canvas'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-surface/50 rounded-xl border border-dashed border-border p-6">
                <GiftIcon className="w-6 h-6 text-secondary mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium text-primary">No gift ideas yet for {person.name}</p>
                <p className="text-[11px] text-secondary mt-0.5 mb-4">
                  Save wishlist items, links, and ideas for upcoming celebrations.
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
                Free-form observations, memories, and personal notes
              </span>
              {!isAddingNote && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsAddingNote(true)}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Note
                </Button>
              )}
            </div>

            {/* Inline fast capture note box */}
            {isAddingNote && (
              <form
                onSubmit={handleCreateNote}
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
                      setIsAddingNote(false);
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

            {person.notes.length > 0 ? (
              <div className="space-y-3">
                {person.notes.map((note) => {
                  const noteDate = new Intl.DateTimeFormat('en', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }).format(new Date(note.createdAt));

                  return (
                    <div
                      key={note.id}
                      className="bg-surface border border-border rounded-xl p-5 shadow-subtle text-xs"
                    >
                      <p className="text-primary leading-relaxed whitespace-pre-wrap">{note.content}</p>
                      <span className="text-[10px] text-muted block mt-3 pt-2 border-t border-border-subtle">
                        Recorded on {noteDate}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              !isAddingNote && (
                <div className="text-center py-12 bg-surface/50 rounded-xl border border-dashed border-border p-6">
                  <p className="text-xs font-medium text-primary">No notes yet</p>
                  <p className="text-[11px] text-secondary mt-0.5 mb-4">
                    Write down memories, things they mentioned wanting to try, or small observations.
                  </p>
                  <Button size="sm" variant="secondary" onClick={() => setIsAddingNote(true)}>
                    Add First Note
                  </Button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
