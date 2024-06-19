'use client';

import React, { useState } from 'react';
import { Row, useWindowSize, classnames, Card, TextInput, Button, Column, Loading } from 'finallyreact';
import { ImageUpload } from '@/types/ImageUpload';
import { useTranslation } from 'react-i18next';
import downloadZip from '@/util/downloadZip';
import LicenseModal from '@/components/LicenseModal';
import Uploader from '@/components/Uploader';

import '../../translations/i18n';

export default function () {
  const { t } = useTranslation('dashboard');
  const { isMobile } = useWindowSize();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageUpload>(null);
  const [images, setImages] = useState([] as ImageUpload[]);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                addImage={(image: ImageUpload) => {
                  let newName = image.name;
                  if (newName.includes('.png')) newName = newName.replace('.png', '');
                  let count = 1;
                  while (images.some((i: ImageUpload) => i.name === newName)) {
                    newName = `${newName}_${count}`;
                    count++;
                  }
                  setImages((prev) => [...prev, { ...image, name: newName }]);
                }}
              />
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

          {images.length > 0 ? (
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
          <>
            <Card className="py-1 px-2 mb-1 sky-1-bg block" rounded={true} tabIndex={0}>
              <div className="block">
                <div>{`${t('common:name')}: ${selectedImage.name}`}</div>
                <div>{`${t('common:type')}: ${selectedImage.type}`}</div>

                <TextInput
                  className="h-fit mt-1-1/2 mb-1"
                  type="textarea"
                  inputProps={{ className: 'w-30 h-4' }}
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

              <div className="w-full flex justify-end">
                <Button
                  className="w-fit mb-1/2"
                  onClick={() => {
                    setImages((prev) => prev.filter((image) => image.name !== selectedImage.name));
                    setSelectedImage(null);
                  }}
                  text={t('deleteImage')}
                />
              </div>
            </Card>

            <Card
              className="py-1 px-2 mb-1 sky-1-bg flex scroll-y scroll-x max-w-60 max-h-60"
              rounded={true}
              tabIndex={0}
            >
              <img src={selectedImage.src} alt={t('selectedImage')} />
            </Card>

            <LicenseModal />
          </>
        ) : (
          <Card className="py-1 px-2 mb-1 sky-1-bg flex" rounded={true} tabIndex={0}>
            {t('uploadAndSelect')}
          </Card>
        )}
      </Column>
    </Row>
  );
}
