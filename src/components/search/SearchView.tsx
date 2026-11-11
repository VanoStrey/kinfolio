import React, { useState, useEffect } from 'react';
import { Search, User, Gift, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { PersonProfileTab } from '../../types/navigation';
import { searchAllRecords, SearchResultItem, SearchCategory } from '../../services/searchService';
import { Badge } from '../common/Badge';
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
        return <User className="w-4 h-4 text-secondary" />;
      case 'Gift':
        return <Gift className="w-4 h-4 text-secondary" />;
      case 'Food & Allergies':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'Note':
        return <FileText className="w-4 h-4 text-secondary" />;
      default:
        return <Search className="w-4 h-4 text-secondary" />;
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
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h2 className="text-xl font-bold tracking-tight text-primary">{t('search.heading')}</h2>
        <p className="text-xs text-secondary mt-1">
          {t('search.subtitle')}
        </p>
      </div>

      {/* Large Minimalist Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-secondary absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search.placeholder')}
          autoFocus
          className="w-full bg-surface border border-border text-primary text-sm rounded-xl pl-12 pr-16 py-3.5 placeholder:text-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 shadow-subtle transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-secondary hover:text-primary"
          >
            {t('common.clear')}
          </button>
        )}
      </div>

      {/* Suggested Fast Queries */}
      {!query && (
        <div className="pt-2">
          <p className="text-xs text-muted mb-2">{t('search.quickSuggestions')}</p>
          <div className="flex flex-wrap gap-2">
            {['Peanuts', 'Aesop', 'EU 38', 'Ring', 'Coffee', 'Photography'].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="text-xs bg-surface border border-border px-3 py-1.5 rounded-lg text-secondary hover:text-primary hover:bg-canvas transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search results */}
      {query.trim().length >= 2 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-secondary">
            <span>
              {isSearching
                ? t('search.searching')
                : `${results.length} ${matchLabel} ${t('search.foundSuffix')}`}
            </span>
          </div>

          {results.length > 0 ? (
            <div className="space-y-2">
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
                  className={`bg-surface border rounded-xl p-4 transition-all duration-150 cursor-pointer shadow-subtle flex items-center justify-between gap-4 group ${
                    match.isAllergyAlert
                      ? 'border-red-200 hover:border-red-400 bg-red-50/20'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-canvas border border-border-subtle flex items-center justify-center shrink-0 mt-0.5">
                      {getCategoryIcon(match.category)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-primary group-hover:text-black">
                          {match.personName}
                        </span>
                        <Badge
                          size="sm"
                          variant={match.isAllergyAlert ? 'danger' : 'default'}
                        >
                          {getCategoryLabel(match.category)}
                        </Badge>
                      </div>
                      <p className="text-xs text-secondary mt-1 truncate">
                        {match.snippet}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-secondary/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            !isSearching && (
              <div className="text-center py-12 bg-surface/50 rounded-xl border border-dashed border-border p-6 text-xs text-secondary">
                {t('search.noResults', { query })}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
