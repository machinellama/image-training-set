import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { ImageUpload } from '@/types/ImageUpload';
import { VideoUpload } from '@/types/VideoUpload';

import 'video-react/dist/video-react.css';

interface UploaderProps {
  addImage: (image: ImageUpload, setSelected: boolean) => void;
  setSelectedVideo: (video: VideoUpload) => void;
}

export function Uploader(props: UploaderProps) {
  const { t } = useTranslation('uploader');

  const convertToURL = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result.toString());
        } else {
          reject(t('failedToConvert'));
        }
      };
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const images: ImageUpload[] = [];
      for (const file of acceptedFiles) {
        const name = file.name;
        const type = file.type;
        const src = await convertToURL(file);

        if (file.type === 'video/mp4') {
          const fileUrl = URL.createObjectURL(file);
          props.setSelectedVideo({
            name,
            url: fileUrl,
            start: 1,
            end: 10,
            description: '',
            duration: 0
          });
        } else if (file.type === 'image/png' || file.type === 'image/jpeg') {
          images.push({
            name,
            type,
            src
          });
        }
      }
      images.forEach((image) => props.addImage(image, true));
    },
    [props]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/mp4': ['.mp4'], 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] }
  });

  return (
    <div>
      <div {...getRootProps()} className="h-full pointer border-1 border-stone-10 p-1 w-full">
        <input {...getInputProps()} />
        <div>{isDragActive ? <p>{t('uploadMP4Here')}</p> : <p>{t('uploadMessage')}</p>}</div>
      </div>
    </div>
  );
}

export default Uploader;
