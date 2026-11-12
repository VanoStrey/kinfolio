import React, { useState, useMemo } from 'react';
import { Plus, UserPlus, RotateCcw, Trash2 } from 'lucide-react';
import { Person, SortOption } from '../../types/person';
import { PersonCard } from './PersonCard';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { Select } from '../common/Select';
import { EmptyState } from '../common/EmptyState';
import { Skeleton } from '../common/Skeleton';
import { PageHeader } from '../layout/PageHeader';
import { useTranslation } from '../../i18n/LanguageContext';

interface PersonListProps {
  people: Person[];
  deletedPeople?: Person[];
  giftCounts?: Record<string, number>;
  loading?: boolean;
  onSelectPerson: (personId: string) => void;
  onAddPerson: () => void;
  onRestorePerson?: (personId: string) => void;
  onLoadDemoData?: () => void;
}

export const PersonList: React.FC<PersonListProps> = ({
  people,
  deletedPeople = [],
  giftCounts = {},
  loading = false,
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

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.relationship?.toLowerCase().includes(q) ||
          p.bio?.toLowerCase().includes(q) ||
          p.food.allergies.some((a) => a.toLowerCase().includes(q)) ||
          p.preferences.brands.some((b) => b.toLowerCase().includes(q)) ||
          p.preferences.scents.some((s) => s.toLowerCase().includes(q)) ||
          (p.details.clothingSize && p.details.clothingSize.toLowerCase().includes(q)) ||
          (p.details.shoeSize && p.details.shoeSize.toLowerCase().includes(q)) ||
          (p.details.ringSize && p.details.ringSize.toLowerCase().includes(q))
      );
    }

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
    <div className="space-y-7">
      <PageHeader
        title={t('personList.title')}
        subtitle={t('personList.subtitle')}
        action={
          <>
            {people.length === 0 && !loading && onLoadDemoData && (
              <Button size="md" variant="secondary" onClick={onLoadDemoData}>
                {t('personList.loadSampleProfiles')}
              </Button>
            )}
            <Button
              size="md"
              variant="primary"
              onClick={onAddPerson}
              icon={<Plus className="w-4 h-4" />}
            >
              {t('personList.addPerson')}
            </Button>
          </>
        }
      />

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 min-w-0">
          {deletedPeople.length > 0 && (
            <div className="inline-flex items-center bg-surface-soft border border-border p-1 rounded-full self-start shrink-0">
              <button
                type="button"
                onClick={() => setCurrentTab('active')}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-[background-color,color] duration-[180ms] ${
                  currentTab === 'active'
                    ? 'bg-surface-green text-green-900 font-semibold shadow-soft'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {t('personList.activeTab')} ({people.length})
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('trash')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-[background-color,color] duration-[180ms] ${
                  currentTab === 'trash'
                    ? 'bg-surface-green text-green-900 font-semibold shadow-soft'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('personList.trashTab')} ({deletedPeople.length})</span>
              </button>
            </div>
          )}

          <div className="flex-1 max-w-md min-w-0">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t('personList.searchPlaceholder')}
              clearLabel={t('common.clear')}
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
          <span className="text-[13px] text-secondary">{t('personList.sortLabel')}</span>
          <Select
            compact
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            aria-label={t('personList.sortAriaLabel')}
          >
            <option value="updated-desc">{t('personList.sortUpdated')}</option>
            <option value="name-asc">{t('personList.sortName')}</option>
            <option value="relationship-asc">{t('personList.sortRelationship')}</option>
          </Select>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-lg p-5 space-y-4">
              <div className="flex items-center gap-3.5">
                <Skeleton className="w-11 h-11 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      ) : currentTab === 'active' ? (
        filteredAndSortedPeople.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
            icon={<UserPlus className="w-5 h-5 text-green-700" />}
            title={searchQuery ? t('personList.noMatchesTitle') : t('personList.noPeopleTitle')}
            description={
              searchQuery
                ? t('personList.noMatchesDesc', { query: searchQuery })
                : t('personList.noPeopleDesc')
            }
            action={
              searchQuery ? (
                <Button size="md" variant="secondary" onClick={() => setSearchQuery('')}>
                  {t('personList.resetSearch')}
                </Button>
              ) : (
                <>
                  <Button
                    size="md"
                    variant="primary"
                    onClick={onAddPerson}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    {t('personList.addFirstPerson')}
                  </Button>
                  {onLoadDemoData && (
                    <Button size="md" variant="secondary" onClick={onLoadDemoData}>
                      {t('personList.loadSampleProfiles')}
                    </Button>
                  )}
                </>
              )
            }
          />
        )
      ) : (
        /* Trash Tab */
        <div className="space-y-4">
          <div className="bg-surface-soft border border-border px-4 py-3 rounded-md text-[13px] text-secondary">
            {t('personList.trashBanner')}
          </div>

          {filteredAndSortedPeople.length > 0 ? (
            <div className="space-y-2.5">
              {filteredAndSortedPeople.map((person) => (
                <div
                  key={person.id}
                  className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-[15px] font-semibold text-primary">{person.name}</h4>
                    {person.relationship && (
                      <p className="text-[13px] text-secondary">{person.relationship}</p>
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
            <p className="text-[14px] text-muted text-center py-8">{t('personList.trashEmpty')}</p>
          )}
        </div>
      )}
    </div>
  );
};
