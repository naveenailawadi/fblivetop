import i18n from 'i18next';
import { languagesKeys } from '../constants/enums/languagesEnum';
import EN from './translations/EN.json';
import CH from './translations/CH.json';
import { isValidLangKey } from '../CoreHelper';

i18n.init({
    debug: true,
    lng: isValidLangKey(localStorage._langKey) ? localStorage._langKey : languagesKeys.EN,
    resources: {
        [languagesKeys.EN]: {
            "translation": EN
        },
        [languagesKeys.CH]: {
            "translation": CH
        },
    },
    react: {
        wait: false,
        bindI18n: 'languageChanged loaded',
        bindStore: 'added removed',
        nsMode: 'default'
    }
});

export default i18n;