import { useState, KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

export function TagInput({ tags, onChange, disabled = false }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const MAX_TAGS = 15;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim().toLowerCase();

      if (tags.length >= MAX_TAGS) return;

      if (!tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-md border border-input min-h-[42px]">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-gradient-romantic text-white pl-3 pr-1 py-1 flex items-center gap-1"
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
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? "Type and press Enter to add tags..." : "Add tag..."}
            className="flex-1 min-w-[120px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-6"
          />
        )}
      </div>

      {/* message d’aide */}
      {!disabled && (
        <>
          {inputValue && tags.length < MAX_TAGS && (
            <p className="text-xs text-muted-foreground">
              Press Enter to create tag "{inputValue.trim()}"
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