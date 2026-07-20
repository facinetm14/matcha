const API_BASE_ROUTE = import.meta.env.VITE_BASE_API;

export const resolveUserImageUrl = (preview?: string): string | undefined => {
  if (!preview) {
    return preview;
  }

  if (preview.startsWith('blob:') || preview.startsWith('http')) {
    return preview;
  }

  return `${API_BASE_ROUTE}/users/images/${encodeURIComponent(preview)}`;
};
