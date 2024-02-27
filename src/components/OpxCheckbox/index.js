import { useTranslation } from 'react-i18next';

import styles from './index.module.scss';
import { useState } from 'react';

const OpxCheckbox = ({ disabled, onChange, color, defaultChecked, title, ignoreTranslation, size }) => {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(defaultChecked || false);

  const handleChange = e => {
    if (disabled) {
      return;
    }
    setChecked(e.target.checked);
    onChange(e.target.checked);
  };

  return (
    <label className={styles.container}>
      <span className={`${styles.checkbox} ${size === 'small' ? styles.sm : ''} ${checked ? styles.checked : ''}`}>
        <input
          className={`${styles.input} ${size === 'small' ? styles.sm : ''}`}
          onChange={handleChange}
          disabled={disabled}
          checked={checked}
          type="checkbox"
        />
        <span
          className={`${styles.inner} ${size === 'small' ? styles.sm : ''}`}
          style={color && checked ? { backgroundColor: color, borderColor: color } : null}
        />
      </span>
      <span className={size === 'small' ? styles.sm : ''}>{ignoreTranslation ? title : t(title)}</span>
    </label>
  );
};

export default OpxCheckbox;
