import React, { useState, useEffect } from 'react';
import { Search, User, Gift, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { PersonProfileTab } from '../../types/navigation';
import { searchAllRecords, SearchResultItem, SearchCategory } from '../../services/searchService';
import { Badge } from '../common/Badge';
import { SearchInput } from '../common/SearchInput';
import { EmptyState } from '../common/EmptyState';
import { PageHeader } from '../layout/PageHeader';
import { useTranslation } from '../../i18n/LanguageContext';
import { selectPluralForm } from '../../i18n/helpers';

interface SearchViewProps {
  onSelectPerson: (personId: string, initialTab?: PersonProfileTab) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ onSelectPerson }) => {
  const { t, language } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    if (query.trim().length >= 2) {
      setIsSearching(true);
      searchAllRecords(query, language).then((items) => {
        if (!isCancelled) {
          setResults(items);
          setIsSearching(false);
        }
      });
    } else {
      setResults([]);
      setIsSearching(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [query, language]);

  const getCategoryIcon = (cat: SearchCategory) => {
    switch (cat) {
      case 'Person':
        return <User className="w-4 h-4 text-green-700" />;
      case 'Gift':
        return <Gift className="w-4 h-4 text-green-700" />;
      case 'Food & Allergies':
        return <AlertTriangle className="w-4 h-4 text-danger" />;
      case 'Note':
        return <FileText className="w-4 h-4 text-green-700" />;
      default:
        return <Search className="w-4 h-4 text-green-700" />;
    }
  };

  const getCategoryLabel = (cat: SearchCategory) => {
    switch (cat) {
      case 'Person':
        return t('search.catPerson');
      case 'Sizes & Details':
        return t('search.catDetails');
      case 'Preferences':
        return t('search.catPreferences');
      case 'Food & Allergies':
        return t('search.catFood');
      case 'Gift':
        return t('search.catGift');
      case 'Note':
        return t('search.catNote');
    }
  };

  const matchLabel = selectPluralForm(results.length, language, {
    singular: t('search.matchSingular'),
    few: t('search.matchFew'),
    many: t('search.matchMany'),
  });

  return (
    <div className="space-y-7 max-w-3xl">
      <PageHeader title={t('search.heading')} subtitle={t('search.subtitle')} />

      {/* Large Search Input */}
      <SearchInput
        size="lg"
        value={query}
        onChange={setQuery}
        placeholder={t('search.placeholder')}
        clearLabel={t('common.clear')}
        autoFocus
      />

      {/* Suggested Fast Queries */}
      {!query && (
        <div className="space-y-2.5">
          <p className="text-[13px] font-medium text-secondary">{t('search.quickSuggestions')}</p>
          <div className="flex flex-wrap gap-2">
            {['Peanuts', 'Aesop', 'EU 38', 'Ring', 'Coffee', 'Photography'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="text-[13px] font-medium bg-surface border border-border px-3.5 py-1.5 rounded-full text-secondary hover:text-green-900 hover:bg-surface-green/60 hover:border-green-300 transition-[background-color,border-color,color] duration-[180ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700/40"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search results */}
      {query.trim().length >= 2 && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-[13px] text-secondary font-medium">
            <span>
              {isSearching
                ? t('search.searching')
                : `${results.length} ${matchLabel} ${t('search.foundSuffix')}`}
            </span>
          </div>

          {results.length > 0 ? (
            <div className="space-y-2.5">
              {results.map((match) => (
                <div
                  key={match.id}
                  onClick={() => onSelectPerson(match.personId, match.targetTab)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectPerson(match.personId, match.targetTab);
                    }
                  }}
                  className={`bg-surface border rounded-lg p-4 transition-[border-color,box-shadow,background-color] duration-[180ms] cursor-pointer hover:shadow-soft flex items-center justify-between gap-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-green-700/40 ${
                    match.isAllergyAlert
                      ? 'border-danger/35 hover:border-danger/60 bg-[#FAF0EF]/35'
                      : 'border-border hover:border-green-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                        match.isAllergyAlert
                          ? 'bg-[#FAF0EF] border-danger/25'
                          : 'bg-surface-soft border-border'
                      }`}
                    >
                      {getCategoryIcon(match.category)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-[15.5px] font-semibold text-primary group-hover:text-green-900 transition-colors">
                          {match.personName}
                        </span>
                        <Badge
                          size="sm"
                          variant={match.isAllergyAlert ? 'danger' : 'default'}
                        >
                          {getCategoryLabel(match.category)}
                        </Badge>
                      </div>
                      <p className="text-[13.5px] text-secondary mt-1 truncate leading-[1.45]">
                        {match.snippet}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-muted group-hover:text-green-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            !isSearching && (
              <EmptyState
                icon={<Search className="w-5 h-5 text-green-700" />}
                title={t('personList.noMatchesTitle')}
                description={t('search.noResults', { query })}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};
