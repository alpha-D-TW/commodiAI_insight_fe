import { useTranslation } from 'react-i18next';

const Translation = ({ text, params }) => {
  const { t } = useTranslation();
  return <span>{params ? t(text, params) : t(text)}</span>;
};

export default Translation;
