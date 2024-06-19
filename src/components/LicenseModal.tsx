'use client';

import React, { useState } from 'react';
import { Modal, Button, Card } from 'finallyreact';
import { Trans, useTranslation } from 'react-i18next';

const GithubLogo = () => (
  <svg height="32" width="32" viewBox="0 0 16 16" fill="#000000">
    <path
      fillRule="evenodd"
      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
    ></path>
  </svg>
);

export default function () {
  const { t } = useTranslation('terms');
  const [showLicenseModal, setShowLicenseModal] = useState(false);

  return (
    <>
      <Card className="py-1 px-2 sky-1-bg" rounded={true} tabIndex={0}>
        <div className="block">
          <div>
            <Trans
              defaults={t('createdAndMaintained')}
              components={{
                span: (
                  <span
                    className="hover:blue-6 underline cursor-pointer mb-1"
                    tabIndex={0}
                    onClick={() => setShowLicenseModal(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setShowLicenseModal(true);
                      }
                    }}
                  />
                )
              }}
            />
          </div>

          <div className="mt-1">
            <Trans
              defaults={t('madeWith')}
              components={{
                a: <a className="black underline pointer" href="https://finallyreact.com" target="_blank" />
              }}
            />
          </div>
        </div>

        <div className="flex align-center mb-1 mt-1">
          <GithubLogo />
          <div className="ml-3/4">
            <Trans
              defaults={t('findOnGithub')}
              components={{
                a: <a className="black underline pointer pl-1/4" href="https://github.com/machinellama/video-to-image-set" target="_blank" />
              }}
            />
          </div>
        </div>
      </Card>

      <Modal
        headerProps={{
          className: 'stone-8-bg white'
        }}
        cardProps={{
          style: {
            width: '100%',
            maxWidth: '700px'
          }
        }}
        contentProps={{
          className: 'max-h-60 scroll-y'
        }}
        title={t('openSourceTitle')}
        onClose={() => setShowLicenseModal(false)}
        show={showLicenseModal}
      >
        <div className="m-1">
          <p tabIndex={0}>{t('mitLicense')}</p>

          <p tabIndex={0}>{t('licenseConditions')}</p>

          <p tabIndex={0}>{t('aboveNotice')}</p>

          <p tabIndex={0}>{t('softwareAsIs')}</p>
        </div>

        <div className="flex justify-content-end m-1">
          <Button
            color="blue-6"
            className="white"
            text={t('common:close')}
            onClick={() => setShowLicenseModal(false)}
          />
        </div>
      </Modal>
    </>
  );
}
