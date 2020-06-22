import {languagesKeys} from './constants/enums/languagesEnum';

export const isValidLangKey = key => Object.keys(languagesKeys).indexOf(key) === -1 ? false : true;