import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Player } from 'video-react';
import { ImageUpload } from '@/types/ImageUpload';
import { Button, Loading, Modal, NumberInput, TextInput } from 'finallyreact';
import videoToImages from '@/util/videoToImages';

import 'video-react/dist/video-react.css';

interface UploaderProps {
  addImage: (image: ImageUpload) => void;
}

export function Uploader(props: UploaderProps) {
  const { t } = useTranslation('uploader');

  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoName, setVideoName] = useState('');
  const [startTime, setStartTime] = useState(1);
  const [endTime, setEndTime] = useState(10);
  const [duration, setDuration] = useState(0);
  const [descriptionsForAll, setDescriptionsForAll] = useState<string>('');
  const [convertLoading, setConvertLoading] = useState(false);

  const playerRef = useRef<any>(null);
  
  useEffect(() => {
    const handleLoadedMetadata = () => {
      if (playerRef.current && playerRef.current.video) {
        const duration = playerRef.current.video.video.duration;
        setDuration(duration);
      }
    };

    const videoElement = playerRef.current?.video?.video;
    if (videoElement) {
      videoElement.disablePictureInPicture = true;
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [videoFile]);

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
          setVideoFile(fileUrl);
          setVideoName(name);

          setShowVideoModal(true);
        } else if (file.type === 'image/png' || file.type === 'image/jpeg') {
          images.push({
            name,
            type,
            src
          });
        }
      }
      images.forEach(props.addImage);
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

      <Modal
        contentProps={{
          className: 'p-1'
        }}
        headerProps={{
          className: 'stone-8-bg white'
        }}
        title={t('videoDetails')}
        onClose={() => setShowVideoModal(false)}
        show={showVideoModal}
      >
        <p className="mt-1">{`${t('common:name')}: ${videoName}`}</p>
        <p>{`${t('common:type')}: video/mp4`}</p>
        <p> {`${t('common:duration')}: ${duration.toFixed(2)} ${t('common:seconds')}`}</p>

        {videoFile && (
          <div className="my-1/2">
            <Player ref={playerRef}>
              <source src={videoFile} type="video/mp4" />
            </Player>
          </div>
        )}

        <div className="block mb-1/2 mt-1 h-fit">
          <NumberInput
            type="number"
            value={startTime}
            onChange={(e: any) => setStartTime(parseInt(e.target.value))}
            placeholder={t('startTime')}
            className="mb-1 w-full"
            decimals={0}
            minDecimals={0}
            maxDecimals={0}
            min={0}
            max={duration}
          />
          <NumberInput
            type="number"
            value={endTime}
            onChange={(e: any) => setEndTime(parseInt(e.target.value))}
            placeholder={t('endTime')}
            className="mb-1 w-full"
            decimals={0}
            minDecimals={0}
            maxDecimals={0}
            min={0}
            max={duration}
          />

          <TextInput
            type="textarea"
            value={descriptionsForAll}
            onChange={(e: any) => setDescriptionsForAll(e.target.value)}
            placeholder={t('descriptionForAllImages')}
            className="mb-1 w-full h-fit"
            inputProps={{ className: 'w-30 h-4' }}
          />
        </div>

        <div className="flex justify-content-end my-1">
          {convertLoading ? (
            <Loading rainbow={true} className="mt-1" />
          ) : (
            <>
              <Button text="Close" className="mr-1" onClick={() => setShowVideoModal(false)} />
              <Button
                color="blue-6"
                className="white"
                text={t('generateImages')}
                disabled={convertLoading || !videoFile || !startTime || !endTime || startTime >= endTime}
                onClick={() => {
                  setConvertLoading(true);
                  videoToImages({ videoURL: videoFile, startTime, endTime })
                    .then((images) => {
                      images.forEach((i) => {
                        i.description = descriptionsForAll;
                        props.addImage(i);
                      });
                    })
                    .finally(() => {
                      setShowVideoModal(false);
                      setConvertLoading(false);
                    });
                }}
              />
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default Uploader;
