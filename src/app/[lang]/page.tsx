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
  LeftArrowCircleIcon,
  Radio
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
import GlobalDetails from '@/components/GlobalDetails';

export default function () {
  const { t } = useTranslation('dashboard');
  const { isMobile, screenSize } = useWindowSize();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageUpload>(null);
  const [images, setImages] = useState([] as ImageUpload[]);
  const [selectedVideo, setSelectedVideo] = useState<VideoUpload>(null);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [downloadSize, setDownloadSize] = useState(512);

  const isTablet = screenSize === 'md' || isMobile;

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
          setCurrentSeconds(0);
        }
      }
    };

    const handleTimeUpdate = () => {
      if (playerRef.current && playerRef.current.video) {
        const currentTime = playerRef.current.video.video.currentTime;
        setCurrentSeconds(currentTime);
      }
    };

    const videoElement = playerRef.current?.video?.video;
    if (videoElement) {
      videoElement.disablePictureInPicture = true;
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, [selectedVideo, setCurrentSeconds]);

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
      setSelectedImage({ ...image, name: newName });
    }
  }

  function reset() {
    setSelectedImage(null);
    setSelectedVideo(null);
    setCurrentSeconds(0);
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

              <Uploader
                setSelectedVideo={(video: VideoUpload) => {
                  reset();
                  setSelectedVideo(video);
                }}
                addImage={addImage}
              />
            </div>

            {images?.length > 0 && (
              <div>
                {downloadLoading ? (
                  <Loading rainbow={true} className="mt-1 mr-1" />
                ) : (
                  <div className={isTablet ? 'block' : 'flex flex-multi align-center'}>
                    <Radio
                      options={[
                        {
                          label: t('sizeOne'),
                          value: '512'
                        },
                        {
                          label: t('sizeTwo'),
                          value: '768'
                        },
                        {
                          label: t('sizeThree'),
                          value: '1024'
                        }
                      ]}
                      onChange={(e: any) => setDownloadSize(Number(e.target.value))}
                      className="w-fit mr-1"
                      initialValue="512"
                    />

                    <Button
                      text={t('downloadZip')}
                      className="w-fit"
                      onClick={() => {
                        setDownloadLoading(true);
                        downloadZip({ images, downloadSize }).finally(() => {
                          setDownloadLoading(false);
                        });
                      }}
                      disabled={images.length === 0}
                    />
                  </div>
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
                        setImages(images.filter((image) => image.name !== selectedImage.name));
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

              <Row horizontalAlign="center">
                <img src={selectedImage.src} alt={t('selectedImage')} className="w-50" />
              </Row>
            </>
          ) : selectedVideo ? (
            <>
              <Row className="mb-1" verticalAlign="center">
                <div className="flex w-full justify-between">
                  <div />

                  <div className="flex">
                    <XCircleIcon className="pointer w-2" onClick={reset} />
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
          <div>
            <Card className="py-1 px-2 mb-1 sky-1-bg block" rounded={true} tabIndex={0}>
              <div className="block">
                <div>{`${t('common:name')}: ${selectedImage.name}`}</div>
                <div>{`${t('common:type')}: ${selectedImage.type}`}</div>

                <TextInput
                  className="h-fit mt-1-1/2"
                  type="textarea"
                  inputProps={{ className: 'w-full h-6' }}
                  value={selectedImage.description}
                  showClear={true}
                  onChange={(e: any) => {
                    const newImage = {
                      ...selectedImage,
                      description: e.target.value
                    };
                    setImages(images.map((image) => (image.name === selectedImage.name ? newImage : image)));
                    setSelectedImage(newImage);
                  }}
                  placeholder={t('imageDescription')}
                />

                <p className="mb-1/2">{t('autoSave')}</p>

                <div className="flex justify-end w-full">
                  <Button
                    text={t('takeFromPrevious')}
                    className="mr-1"
                    onClick={() => {
                      // take description from previous image
                      const index = images.findIndex((image) => image.name === selectedImage.name);
                      const previousIndex = index === 0 ? images.length - 1 : index - 1;
                      const previousImage = images[previousIndex];
                      setSelectedImage({ ...selectedImage, description: previousImage.description });
                      setImages(
                        images.map((image) =>
                          image.name === selectedImage.name
                            ? { ...image, description: previousImage.description }
                            : image
                        )
                      );
                    }}
                  />

                  <Button
                    text={t('applyToNext')}
                    className="mr-1"
                    onClick={() => {
                      // apply this description to the next image
                      const index = images.findIndex((image) => image.name === selectedImage.name);
                      const nextIndex = index === images.length - 1 ? 0 : index + 1;
                      const nextImage = images[nextIndex];
                      const newImage = { ...nextImage, description: selectedImage.description };
                      setImages(images.map((image) => (image.name === nextImage.name ? newImage : image)));
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>
        ) : selectedVideo ? (
          <Card className="py-1 px-2 mb-1 sky-1-bg block" rounded={true} tabIndex={0}>
            <VideoDetails videoUpload={selectedVideo} addImage={addImage} currentSeconds={currentSeconds} />
          </Card>
        ) : null}

        {(selectedImage || selectedVideo || images?.length > 0) && (
          <Card className="py-1 px-2 mb-1 sky-1-bg block" rounded={true} tabIndex={0}>
            <div className="semibold mb-1">{t('utility')}</div>

            <div className="mb-1/2">
              <GlobalDetails
                addToAllImages={(description: string) => {
                  // add description to the end of all image descriptions
                  setImages(images.map((image) => ({ ...image, description: `${image.description}, ${description}` })));
                  setSelectedImage({ ...selectedImage, description: `${selectedImage.description}, ${description}` });
                }}
                setToAllImages={(description: string) => {
                  // set description to all images
                  setImages(images.map((image) => ({ ...image, description })));
                  setSelectedImage({ ...selectedImage, description });
                }}
              />
            </div>
          </Card>
        )}

        <LicenseModal />
      </Column>
    </Row>
  );
}
