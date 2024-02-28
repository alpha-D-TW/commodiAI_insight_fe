import {Button, Empty, Popconfirm} from 'antd';
import {useTranslation} from 'react-i18next';
import _ from "lodash";

import {formatFloatToLocaleWithDecimal, isNotEmptyArray} from '../../utils/formatter';
import {ReactComponent as CarrotRightIcon} from '../../icons/carrot-right.svg';
import {ReactComponent as TrashIcon} from '../../icons/trash.svg';
import styles from './AllHistoryList.module.scss';

const HISTORY_GROUP = [
    {
        key: 'today',
        func: d => d === 0,
    },
    {
        key: 'yesterday',
        func: d => d === 1,
    },
    {
        key: 'this_week',
        func: d => d > 1 && d < 7,
    },
    {
        key: 'before_this_week',
        func: d => d > 7,
    },
];

const AllHistoryList = ({currentSessionId, allHistory, onClickHistory, onDeleteChat, onStartNewChat}) => {
    const {t} = useTranslation();
    const renderHistoryList = ({historyId, question, chatCount}) => {
        const isActive = currentSessionId === historyId;
        return (
            <div key={historyId} className={`${styles.dialogue} ${isActive ? styles.active : ''}`}
                 style={{width: '230px'}}>
                <div className={styles.left} onClick={() => onClickHistory(historyId)}>
                    <p className={styles.question}>{question}</p>
                    <p>
                        <span className={styles.count}>{formatFloatToLocaleWithDecimal(chatCount, 0)}</span>
                        <span className={styles.unit}>
              {t(chatCount > 1 ? 'label.chat.conversations' : 'label.chat.conversation')}
            </span>
                    </p>
                </div>
                {isActive ? (
                    <div className={styles.actions}>
                        {/*<Button size="small" icon={<EditIcon />} disabled />*/}
                        <Popconfirm
                            title={t('label.chat.delete_chat_tip')}
                            description={null}
                            onConfirm={onDeleteChat}
                            okText={t('operation.confirm')}
                            cancelText={t('operation.cancel')}
                        >
                            <Button size="small" icon={<TrashIcon/>}/>
                        </Popconfirm>
                    </div>
                ) : (<div className={styles.rightIcon}>
                    <CarrotRightIcon/>
                </div>)}
            </div>
        );
    };

    const renderHistoryGroup = ({key, func}, index) => {
        const currentRes = _.filter(allHistory, item => item?.historyId && item?.question && func(item.daysBeforeToday));
        return isNotEmptyArray(currentRes) ? (
            <div key={key} className={index ? styles.group : ''}>
                <p className={styles.time}>{t(`label.chat.period.${key}`)}</p>
                {_.map(currentRes, renderHistoryList)}
            </div>
        ) : null;
    };

    return (
        <>
            {/*<div className={styles.newChatBtn}>*/}
            {/*  <Button type="primary" shape="round" block ghost onClick={onStartNewChat}>*/}
            {/*    <NewChatIcon />*/}
            {/*    {t('operation.new_chat')}*/}
            {/*  </Button>*/}
            {/*</div>*/}
            <div className={styles.container}>
                <div className={styles.content}>
                    {isNotEmptyArray(allHistory) ? _.map(HISTORY_GROUP, renderHistoryGroup) : <Empty/>}
                </div>
            </div>
        </>
    );
};

export default AllHistoryList;
