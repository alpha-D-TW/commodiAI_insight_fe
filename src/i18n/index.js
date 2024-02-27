import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from 'react-i18next';

import cn from './cn.json'
import en from './en.json'
import {LANGUAGES} from "../constants";

const resources = {
	en: {
		translation: en
	},
	cn: {
		translation: cn
	}
};

i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.use(LanguageDetector)
	.init({
		resources,
		fallbackLng: LANGUAGES.EN,
		interpolation: {
			escapeValue: false // react already safes from xss
		}
	});

export default i18n;
