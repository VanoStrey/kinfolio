import React, { useState, useMemo } from 'react';
import { Search, User, Gift, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { Person } from '../../types/person';
import { Badge } from '../common/Badge';

interface SearchViewProps {
  people: Person[];
  onSelectPerson: (personId: string) => void;
}

interface SearchMatch {
  person: Person;
  matchCategory: 'Person' | 'Sizes & Details' | 'Preferences' | 'Food & Allergies' | 'Gift' | 'Note';
  matchSnippet: string;
}

export const SearchView: React.FC<SearchViewProps> = ({ people, onSelectPerson }) => {
  const [query, setQuery] = useState('');

  const searchResults = useMemo<SearchMatch[]>(() => {
    if (!query.trim() || query.length < 2) return [];

    const q = query.toLowerCase().trim();
    const matches: SearchMatch[] = [];

    people.forEach((p) => {
      // 1. Name & Relationship
      if (p.name.toLowerCase().includes(q) || (p.relationship && p.relationship.toLowerCase().includes(q))) {
        matches.push({
          person: p,
          matchCategory: 'Person',
          matchSnippet: `${p.name} ${p.relationship ? `(${p.relationship})` : ''}`,
        });
      }

      // 2. Details / Sizes
      const sizesText = `${p.details.clothingSize || ''} ${p.details.shoeSize || ''} ${p.details.ringSize || ''} ${p.details.height || ''}`;
      if (sizesText.toLowerCase().includes(q)) {
        matches.push({
          person: p,
          matchCategory: 'Sizes & Details',
          matchSnippet: `Sizes: Clothing (${p.details.clothingSize || '—'}), Shoes (${p.details.shoeSize || '—'}), Ring (${p.details.ringSize || '—'})`,
        });
      }
      p.details.customFields.forEach((cf) => {
        if (cf.label.toLowerCase().includes(q) || cf.value.toLowerCase().includes(q)) {
          matches.push({
            person: p,
            matchCategory: 'Sizes & Details',
            matchSnippet: `${cf.label}: ${cf.value}`,
          });
        }
      });

      // 3. Preferences (scents, brands, colors, hobbies, likes)
      const allPrefs = [
        ...p.preferences.scents,
        ...p.preferences.brands,
        ...p.preferences.colors,
        ...p.preferences.hobbies,
        ...p.preferences.likes,
        ...p.preferences.dislikes,
      ];
      allPrefs.forEach((item) => {
        if (item.toLowerCase().includes(q)) {
          matches.push({
            person: p,
            matchCategory: 'Preferences',
            matchSnippet: item,
          });
        }
      });

      // 4. Food & Allergies
      p.food.allergies.forEach((allergy) => {
        if (allergy.toLowerCase().includes(q)) {
          matches.push({
            person: p,
            matchCategory: 'Food & Allergies',
            matchSnippet: `Medical Allergy: ${allergy}`,
          });
        }
      });
      p.food.intolerances.forEach((intol) => {
        if (intol.toLowerCase().includes(q)) {
          matches.push({
            person: p,
            matchCategory: 'Food & Allergies',
            matchSnippet: `Intolerance: ${intol}`,
          });
        }
      });
      p.food.favoriteFoods.forEach((ff) => {
        if (ff.toLowerCase().includes(q)) {
          matches.push({
            person: p,
            matchCategory: 'Food & Allergies',
            matchSnippet: `Favorite food: ${ff}`,
          });
        }
      });

      // 5. Gifts
      p.gifts.forEach((g) => {
        if (
          g.title.toLowerCase().includes(q) ||
          (g.description && g.description.toLowerCase().includes(q)) ||
          (g.occasion && g.occasion.toLowerCase().includes(q))
        ) {
          matches.push({
            person: p,
            matchCategory: 'Gift',
            matchSnippet: `Gift Idea: "${g.title}" (${g.status})`,
          });
        }
      });

      // 6. Notes
      p.notes.forEach((n) => {
        if (n.content.toLowerCase().includes(q)) {
          matches.push({
            person: p,
            matchCategory: 'Note',
            matchSnippet: n.content,
          });
        }
      });
    });

    return matches;
  }, [people, query]);

  const getCategoryIcon = (cat: SearchMatch['matchCategory']) => {
    switch (cat) {
      case 'Person':
        return <User className="w-4 h-4 text-secondary" />;
      case 'Gift':
        return <Gift className="w-4 h-4 text-secondary" />;
      case 'Food & Allergies':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'Note':
        return <FileText className="w-4 h-4 text-secondary" />;
      default:
        return <Search className="w-4 h-4 text-secondary" />;
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h2 className="text-xl font-bold tracking-tight text-primary">Global Search</h2>
        <p className="text-xs text-secondary mt-1">
          Instantly query all sizes, allergies, perfumes, brands, notes, and gift ideas.
        </p>
      </div>

      {/* Large Minimalist Search Input */}
      <div className="relative">
        <Search className="w-5 h-5 text-secondary absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try searching for 'Peanuts', 'EU 38', 'Aesop', 'Berlin', or 'Ring'..."
          autoFocus
          className="w-full bg-surface border border-border text-primary text-sm rounded-xl pl-12 pr-4 py-3.5 placeholder:text-muted focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 shadow-subtle transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-secondary hover:text-primary"
          >
            Clear
          </button>
        )}
      </div>

      {/* Suggested Fast Queries */}
      {!query && (
        <div className="pt-2">
          <p className="text-xs text-muted mb-2">Quick suggestions:</p>
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

      {/* Results */}
      {query.trim().length >= 2 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-secondary">
            <span>
              {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'} found
            </span>
          </div>

          {searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((match, idx) => (
                <div
                  key={idx}
                  onClick={() => onSelectPerson(match.person.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectPerson(match.person.id);
                    }
                  }}
                  className="bg-surface border border-border hover:border-primary/40 rounded-xl p-4 transition-all duration-150 cursor-pointer shadow-subtle flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-canvas border border-border-subtle flex items-center justify-center shrink-0 mt-0.5">
                      {getCategoryIcon(match.matchCategory)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary group-hover:text-black">
                          {match.person.name}
                        </span>
                        <Badge size="sm" variant="default">
                          {match.matchCategory}
                        </Badge>
                      </div>
                      <p className="text-xs text-secondary mt-1 truncate">
                        {match.matchSnippet}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-secondary/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface/50 rounded-xl border border-dashed border-border p-6 text-xs text-secondary">
              No results found for &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
