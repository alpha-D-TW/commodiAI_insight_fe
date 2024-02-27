import { useTranslation } from 'react-i18next';
import { Upload } from 'antd';

import { ReactComponent as FileIcon } from '../../icons/file-icon.svg';
import styles from './index.module.scss';

const { Dragger } = Upload;

const UploadSuccessBox = ({ size, uploadText, uploadTips }) => {
  const { t } = useTranslation();
  return (
    <div className={`${styles.uploadBox} ${styles.uploadingContainer} ${size === 'small' ? styles.sm : ''}`}>
      <Dragger openFileDialogOnClick={false}>
        <div className="ant-upload ant-upload-btn">
          <div className="ant-upload-drag-container">
            <p className="ant-upload-drag-icon">
              <FileIcon />
            </p>
            <p className="ant-upload-text">{uploadText || t('label.file.upload_complete')}</p>
            {uploadTips && <div className={styles.uploadTip}>{uploadTips}</div>}
          </div>
        </div>
      </Dragger>
    </div>
  );
};

export default UploadSuccessBox;
