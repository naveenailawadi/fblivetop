import _ from 'lodash';
import { observable, decorate, action, computed } from 'mobx';
import { languagesKeys, languagesNames } from '../constants/enums/languagesEnum';
import { isValidLangKey } from '../CoreHelper';
import i18n from '../localization/i18n';

class AppStore {
    dataStore;

    constructor(dataStoreRef) {
        this.dataStore = dataStoreRef;
    }

    // Stored data
    data = {
        lang: isValidLangKey(localStorage._langKey) ? localStorage._langKey : 'EN'
    };

    // Loaders
    loaders = {};

    // Actions
    setValueByKey = (key, value) => {
        this.data[key] = value;
    };

    setLanguage = (langKey) => {
        if (Object.keys(languagesKeys).indexOf(langKey) === -1) return;
        this.setValueByKey('lang', langKey);

        i18n.changeLanguage(langKey)

        localStorage._langKey = langKey;
    }
}

decorate(AppStore, {
    data: observable,
    loaders: observable,
    setValueByKey: action,
});

export default AppStore;
