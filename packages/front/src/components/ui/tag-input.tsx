import { useState, KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/user.api';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

export function TagInput({ tags, onChange, disabled = false }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const MAX_TAGS = 15;

  const { isPending, data } = useQuery({
    queryKey: ['fetchAllTags'],
    queryFn: async () => {
      const res = await userApi.getAllTags();
      if (!res.ok) throw new Error('Failed to fetch user');

      const tags = await res.json();
      return tags.interestList;
    },
  });

  const allSuggestions = isPending ? [] : data;

  const filteredSuggestions = allSuggestions
    .filter((tag) =>
      inputValue ? tag.toLowerCase().includes(inputValue.toLowerCase()) : true,
    )
    .filter((tag) => !tags.includes(tag.toLowerCase()));

  const showSuggestions =
    !disabled &&
    !!inputValue.trim() &&
    filteredSuggestions.length > 0 &&
    tags.length < MAX_TAGS &&
    isOpen;

  const addTag = (tag: string) => {
    const newTag = tag.trim().toLowerCase();
    if (!newTag) return;
    if (tags.length >= MAX_TAGS) return;
    if (!tags.includes(newTag)) {
      onChange([...tags, newTag]);
    }
    setInputValue('');
    setIsOpen(false);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      if (!filteredSuggestions.length) return;
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) =>
        prev + 1 < filteredSuggestions.length ? prev + 1 : 0,
      );
      return;
    }

    if (e.key === 'ArrowUp') {
      if (!filteredSuggestions.length) return;
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) =>
        prev - 1 >= 0 ? prev - 1 : filteredSuggestions.length - 1,
      );
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();

      if (filteredSuggestions.length && isOpen) {
        const chosen =
          filteredSuggestions[highlightedIndex] ?? filteredSuggestions[0];
        addTag(chosen);
      } else {
        addTag(inputValue);
      }
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 100);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap gap-2 p-3 bg-background rounded-md border border-input min-h-[42px]">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="pl-3 pr-1 py-1 flex items-center gap-1"
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          ))}
          {!disabled && tags.length < MAX_TAGS && (
            <Input
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setIsOpen(true);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              placeholder={
                tags.length === 0
                  ? 'Type and press Enter to add tags...'
                  : 'Add tag...'
              }
            />
          )}
        </div>

        {/* suggestions */}
        {showSuggestions && (
          <div className="mt-1 max-h-40 overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md text-sm">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addTag(suggestion);
                }}
                className={`flex w-full items-center px-3 py-1.5 text-left hover:bg-accent ${
                  index === highlightedIndex ? 'bg-accent' : ''
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* help message */}
      {!disabled && (
        <>
          {inputValue && tags.length < MAX_TAGS && (
            <p className="text-xs text-muted-foreground">
              Press Enter to create tag "{inputValue.trim()}"
              {filteredSuggestions.length > 0 && ' or select a suggestion.'}
            </p>
          )}
          {tags.length >= MAX_TAGS && (
            <p className="text-xs text-destructive">
              Maximum {MAX_TAGS} tags reached.
            </p>
          )}
        </>
      )}
    </div>
  );
}
