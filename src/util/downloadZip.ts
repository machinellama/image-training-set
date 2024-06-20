import JSZip from 'jszip';
import { ImageUpload } from '@/types/ImageUpload';

// Function to fetch a Blob from a blob URL
const fetchBlob = async (blobUrl) => {
  try {
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.blob();
  } catch (error) {
    console.error('Error fetching blob:', error);
    return null;
  }
};

// Function to convert a data URL to a Blob
const dataURLToBlob = (dataURL) => {
  try {
    const arr = dataURL.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error('Invalid data URL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (error) {
    console.error('Error converting data URL to Blob:', error);
    return null;
  }
};

// Function to resize image to downloadSize while keeping aspect ratio
const resizeToCommonSize = async (file, downloadSize) => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > downloadSize) {
          height = Math.round((height *= downloadSize / width));
          width = downloadSize;
        }
      } else {
        if (height > downloadSize) {
          width = Math.round((width *= downloadSize / height));
          height = downloadSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        resolve(blob);
      }, file.type);
    };
    img.onerror = (error) => reject(error);
    img.src = URL.createObjectURL(file);
  });
};

// Function to convert a Blob to a File
const blobToFile = (blob, fileName) => {
  if (!blob) {
    throw new Error('Invalid Blob');
  }
  return new File([blob], fileName, { type: blob.type });
};

// Function to add a URL (blob or data) as a file to a zip archive
const addURLToZip = async (url, fileName, zip, downloadSize) => {
  let blob;

  if (url.startsWith('blob:')) {
    blob = await fetchBlob(url);
  } else if (url.startsWith('data:')) {
    blob = dataURLToBlob(url);
  } else {
    throw new Error('Unsupported URL type');
  }

  if (!blob) {
    throw new Error('Failed to create Blob from URL');
  }

  const resizedBlob = await resizeToCommonSize(blob, downloadSize);
  const file = blobToFile(resizedBlob, fileName);
  zip.file(fileName, file);
};

export default async function ({ images, downloadSize }: { images: ImageUpload[], downloadSize: number }): Promise<void> {
  const zip = new JSZip();

  for (let i = 0; i < images.length; i++) {
    const image = images[i];

    const dataURL = image.src;
    const filename = `${image.name}.png`;
    await addURLToZip(dataURL, filename, zip, downloadSize);

    const textFileName = `${image.name}.txt`;
    const description = image.description;
    zip.file(textFileName, description);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'images.zip';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
