import { Button, Divider, Select, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import _ from "lodash";

import { ReactComponent as ChatHistoryIcon } from '../../icons/chat-history.svg';
import { ReactComponent as ChatCloseIcon } from '../../icons/chat-close.svg';
import ChatBotLogo from '../../imgs/chatbot-logo.png';
import styles from './ChatBotHeader.module.scss';
import { GEN_AI_MODEL_TYPE } from '../../constants';

const ChatBotHeader = ({ onClickHistory, onClose, onShowDisclaimer, model, onSwitchModel }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.side}>
          <Tooltip title="History">
            <Button icon={<ChatHistoryIcon />} onClick={onClickHistory} />
          </Tooltip>
          <Divider type="vertical" />
          {/*<Select*/}
          {/*  defaultValue={model}*/}
          {/*  style={{ width: 150 }}*/}
          {/*  bordered={false}*/}
          {/*  options={_.values(GEN_AI_MODEL_TYPE).map(item => ({*/}
          {/*    value: item,*/}
          {/*    label: t(`label.knowledge.model.${item}`),*/}
          {/*  }))}*/}
          {/*  onChange={onSwitchModel}*/}
          {/*/>*/}
        </div>
        <div className={styles.logo}>
          <img src={ChatBotLogo} alt="Logo" />
        </div>
        <div className={styles.side}>
          <Button type="text" size="small" onClick={onShowDisclaimer}>
            {t('label.chat.safety_instructions')}
          </Button>
          <Divider type="vertical" />
          <Tooltip title="Close">
            <Button icon={<ChatCloseIcon />} onClick={onClose} />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ChatBotHeader;
