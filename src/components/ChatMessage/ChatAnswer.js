import {useTranslation} from 'react-i18next';
import _ from "lodash";

import ChatChartAnswer from '../ChatChartAnswer';
import TopBar from './TopBar';
import styles from './ChatAnswer.module.scss';
import {CHAT_ANSWER_TYPE} from '../../constants';
import {isNotEmptyArray} from "../../utils/formatter";

const ChatAnswer = ({ type, answer, isLastOne, onRefresh, isError, answerId, model }) => {
  const { t } = useTranslation();
  const isStrAnswer = type === CHAT_ANSWER_TYPE.STRING;
  const isJsonAnswer = type === CHAT_ANSWER_TYPE.JSON;
  const jsonAnswers = isJsonAnswer ? _.filter(answer, item => item?.s3key && item?.period) : null;

  const renderAnswer = () => {
    const errorText = t('label.chat.answer_type.error');
    if (isError) {
      return <p>{errorText}</p>;
    }
    if (isJsonAnswer && isNotEmptyArray(jsonAnswers)) {
      return (<>
        <p>这个是我们2.27的测试回答哈！</p>
        <ChatChartAnswer isLastOne={isLastOne} answer={jsonAnswers} answerId={answerId} model={model} />
      </>);
    }
    return <p>{isStrAnswer && answer ? answer : errorText}</p>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <TopBar
          isError={isError}
          answer={answer}
          isLastOne={isLastOne}
          onRefresh={onRefresh}
          isStrAnswer={isStrAnswer}
        />
        {renderAnswer()}
      </div>
    </div>
  );
};

export default ChatAnswer;
