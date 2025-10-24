import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical, Star, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface PhotoSlotProps {
  id: string;
  preview: string;
  isProfile: boolean;
  onRemove: () => void;
}

export const PhotoSlot = ({
  id,
  preview,
  isProfile,
  onRemove,
}: PhotoSlotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`relative aspect-[3/4] rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-all cursor-pointer ${
          isDragging ? 'opacity-50 scale-105 z-50' : ''
        }`}
        onClick={() => setIsOpen(true)}
      >
        <img
          src={preview}
          alt="Upload preview"
          className="w-full h-full object-cover"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* View icon */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="p-3 bg-background/90 rounded-full shadow-lg">
            <Maximize2 className="w-6 h-6 text-foreground" />
          </div>
        </div>

        {/* Profile badge */}
        {isProfile && (
          <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground shadow-lg gap-1 px-2 py-1">
            <Star className="w-3 h-3 fill-current" />
            Profile
          </Badge>
        )}

        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing hover:bg-background shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-5 h-5 text-foreground" />
        </div>

        {/* Remove button */}
        <Button
          size="icon"
          variant="destructive"
          className="absolute bottom-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Position indicator */}
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="px-2 py-1 bg-background/90 rounded-md text-xs font-medium text-foreground shadow-lg">
            Drag to reorder
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl p-2">
          <DialogTitle className="sr-only">Photo preview</DialogTitle>
          <img
            src={preview}
            alt="Full size preview"
            className="w-full h-auto rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
