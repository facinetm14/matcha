import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search as SearchIcon } from 'lucide-react';
import { TagInput } from '@/components/ui/tag-input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/utils/utils';

type FilterToggleProps = {
  label: ReactNode;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
};

function FilterToggle({ label, enabled, onToggle }: FilterToggleProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <Label className={cn('font-medium', !enabled && 'text-muted-foreground')}>
        {label}
      </Label>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>{enabled ? 'On' : 'Off'}</span>
        <Checkbox
          checked={enabled}
          onCheckedChange={(checked) => onToggle(checked === true)}
          aria-label="Toggle filter"
        />
      </div>
    </div>
  );
}

type AdvancedSearchCardProps = {
  ageRange: [number, number];
  setAgeRange: (value: [number, number]) => void;
  fameRange: [number, number];
  setFameRange: (value: [number, number]) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  distanceRange: [number, number];
  setDistanceRange: (value: [number, number]) => void;
  tags: string[];
  setTags: (value: string[]) => void;
  onSubmit: () => void;
  ageFilterEnabled: boolean;
  onToggleAgeFilter: (enabled: boolean) => void;
  fameFilterEnabled: boolean;
  onToggleFameFilter: (enabled: boolean) => void;
  distanceFilterEnabled: boolean;
  onToggleDistanceFilter: (enabled: boolean) => void;
  sortFilterEnabled: boolean;
  onToggleSortFilter: (enabled: boolean) => void;
  tagsFilterEnabled: boolean;
  onToggleTagsFilter: (enabled: boolean) => void;
};

export function AdvancedSearchCard({
  ageRange,
  setAgeRange,
  fameRange,
  setFameRange,
  sortBy,
  setSortBy,
  distanceRange,
  setDistanceRange,
  tags,
  setTags,
  onSubmit,
  ageFilterEnabled,
  onToggleAgeFilter,
  fameFilterEnabled,
  onToggleFameFilter,
  distanceFilterEnabled,
  onToggleDistanceFilter,
  sortFilterEnabled,
  onToggleSortFilter,
  tagsFilterEnabled,
  onToggleTagsFilter,
}: AdvancedSearchCardProps) {
  const filterSectionClass = (enabled: boolean) =>
    cn(
      'rounded-xl border border-border/60 p-4 transition-colors',
      !enabled && 'bg-muted text-muted-foreground',
    );
  const interactiveSectionClass = (enabled: boolean) =>
    cn('space-y-2', !enabled && 'pointer-events-none opacity-60');

  return (
    <Card className="mb-6 shadow-card">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Advanced Search</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className={filterSectionClass(ageFilterEnabled)}>
              <FilterToggle
                label={`Age Range: ${ageRange[0]} - ${ageRange[1]}`}
                enabled={ageFilterEnabled}
                onToggle={onToggleAgeFilter}
              />
              <div className={interactiveSectionClass(ageFilterEnabled)}>
                <Slider
                  min={18}
                  max={130}
                  step={1}
                  value={ageRange}
                  onValueChange={(value) =>
                    setAgeRange(value as [number, number])
                  }
                  disabled={!ageFilterEnabled}
                />
              </div>
            </div>

            <div className={filterSectionClass(fameFilterEnabled)}>
              <FilterToggle
                label={`Fame Rating: ${fameRange[0]} - ${fameRange[1]}`}
                enabled={fameFilterEnabled}
                onToggle={onToggleFameFilter}
              />
              <div className={interactiveSectionClass(fameFilterEnabled)}>
                <Slider
                  min={0}
                  max={1000}
                  step={50}
                  value={fameRange}
                  onValueChange={(value) =>
                    setFameRange(value as [number, number])
                  }
                  disabled={!fameFilterEnabled}
                />
              </div>
            </div>
            <div className={filterSectionClass(distanceFilterEnabled)}>
              <FilterToggle
                label={`Distance Range: ${distanceRange[0]} km - ${distanceRange[1]} km`}
                enabled={distanceFilterEnabled}
                onToggle={onToggleDistanceFilter}
              />
              <div className={interactiveSectionClass(distanceFilterEnabled)}>
                <Slider
                  min={0}
                  max={600}
                  step={10}
                  value={distanceRange}
                  onValueChange={(value) =>
                    setDistanceRange(value as [number, number])
                  }
                  disabled={!distanceFilterEnabled}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className={filterSectionClass(sortFilterEnabled)}>
              <FilterToggle
                label="Sort By"
                enabled={sortFilterEnabled}
                onToggle={onToggleSortFilter}
              />
              <div className={interactiveSectionClass(sortFilterEnabled)}>
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                  disabled={!sortFilterEnabled}
                >
                  <SelectTrigger id="sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="age">Age</SelectItem>
                    <SelectItem value="fame">Fame Rating</SelectItem>
                    <SelectItem value="tags">Tags</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className={filterSectionClass(tagsFilterEnabled)}>
              <FilterToggle
                label="Tags"
                enabled={tagsFilterEnabled}
                onToggle={onToggleTagsFilter}
              />
              <div className={interactiveSectionClass(tagsFilterEnabled)}>
                <TagInput
                  tags={tags}
                  onChange={setTags}
                  isPossibleToAddTags={false}
                  disabled={!tagsFilterEnabled}
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={onSubmit}
          variant="outline"
          className="w-full mt-6 bg-gradient-romantic"
        >
          <SearchIcon className="w-4 h-4 mr-2" />
          Search
        </Button>
      </CardContent>
    </Card>
  );
}
