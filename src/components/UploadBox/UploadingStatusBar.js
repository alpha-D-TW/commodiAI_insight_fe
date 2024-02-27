import React, {useEffect, useState} from 'react';
import { Progress, Upload } from 'antd';
import { useTranslation } from 'react-i18next';

import { ReactComponent as FileIcon } from '../../icons/file-icon.svg';
import styles from './index.module.scss';

const { Dragger } = Upload;

const MAX_PROGRESS = 80;

const UploadingStatusBar = ({ size }) => {
  const { t } = useTranslation();
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setPercent(prev => prev < MAX_PROGRESS ? prev + 1 : MAX_PROGRESS);
    }, 200)
  }, [])

  return (
    <div className={`${styles.uploadBox} ${styles.uploadingContainer} ${size === 'small' ? styles.sm : ''}`}>
      <Dragger openFileDialogOnClick={false}>
        <div className="ant-upload ant-upload-btn">
          <div className="ant-upload-drag-container">
            <div className={styles.progressContainer}>
              <p className="ant-upload-drag-icon">
                <FileIcon />
              </p>
              <p className="ant-upload-text">{t('label.file.uploading')}</p>
              <Progress percent={percent} showInfo={false} />
            </div>
          </div>
        </div>
      </Dragger>
    </div>
  );
};

export default UploadingStatusBar;
