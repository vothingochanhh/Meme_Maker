/**
 * Capacitor Utils
 * Senior Rule: Tách biệt logic tương tác với Capacitor plugins
 * Xử lý permission, error handling rõ ràng
 */

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/**
 * Pick image từ thư viện với error handling
 */
export const pickImageFromGallery = async (): Promise<string> => {
  try {
    const photo = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });

    if (!photo.webPath) {
      throw new Error('No image selected');
    }

    return photo.webPath;
  } catch (error) {
    console.error('Error picking image:', error);
    throw new Error('Failed to pick image from gallery');
  }
};

/**
 * Lưu blob sang file trong filesystem
 */
export const saveImageToDevice = async (
  blob: Blob,
  filename: string
): Promise<string> => {
  try {
    // Convert blob sang base64
    const base64Data = await blobToBase64(blob);

    // Lưu file
    const result = await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Documents,
    });

    return result.uri;
  } catch (error) {
    console.error('Error saving image:', error);
    throw new Error('Failed to save image to device');
  }
};

/**
 * Chia sẻ image
 */
export const shareImage = async (
  blob: Blob,
  title: string = 'Share Meme'
): Promise<void> => {
  try {
    // Convert blob sang base64
    const base64Data = await blobToBase64(blob);
    
    // Tạo file tạm để share
    const filename = `meme_${Date.now()}.jpg`;
    const writeResult = await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Cache,
    });

    // Share file
    await Share.share({
      title,
      url: writeResult.uri,
      dialogTitle: title,
    });

    // Xóa file tạm sau khi share
    setTimeout(async () => {
      try {
        await Filesystem.deleteFile({
          path: filename,
          directory: Directory.Cache,
        });
      } catch (err) {
        console.warn('Failed to delete temp file:', err);
      }
    }, 5000);
  } catch (error) {
    console.error('Error sharing image:', error);
    throw new Error('Failed to share image');
  }
};

/**
 * Convert Blob sang Base64 string
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      // Remove data:image/jpeg;base64, prefix
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Request camera permissions (useful cho Android)
 */
export const requestCameraPermissions = async (): Promise<boolean> => {
  try {
    const permissions = await Camera.requestPermissions();
    return permissions.photos === 'granted';
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
};
