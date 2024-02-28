import {useState} from 'react';
import {Button, Input, Tooltip} from 'antd';
import {useTranslation} from 'react-i18next';
import _ from "lodash";

import {ReactComponent as NewChatIcon} from '../../icons/chat-new-circle.svg';
import {ReactComponent as SendChatIcon} from '../../icons/chat-send.svg';
import {ReactComponent as SendChatDisabledIcon} from '../../icons/chat-send-disabled.svg';
import styles from './ChatBotSender.module.scss';

const checkOptionMatched = (option, question) => option.toUpperCase().indexOf(question.toUpperCase()) > -1;

const ChatBotSender = ({onStartNewChat, onSendChat, isLoading, questions}) => {
    const {t} = useTranslation();
    const [question, setQuestion] = useState('');

    const handleChat = async (q = question) => {
        if (q) {
            setQuestion('');
            onSendChat(q);
        }
    };

    return (
        <div className={`${styles.icons} ${styles.sendContainer}`}>
            <Tooltip title={t('operation.new_chat')}>
                <Button icon={<NewChatIcon/>} onClick={onStartNewChat}/>
            </Tooltip>
            <div className={styles.sendBox}>
                {/*<AutoComplete*/}
                {/*  options={_.map(questions, v => ({ value: v }))}*/}
                {/*  filterOption={(v, option) => !v || checkOptionMatched(option.value, v)}*/}
                {/*  defaultActiveFirstOption*/}
                {/*  backfill*/}
                {/*  style={{ width: '100%' }}*/}
                {/*  value={question}*/}
                {/*  disabled={isLoading}*/}
                {/*  onSearch={v => setQuestion(v)}*/}
                {/*  onSelect={handleChat}*/}
                {/*>*/}
                <Input.TextArea
                    placeholder={isLoading ? t('label.chat.loading') : t('label.chat.input_placeholder')}
                    autoSize={{maxRows: 4}}
                    size="large"
                    value={question}
                    onChange={e => {
                        setQuestion(e.target.value)
                    }}
                    onPressEnter={e => {
                        e.preventDefault();
                        const currentOption = question ? _.find(questions, item => checkOptionMatched(item, question)) : null;
                        if (!currentOption) {
                            handleChat(question);
                        }
                    }}
                />
                {/*</AutoComplete>*/}
                <Tooltip title={t('operation.send')}>
                    <Button
                        icon={isLoading ? <SendChatDisabledIcon/> : <SendChatIcon/>}
                        className={styles.sendBtn}
                        onClick={() => handleChat(question)}
                        disabled={isLoading}
                    />
                </Tooltip>
            </div>
        </div>
    );
};

export default ChatBotSender;
