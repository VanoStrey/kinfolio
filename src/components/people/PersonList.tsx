import React, { useState, useMemo } from 'react';
import { Search, Plus, SlidersHorizontal, UserPlus, RotateCcw, Trash2 } from 'lucide-react';
import { Person, SortOption } from '../../types/person';
import { PersonCard } from './PersonCard';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { useTranslation } from '../../i18n/LanguageContext';

interface PersonListProps {
  people: Person[];
  deletedPeople?: Person[];
  giftCounts?: Record<string, number>;
  onSelectPerson: (personId: string) => void;
  onAddPerson: () => void;
  onRestorePerson?: (personId: string) => void;
  onLoadDemoData?: () => void;
}

export const PersonList: React.FC<PersonListProps> = ({
  people,
  deletedPeople = [],
  giftCounts = {},
  onSelectPerson,
  onAddPerson,
  onRestorePerson,
  onLoadDemoData,
}) => {
  const { t, locale } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updated-desc');
  const [currentTab, setCurrentTab] = useState<'active' | 'trash'>('active');

  const filteredAndSortedPeople = useMemo(() => {
    const listToFilter = currentTab === 'active' ? people : deletedPeople;
    let result = [...listToFilter];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.relationship?.toLowerCase().includes(q) ||
          p.food.allergies.some((a) => a.toLowerCase().includes(q)) ||
          p.preferences.brands.some((b) => b.toLowerCase().includes(q)) ||
          p.preferences.scents.some((s) => s.toLowerCase().includes(q)) ||
          (p.details.clothingSize && p.details.clothingSize.toLowerCase().includes(q)) ||
          (p.details.shoeSize && p.details.shoeSize.toLowerCase().includes(q)) ||
          (p.details.ringSize && p.details.ringSize.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'updated-desc':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name, locale);
        case 'relationship-asc':
          return (a.relationship || '').localeCompare(b.relationship || '', locale);
        default:
          return 0;
      }
    });

    return result;
  }, [people, deletedPeople, currentTab, searchQuery, sortBy, locale]);

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-primary">{t('personList.title')}</h2>
          <p className="text-xs text-secondary mt-1">
            {t('personList.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {people.length === 0 && onLoadDemoData && (
            <Button
              size="md"
              variant="secondary"
              onClick={onLoadDemoData}
            >
              {t('personList.loadSampleProfiles')}
            </Button>
          )}

          <Button
            variant="primary"
            onClick={onAddPerson}
            icon={<Plus className="w-4 h-4" />}
          >
            {t('personList.addPerson')}
          </Button>
        </div>
      </div>

      {/* Filter & View Tabs (Active vs Trash) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Active / Trash toggle if deleted people exist */}
          {deletedPeople.length > 0 && (
            <div className="flex items-center bg-surface border border-border p-1 rounded-lg text-xs">
              <button
                onClick={() => setCurrentTab('active')}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  currentTab === 'active'
                    ? 'bg-canvas text-primary font-semibold border border-border-subtle shadow-subtle'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {t('personList.activeTab')} ({people.length})
              </button>
              <button
                onClick={() => setCurrentTab('trash')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors ${
                  currentTab === 'trash'
                    ? 'bg-canvas text-primary font-semibold border border-border-subtle shadow-subtle'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <Trash2 className="w-3 h-3 text-secondary" />
                <span>{t('personList.trashTab')} ({deletedPeople.length})</span>
              </button>
            </div>
          )}

          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('personList.searchPlaceholder')}
              className="w-full bg-surface border border-border text-primary text-xs rounded-md pl-9 pr-8 py-2 placeholder:text-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-secondary hover:text-primary"
                aria-label={t('common.clear')}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Sorting options */}
        <div className="flex items-center gap-2 text-xs text-secondary self-end sm:self-auto">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{t('personList.sortLabel')}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label={t('personList.sortAriaLabel')}
            className="bg-surface border border-border rounded-md px-2.5 py-1.5 text-xs text-primary focus:outline-none focus:border-primary/60 cursor-pointer"
          >
            <option value="updated-desc">{t('personList.sortUpdated')}</option>
            <option value="name-asc">{t('personList.sortName')}</option>
            <option value="relationship-asc">{t('personList.sortRelationship')}</option>
          </select>
        </div>
      </div>

      {/* Grid of People Cards */}
      {currentTab === 'active' ? (
        filteredAndSortedPeople.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedPeople.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                giftCount={giftCounts[person.id] || 0}
                onSelect={onSelectPerson}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<UserPlus className="w-5 h-5 text-secondary" />}
            title={searchQuery ? t('personList.noMatchesTitle') : t('personList.noPeopleTitle')}
            description={
              searchQuery
                ? t('personList.noMatchesDesc', { query: searchQuery })
                : t('personList.noPeopleDesc')
            }
            action={
              searchQuery ? (
                <Button size="sm" variant="secondary" onClick={() => setSearchQuery('')}>
                  {t('personList.resetSearch')}
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="primary" onClick={onAddPerson} icon={<Plus className="w-3.5 h-3.5" />}>
                    {t('personList.addFirstPerson')}
                  </Button>
                  {onLoadDemoData && (
                    <Button size="sm" variant="secondary" onClick={onLoadDemoData}>
                      {t('personList.loadSampleProfiles')}
                    </Button>
                  )}
                </div>
              )
            }
          />
        )
      ) : (
        /* Trash Tab */
        <div className="space-y-3">
          <div className="bg-canvas border border-border-subtle p-3 rounded-lg text-xs text-secondary flex items-center justify-between">
            <span>{t('personList.trashBanner')}</span>
          </div>

          {filteredAndSortedPeople.length > 0 ? (
            <div className="space-y-2">
              {filteredAndSortedPeople.map((person) => (
                <div
                  key={person.id}
                  className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-primary">{person.name}</h4>
                    {person.relationship && (
                      <p className="text-xs text-secondary">{person.relationship}</p>
                    )}
                  </div>
                  {onRestorePerson && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onRestorePerson(person.id)}
                      icon={<RotateCcw className="w-3.5 h-3.5" />}
                    >
                      {t('personList.restore')}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted text-center py-8">{t('personList.trashEmpty')}</p>
          )}
        </div>
      )}
    </div>
  );
};
