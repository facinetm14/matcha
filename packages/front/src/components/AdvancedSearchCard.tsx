import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
}: AdvancedSearchCardProps) {
  return (
    <Card className="mb-6 shadow-card">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">Advanced Search</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">
                Age Range: {ageRange[0]} - {ageRange[1]}
              </Label>
              <Slider
                min={18}
                max={80}
                step={1}
                value={ageRange}
                onValueChange={(value) => setAgeRange(value as [number, number])}
              />
            </div>

            <div>
              <Label className="mb-2 block">
                Fame Rating: {fameRange[0]} - {fameRange[1]}
              </Label>
              <Slider
                min={0}
                max={1000}
                step={50}
                value={fameRange}
                onValueChange={(value) => setFameRange(value as [number, number])}
              />
            </div>
            <div>
              <Label className="mb-2 block">
                Distance Range: {distanceRange[0]} km - {distanceRange[1]} km
              </Label>
              <Slider
                min={0}
                max={500}
                step={10}
                value={distanceRange}
                onValueChange={(value) =>
                  setDistanceRange(value as [number, number])
                }
              />
            </div>
          </div>

          <div className="space-y-4">

            <div>
              <Label htmlFor="sort">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
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

            <div>
              <Label className="mb-2 block">Tags</Label>
              <TagInput
                tags={tags}
                onChange={setTags}
                isPossibleToAddTags={false}
              />
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
