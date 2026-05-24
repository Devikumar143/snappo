import { uploadAsync, FileSystemUploadType } from 'expo-file-system/legacy';

// REPLACE THESE with your values from the Cloudinary Dashboard
const CLOUD_NAME = 'dotkoejy5'; 
const UPLOAD_PRESET = 'ml_default'; 

export const uploadToCloudinary = async (fileUri: string): Promise<string> => {
  const apiUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  try {
    const response = await uploadAsync(apiUrl, fileUri, {
      httpMethod: 'POST',
      uploadType: FileSystemUploadType.BINARY_CONTENT,
      fieldName: 'file',
      parameters: {
        upload_preset: UPLOAD_PRESET,
      },
    });

    const data = JSON.parse(response.body);
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error('Upload failed: ' + response.body);
    }
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};
