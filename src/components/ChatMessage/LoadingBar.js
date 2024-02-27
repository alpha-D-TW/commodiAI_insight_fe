import { useTranslation } from 'react-i18next';

import { ReactComponent as LoadingIcon } from '../../icons/loading.svg';
import styles from './LoadingBar.module.scss';

const LoadingBar = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.loadingBar}>
      <LoadingIcon className={styles.loadingIcon} />
      <span>{t('label.chat.loading')}</span>
    </div>
  );
};

export default LoadingBar;
