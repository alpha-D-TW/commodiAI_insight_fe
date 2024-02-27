import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Upload } from 'antd';

import { MAX_MB, SUPPORT_TYPE } from '../../constants';
import { checkFileTypeValid } from '../../utils/validator';
import { ReactComponent as FileIcon } from '../../icons/file-icon.svg';
import { ReactComponent as FileErrorIcon } from '../../icons/file-error.svg';
import styles from './index.module.scss';

const { Dragger } = Upload;

const UploadBox = ({
  className = '',
  size,
  iconTip,
  buttonText,
  uploadTips,
  supportedType = SUPPORT_TYPE.RECIPE,
  onChange,
  onUploadFailed,
  isSucceed,
  isWarning,
  icon,
}) => {
  const { t } = useTranslation();
  const [showWarning, setShowWarning] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const getUploadIcon = () => {
    if (isWarning) {
      return icon || FileErrorIcon;
    }
    if (showWarning) {
      return FileErrorIcon;
    }
    return FileIcon;
  };

  const checkFormatErr = file =>
    file && checkFileTypeValid(supportedType, file) ? '' : t(`error.${supportedType}.unsupported_file`);

  const checkSizeErr = file => (file.size < MAX_MB ? '' : t('error.file.over_limit'));

  const checkFileHasError = file => {
    const currentErr = checkFormatErr(file) || checkSizeErr(file);
    if (currentErr) {
      setShowWarning(true);
      setErrMsg(currentErr);
      if (onUploadFailed) {
        onUploadFailed(currentErr);
      }
    } else {
      setShowWarning(false);
      setErrMsg('');
    }
    return currentErr;
  };

  const handleCheckFile = file => (checkFileHasError(file) ? Upload.LIST_IGNORE : true);

  const handleUploadFile = async data => {
    if (data && data.file && !checkFileHasError(data.file)) {
      onChange(data.file);
    }
  };

  const renderIconTip = () => {
    if (isSucceed) {
      return <span className={styles.success}>{t(iconTip || 'label.file.upload_complete')}</span>;
    }
    if (isWarning || showWarning) {
      return <span className={styles.warning}>{t(errMsg || iconTip || 'label.file.upload_failed')}</span>;
    }
    return <span>{t(iconTip || 'label.file.dragging')}</span>;
  };

  const UploadIcon = getUploadIcon();
  return (
    <div className={`${styles.uploadBox} ${size === 'small' ? styles.sm : ''} ${className}`}>
      <Dragger multiple={false} beforeUpload={handleCheckFile} showUploadList={false} customRequest={handleUploadFile}>
        <p className="ant-upload-drag-icon">
          <UploadIcon />
        </p>
        <p className="ant-upload-text">{renderIconTip()}</p>
        <Button className={styles.uploadBtn} size="large" type="primary">
          {isWarning || isSucceed || showWarning ? t('operation.re_upload') : buttonText || t('operation.click_upload')}
        </Button>
        <p className="ant-upload-hint">{t(`warning.file.support_${supportedType}`)}</p>
        {uploadTips && <div className={styles.uploadTip}>{uploadTips}</div>}
      </Dragger>
    </div>
  );
};

export default UploadBox;
