import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import _ from "lodash";

import {isNotEmptyArray} from "../../utils/formatter";
import styles from './SampleQuestions.module.scss';

const SampleQuestions = ({ data, onClickQuestion }) => {
  const { t } = useTranslation();
  const renderQuestionList = ({ category, questions }) => (
    <li key={category} className={styles.section}>
      <h3>{category}</h3>
      <div className={styles.questionList}>
        {_.map(_.slice(questions, 0, 4), item => (
          <Button key={item} type="primary" ghost className={styles.questionBtn} onClick={() => onClickQuestion(item)}>
            {item}
          </Button>
        ))}
      </div>
    </li>
  );

  return isNotEmptyArray(data) ? (
    <div>
      <h2 className={styles.title}>{t('label.chat.sample_placeholder')}</h2>
      <ul>{_.map(data, renderQuestionList)}</ul>
    </div>
  ) : null;
};

export default SampleQuestions;
