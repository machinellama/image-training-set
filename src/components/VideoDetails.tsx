import React, { useEffect, useState } from 'react';
import { Button, Loading, NumberInput, TextInput } from 'finallyreact';
import { ImageUpload } from '@/types/ImageUpload';
import { useTranslation } from 'react-i18next';
import { VideoUpload } from '@/types/VideoUpload';
import videoToImages from '@/util/videoToImages';

import 'video-react/dist/video-react.css';

interface UploaderProps {
  videoUpload: VideoUpload;
  addImage: (image: ImageUpload, setSelected: boolean) => void;
  currentSeconds: number;
}

export function VideoDetails(props: UploaderProps) {
  const { t } = useTranslation('uploader');

  const [name, setName] = useState(props.videoUpload?.name);
  const [start, setStartTime] = useState(props.videoUpload?.start);
  const [end, setEndTime] = useState(props.videoUpload?.end);
  const [duration, setDuration] = useState(props.videoUpload?.duration);
  const [description, setDescription] = useState(props.videoUpload?.description);
  const [convertLoading, setConvertLoading] = useState(false);
  const [url, setUrl] = useState(props.videoUpload?.url);

  if (!props.videoUpload) {
    return null;
  }

  useEffect(() => {
    setName(props.videoUpload.name);
    setStartTime(props.videoUpload.start);
    setEndTime(props.videoUpload.end);
    setDuration(props.videoUpload.duration);
    setDescription(props.videoUpload.description);
    setUrl(props.videoUpload.url);
  }, [props.videoUpload]);

  return (
    <div>
      <p className="mt-1">{`${t('common:name')}: ${name}`}</p>
      <p>{`${t('common:type')}: video/mp4`}</p>
      <p>{`${t('common:duration')}: ${duration.toFixed(2)} ${t('common:seconds')}`}</p>
      <p>{`${t('currentTime')}: ${(props.currentSeconds || 0).toFixed(2)} ${t('common:seconds')}`}</p>

      <div className="block mb-1/2 mt-1-1/2 h-fit">
        <NumberInput
          type="number"
          value={start}
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
          value={end}
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
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
          placeholder={t('descriptionForAllImages')}
          className="mb-1 w-full h-fit"
          inputProps={{ className: 'w-full h-6' }}
        />
      </div>

      <div className="flex justify-content-end my-1">
        {convertLoading ? (
          <Loading rainbow={true} className="mt-1" />
        ) : (
          <>
            <Button
              className="mr-1"
              text={t('screenshot')}
              onClick={() => {
                setConvertLoading(true);
                videoToImages({ videoURL: url, startTime: props.currentSeconds, endTime: props.currentSeconds + 1 })
                  .then((images) => {
                    images.forEach((i) => {
                      i.description = description;
                      props.addImage(i, false);
                    });
                  })
                  .finally(() => {
                    setConvertLoading(false);
                  });
              }}
            />

            <Button
              color="blue-6"
              className="white"
              text={t('generateImages')}
              disabled={convertLoading || !start || !end || start >= end}
              onClick={() => {
                setConvertLoading(true);
                videoToImages({ videoURL: url, startTime: start, endTime: end + 1 })
                  .then((images) => {
                    images.forEach((i) => {
                      i.description = description;
                      props.addImage(i, false);
                    });
                  })
                  .finally(() => {
                    setConvertLoading(false);
                  });
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default VideoDetails;
