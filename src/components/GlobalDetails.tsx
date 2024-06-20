import React, { useState } from 'react';
import { Button, Row, TextInput } from 'finallyreact';
import { useTranslation } from 'react-i18next';

import 'video-react/dist/video-react.css';

interface GlobalDetailsProps {
  addToAllImages: (description: string) => void;
  setToAllImages: (description: string) => void;
}

export function GlobalDetails(props: GlobalDetailsProps) {
  const { t } = useTranslation('dashboard');

  const [addToAllDescription, setAddToAllDescription] = useState('');
  const [setToAllDescription, setSetToAllDescription] = useState('');

  return (
    <div>
      <Row verticalAlign="center" className="mb-1 mt-1 h-fit">
        <TextInput
          type="textarea"
          value={addToAllDescription}
          onChange={(e: any) => setAddToAllDescription(e.target.value)}
          placeholder={t('addToAllImages')}
          className="mb-1/2 w-full h-fit"
          inputProps={{ className: 'w-full h-6' }}
        />

        <div className="w-full flex justify-end">
          <Button
            text={t('addToAllImages')}
            onClick={() => {
              props.addToAllImages(addToAllDescription);
            }}
          />
        </div>
      </Row>

      <Row verticalAlign="center" className="mb-1 mt-1 h-fit">
        <TextInput
          type="textarea"
          value={setToAllDescription}
          onChange={(e: any) => setSetToAllDescription(e.target.value)}
          placeholder={t('setToAllImages')}
          className="mb-1/2 w-full h-fit"
          inputProps={{ className: 'w-full h-6' }}
        />

        <div className="w-full flex justify-end">
          <Button
            text={t('setToAllImages')}
            onClick={() => {
              props.setToAllImages(setToAllDescription);
            }}
          />
        </div>
      </Row>
    </div>
  );
}

export default GlobalDetails;
