'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Row,
  useWindowSize,
  classnames,
  Card,
  TextInput,
  Button,
  Column,
  Loading,
  XCircleIcon,
  DeleteIcon,
  RightArrowCircleIcon,
  LeftArrowCircleIcon
} from 'finallyreact';
import { ImageUpload } from '@/types/ImageUpload';
import { VideoUpload } from '@/types/VideoUpload';
import { useTranslation } from 'react-i18next';
import downloadZip from '@/util/downloadZip';
import LicenseModal from '@/components/LicenseModal';
import Uploader from '@/components/Uploader';
import VideoDetails from '@/components/VideoDetails';
import { Player } from 'video-react';

import '../../translations/i18n';

export default function () {
  const { t } = useTranslation('dashboard');
  const { isMobile } = useWindowSize();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageUpload>(null);
  const [images, setImages] = useState([] as ImageUpload[]);
  const [selectedVideo, setSelectedVideo] = useState<VideoUpload>(null);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const playerRef = useRef<any>(null);

  useEffect(() => {
    const handleLoadedMetadata = () => {
      if (playerRef.current && playerRef.current.video) {
        const duration = playerRef.current.video.video.duration;
        if (selectedVideo) {
          setSelectedVideo({ ...selectedVideo, duration });
        }
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
  }, [selectedVideo]);

  function addImage(image: ImageUpload, setSelected = true) {
    let newName = image.name;
    if (newName.includes('.png')) newName = newName.replace('.png', '');
    let count = 1;
    while (images.some((i: ImageUpload) => i.name === newName)) {
      newName = `${newName}_${count}`;
      count++;
    }
    setImages((prev) => [...prev, { ...image, name: newName }]);

    if (setSelected) {
      setSelectedImage(image);
    }
  }

  return (
    <Row className="mt-1 h-full mb-4">
      <Column xs={100} md={50}>
        <Card
          className="py-1 px-2 mb-1 sky-1-bg flex"
          rounded={true}
          tabIndex={0}
          contentProps={{ className: 'w-full' }}
        >
          <div className={classnames(isMobile ? 'block' : 'flex w-full justify-between align-center')}>
            <div>
              <div className="semibold lava-6 mb-1">{t('lostData')}</div>

              <Uploader setSelectedVideo={setSelectedVideo} addImage={addImage} />
            </div>

            {images?.length > 0 && (
              <div>
                {downloadLoading ? (
                  <Loading rainbow={true} className="mt-1 mr-1" />
                ) : (
                  <Button
                    text={t('downloadZip')}
                    className="w-fit"
                    onClick={() => {
                      setDownloadLoading(true);
                      downloadZip({ images }).finally(() => {
                        setDownloadLoading(false);
                      });
                    }}
                    disabled={images.length === 0}
                  />
                )}
              </div>
            )}
          </div>
        </Card>

        <Card className="py-1 px-2 mb-1 sky-1-bg block h-fit" rounded={true} tabIndex={0}>
          <div className="text-sm mb-1/2">{`Images: ${images?.length ?? 0}`}</div>

          {selectedImage ? (
            <>
              <Row className="mb-1" verticalAlign="center">
                <div className="flex w-full justify-between">
                  <div>
                    <LeftArrowCircleIcon
                      className="pointer mr-1 w-2"
                      onClick={() => {
                        const index = images.findIndex((image) => image.name === selectedImage.name);
                        const newIndex = index === 0 ? images.length - 1 : index - 1;
                        setSelectedImage(images[newIndex]);
                      }}
                    />

                    <RightArrowCircleIcon
                      className="pointer mr-1 w-2"
                      onClick={() => {
                        const index = images.findIndex((image) => image.name === selectedImage.name);
                        const newIndex = index === images.length - 1 ? 0 : index + 1;
                        setSelectedImage(images[newIndex]);
                      }}
                    />
                  </div>

                  <div className="flex">
                    <DeleteIcon
                      className="pointer mr-1 w-2"
                      onClick={() => {
                        setImages((prev) => prev.filter((image) => image.name !== selectedImage.name));
                        setSelectedImage(null);
                      }}
                    />

                    <XCircleIcon
                      className="pointer w-2"
                      onClick={() => {
                        setSelectedImage(null);
                      }}
                    />
                  </div>
                </div>
              </Row>

              <Row>
                <img src={selectedImage.src} alt={t('selectedImage')} className="w-50" />
              </Row>
            </>
          ) : selectedVideo ? (
            <>
              <Row className="mb-1" verticalAlign="center">
                <div className="flex w-full justify-between">
                  <div />

                  <div className="flex">
                    <XCircleIcon
                      className="pointer w-2"
                      onClick={() => {
                        setSelectedImage(null);
                        setSelectedVideo(null);
                      }}
                    />
                  </div>
                </div>
              </Row>

              <Row>
                <Player ref={playerRef}>
                  <source src={selectedVideo?.url} type="video/mp4" className="max-w-50" />
                </Player>
              </Row>
            </>
          ) : images.length > 0 ? (
            <div className="flex flex-multi">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={classnames(
                    'w-6 h-6 p-1 pointer',
                    selectedImage?.name === image.name && 'lavender-2-bg border-black border-1'
                  )}
                  onClick={() => {
                    setSelectedImage(image);
                    scrollTop();
                  }}
                >
                  <img src={image.src} alt={image.name} className="w-6 h-6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-center h-full">{t('noImages')}</div>
          )}
        </Card>
      </Column>

      <Column xs={100} md={50}>
        {selectedImage ? (
          <Card>
            <Card className="py-1 px-2 mb-1 sky-1-bg block" rounded={true} tabIndex={0}>
              <div className="block">
                <div>{`${t('common:name')}: ${selectedImage.name}`}</div>
                <div>{`${t('common:type')}: ${selectedImage.type}`}</div>

                <TextInput
                  className="h-fit mt-1-1/2 mb-1"
                  type="textarea"
                  inputProps={{ className: 'w-full h-6' }}
                  value={selectedImage.description}
                  showClear={true}
                  onChange={(e: any) => {
                    const newImage = {
                      ...selectedImage,
                      description: e.target.value
                    };
                    setSelectedImage(newImage);
                    setImages((prev) => prev.map((image) => (image.name === selectedImage.name ? newImage : image)));
                  }}
                  placeholder={t('imageDescription')}
                />
              </div>
            </Card>

            <LicenseModal />
          </Card>
        ) : selectedVideo ? (
          <Card className="py-1 px-2 mb-1 sky-1-bg block" rounded={true} tabIndex={0}>
            <VideoDetails videoUpload={selectedVideo} addImage={addImage} />
          </Card>
        ) : (
          <Card className="py-1 px-2 mb-1 sky-1-bg flex" rounded={true} tabIndex={0}>
            {t('uploadAndSelect')}
          </Card>
        )}
      </Column>
    </Row>
  );
}
