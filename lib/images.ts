// FILE: app/lib/images.ts
import { supabase } from './supabase';

// ---------------------------------------------------------------------------
// Style → Unsplash search query mapping
// ---------------------------------------------------------------------------
export const STYLE_IMAGES: Record<string, string> = {
  napoletana: 'napoletana pizza margherita',
  newyork: 'new york pizza slice',
  romana: 'pizza romana teglia',
  detroit: 'detroit style pizza',
  pala: 'pizza pala romana',
};

// ---------------------------------------------------------------------------
// getUnsplashPizzaUrl
// Returns an Unsplash Source URL for a given query + dimensions.
// No API key required — uses the public /photos/random source endpoint.
// ---------------------------------------------------------------------------
export function getUnsplashPizzaUrl(
  query: string,
  width: number,
  height: number
): string {
  const encoded = encodeURIComponent(query);
  return `https://source.unsplash.com/${width}x${height}/?${encoded}`;
}

// ---------------------------------------------------------------------------
// getStyleImageUrl
// Returns an Unsplash Source URL for a given pizza style id.
// Falls back to a generic pizza query if the style isn't in STYLE_IMAGES.
// ---------------------------------------------------------------------------
export function getStyleImageUrl(
  styleId: string,
  width = 800,
  height = 600
): string {
  const query = STYLE_IMAGES[styleId] ?? 'pizza artisan';
  return getUnsplashPizzaUrl(query, width, height);
}

// ---------------------------------------------------------------------------
// uploadBakePhoto
// Uploads a base64-encoded image to the Supabase Storage bucket 'bake-photos'.
// The file is stored at `{userId}/{timestamp}.jpg`.
// Returns the public URL of the uploaded photo, or null on error.
// ---------------------------------------------------------------------------
export async function uploadBakePhoto(
  userId: string,
  base64: string
): Promise<string | null> {
  try {
    // Strip the data-URI prefix if present (e.g. "data:image/jpeg;base64,")
    const pureBase64 = base64.replace(/^data:image\/\w+;base64,/, '');

    // Convert base64 to a Uint8Array (React Native compatible)
    const binaryString = atob(pureBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const timestamp = Date.now();
    const filePath = `${userId}/${timestamp}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('bake-photos')
      .upload(filePath, bytes, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error('[uploadBakePhoto] Upload error:', uploadError.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('bake-photos')
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl ?? null;
  } catch (err) {
    console.error('[uploadBakePhoto] Unexpected error:', err);
    return null;
  }
}
