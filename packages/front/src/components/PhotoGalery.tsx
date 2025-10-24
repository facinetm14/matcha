import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PhotoSlot } from './PhotoSlot';
import { UserImageDto } from '@/types/dto/user-image.dto';
import { useProfileStore } from '@/store/profileStore';
import { convertFIleToBase64t } from '@/utils/convert-file-to-base64';

interface Photo {
  id: string;
  file: File;
  preview: string;
}

const MAX_PHOTOS = 5;
const ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png'];

export const PhotoGallery = ({ isEditing }: { isEditing: boolean }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const { toast } = useToast();
  const { user, draft, updateUserDraft } = useProfileStore((state) => state);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDrop = (acceptedFiles: File[]) => {
    if (photos.length >= MAX_PHOTOS) {
      toast({
        title: 'Maximum photos reached',
        description: `You can only upload up to ${MAX_PHOTOS} photos.`,
        variant: 'destructive',
      });
      return;
    }

    const validFiles = acceptedFiles.filter((file) =>
      ACCEPTED_FORMATS.includes(file.type),
    );

    if (validFiles.length !== acceptedFiles.length) {
      toast({
        title: 'Invalid file format',
        description: 'Only JPG, JPEG, and PNG files are allowed.',
        variant: 'destructive',
      });
    }

    const remainingSlots = MAX_PHOTOS - photos.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    const newPhotos: Photo[] = filesToAdd.map((file) => ({
      id: `photo-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);

    uploadPhotos(filesToAdd);

    if (filesToAdd.length < validFiles.length) {
      toast({
        title: 'Some photos not added',
        description: `Only ${remainingSlots} slot(s) available.`,
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    noClick: true,
    noKeyboard: true,
  });

  const uploadPhotos = async (files: File[]) => {
    const photoList: UserImageDto[] = [];

    const lastImage = user.photos?.at(-1);
    let pos = lastImage ? lastImage.position + 1 : 1;

    for (const f of files) {
      const image: UserImageDto = {
        dataInBase64: await convertFIleToBase64t(f),
        position: pos,
      };

      pos += 1;
      photoList.push(image);
    }
    updateUserDraft({
      ...(draft ?? {}),
      photos: [...(draft.photos ?? []), ...photoList],
    });
  };

  const mockDeletePhoto = async (photoId: string) => {
    // Mock API call - replace with your actual API
    console.log('Deleting photo:', photoId);
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Photo deleted successfully');
  };

  const mockReorderPhotos = async (photoIds: string[]) => {
    // Mock API call - replace with your actual API
    console.log('Reordering photos:', photoIds);
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Photos reordered successfully');
  };

  const removePhoto = (id: string) => {
    const photo = photos.find((p) => p.id === id);
    if (photo) {
      URL.revokeObjectURL(photo.preview);
      mockDeletePhoto(id);
    }
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPhotos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Mock API call with new order
        mockReorderPhotos(newOrder.map((p) => p.id));

        return newOrder;
      });
    }
  };

  const emptySlots = Math.max(0, MAX_PHOTOS - photos.length);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Photo Gallery
        </h2>
        {isEditing && (
          <p className="text-muted-foreground">
            Add up to {MAX_PHOTOS} photos. The first photo will be your profile
            picture.
          </p>
        )}
      </div>

      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <Button
            onClick={open}
            className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            <Upload className="w-5 h-5" />
            Add Photos
          </Button>

          <Button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/jpeg,image/jpg,image/png';
              input.capture = 'environment';
              input.multiple = true;
              input.onchange = (e) => {
                const files = Array.from(
                  (e.target as HTMLInputElement).files || [],
                );
                onDrop(files);
              };
              input.click();
            }}
            variant="outline"
            className="flex-1 gap-2 border-primary text-primary hover:bg-secondary hover:text-primary transition-all"
            size="lg"
          >
            <Camera className="w-5 h-5" />
            Take Photo
          </Button>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={photos.map((p) => p.id)}
          strategy={rectSortingStrategy}
        >
          <div
            {...getRootProps()}
            className={`grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 p-6 rounded-xl border-2 border-dashed transition-all ${
              isDragActive
                ? 'border-primary bg-secondary/50 scale-[1.02]'
                : 'border-border bg-card'
            }`}
          >
            <input {...getInputProps()} />

            {photos.map((photo, index) => (
              <PhotoSlot
                key={photo.id}
                id={photo.id}
                preview={photo.preview}
                isProfile={index === 0}
                onRemove={() => removePhoto(photo.id)}
              />
            ))}

            {Array.from({ length: emptySlots }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="aspect-[3/4] rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 flex flex-col items-center justify-center gap-2  transition-all cursor-pointer"
              >
                <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {isDragActive && (
        <div className="mt-4 p-4 bg-secondary rounded-lg text-center">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 text-primary animate-bounce" />
          <p className="text-sm font-medium text-primary">
            Drop your photos here
          </p>
        </div>
      )}
    </div>
  );
};
