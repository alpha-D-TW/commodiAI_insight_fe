import ChatAnswer from './ChatAnswer';
import LoadingBar from './LoadingBar';
import styles from './index.module.scss';
import { CHAT_ANSWER_TYPE } from '../../constants';

const ChatMessage = ({ data, index, isLastOne, loading, isError, onChat, model }) => {
  const { question, type, strAnswer, jsonAnswer, answerId, questionId } = data || {};
  const showLoading = isLastOne && loading;

  return (
    <div key={questionId} className={!index ? '' : styles.group}>
      <div className={styles.question}>
        <p>{question}</p>
      </div>
      {showLoading && <LoadingBar />}
      {!showLoading && (
        <ChatAnswer
          type={type}
          answer={type === CHAT_ANSWER_TYPE.JSON ? jsonAnswer : strAnswer}
          isError={isLastOne && isError}
          answerId={answerId}
          isLastOne={isLastOne}
          onRefresh={() => onChat(question, questionId)}
          model={model}
        />
      )}
    </div>
  );
};

export default ChatMessage;
