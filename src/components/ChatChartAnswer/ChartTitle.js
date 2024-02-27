import { useTranslation } from 'react-i18next';

import styles from './chart.module.scss';

const ChartTitle = ({ dimension, title, updatedDate }) => {
  const { t } = useTranslation();
  return (
    <>
      <p className={styles.title}>
        {title} ({t(`label.chat.period.${dimension}`)})
      </p>
      {updatedDate && (
        <p className={styles.tips}>
          *{t('label.chat.data_updated_tip')}
          {updatedDate}
        </p>
      )}
    </>
  );
};

export default ChartTitle;
