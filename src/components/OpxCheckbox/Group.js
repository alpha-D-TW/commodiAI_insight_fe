import OpxCheckbox from './index';
import _ from "lodash";

import styles from './Group.module.scss';

const OpxCheckboxGroup = ({ className, options, defaultValue, onChange, size }) => {
  const handleChange = (key, checked) => {
    const newValues = checked ? _.uniq(_.concat(defaultValue, key)) : _.without(defaultValue, key);
    onChange(newValues);
  };

  return (
    <div className={`${styles.container} ${size === 'small' ? styles.sm : ''} ${className || ''}`}>
      {_.map(options, ({ value, title, color, ignoreTranslation }) => (
        <OpxCheckbox
          key={value}
          title={title}
          color={color}
          size={size}
          ignoreTranslation={ignoreTranslation}
          onChange={checked => handleChange(value, checked)}
          defaultChecked={_.includes(defaultValue, value)}
        />
      ))}
    </div>
  );
};

export default OpxCheckboxGroup;
