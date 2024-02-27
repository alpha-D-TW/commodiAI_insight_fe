import { Button, Tooltip } from 'antd';
import copy from 'copy-to-clipboard';
import { useTranslation } from 'react-i18next';

import { ReactComponent as InternalIcon } from '../../icons/chat-internal.svg';
import { ReactComponent as CopyIcon } from '../../icons/chat-copy.svg';
import { ReactComponent as RefreshIcon } from '../../icons/refresh.svg';
import { ReactComponent as ErrorIcon } from '../../icons/error-circle.svg';
import styles from './TopBar.module.scss';

const TopBar = ({ isError, isLastOne, onRefresh, isStrAnswer, answer }) => {
  const isAvailableStrAnswer = isStrAnswer && answer;
  const { t } = useTranslation();
  return (
    <div className={styles.topBar}>
      {isError ? (
        <div className={styles.errorLabel}>
          <ErrorIcon />
          <span>{t('label.chat.answer_type.error')}</span>
        </div>
      ) : (
        <div className={styles.label}>
          <InternalIcon />
          <span>{t('label.chat.answer_type.internal')}</span>
        </div>
      )}
      <div className={styles.actionBar}>
        {isLastOne && (
          <Tooltip title={t('operation.refresh_answer')}>
            <Button icon={<RefreshIcon className={styles.refreshIcon} />} onClick={onRefresh} />
          </Tooltip>
        )}
        <Tooltip title={t('operation.copy')}>
          <Button
            disabled={!isAvailableStrAnswer}
            icon={<CopyIcon />}
            onClick={() => (isAvailableStrAnswer ? copy(answer) : null)}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default TopBar;
