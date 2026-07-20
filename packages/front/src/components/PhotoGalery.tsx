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
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PhotoSlot } from './PhotoSlot';
import { useProfileStore } from '@/store/profileStore';
import { UserImage } from '@/types/user-image';
import { uuid } from '../../../shared/uuid';
import { ImagePosition } from '@/types/dto/update-image-position.dto';
import { useGetProfile } from '@/hooks/useGetProfile';

const MAX_PHOTOS = 5;
const ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png'];

export const PhotoGallery = ({ isEditing }: { isEditing: boolean }) => {
  const { data: user } = useGetProfile();

  const {
    photos,
    imagesToDelete,
    imagesPositionToUpdate,
    updateUserPhotos,
    updateImagesToDelete,
    updateImagesPositionToUpdate,
  } = useProfileStore((state) => state);

  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDrop = (acceptedFiles: File[]) => {
    if (photos.length === MAX_PHOTOS) {
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
    const lastImage = photos.at(-1);
    const lastPosition = lastImage ? lastImage.position + 1 : 1;

    const newPhotos: UserImage[] = filesToAdd.map((file, i) => ({
      file,
      preview: URL.createObjectURL(file),
      position: lastPosition + i,
      userId: user.id,
      id: `photo-${uuid()}`,
    }));

    updateUserPhotos([...photos, ...newPhotos]);
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

  const switchPhotoPosition = async (idPhoto1: string, idPhoto2: string) => {
    const photo1 = photos
      .find((p) => p.id === idPhoto1)
    const photo2 = photos
      .find((p) => p.id === idPhoto2)

    const orderedPhotos: UserImage[] = [];
    const newImagePositions: ImagePosition[] = [];

    orderedPhotos.push({ ...photo1, position: photo2.position });
    newImagePositions.push({
      preview: photo1.preview,
      position: photo2.position,
    });

    orderedPhotos.push({ ...photo2, position: photo1.position });
    newImagePositions.push({
      preview: photo2.preview,
      position: photo1.position,
    });

    for (const p of photos) {
      if (p.position !== photo1.position && p.position !== photo2.position)
      orderedPhotos.push(p);
    }

    updateUserPhotos(orderedPhotos);
    updateImagesPositionToUpdate([
      ...imagesPositionToUpdate.filter((p) =>
        newImagePositions.find((img) => p.preview === img.preview),
      ),
      ...newImagePositions,
    ]);
  };

  const removePhoto = (preview: string) => {
    const photo = photos.find((p) => p.preview === preview);
    if (photo) {
      URL.revokeObjectURL(photo.preview);
    }
    updateImagesToDelete([...imagesToDelete, preview]);
    updateUserPhotos(photos.filter((p) => p.preview !== preview));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    switchPhotoPosition(active.id.toString(), over.id.toString());
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
                isEditing={isEditing}
                onRemove={() => removePhoto(photo.preview)}
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
