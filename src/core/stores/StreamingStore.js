import _ from 'lodash';
import { observable, decorate, action, computed } from 'mobx';
import * as StreamingAPI from '../api/StreamingAPI';
import { setCookie, eraseCookie } from '../../app/AppHelper';

class StreamingStore {
    dataStore;

    constructor(dataStoreRef) {
        this.dataStore = dataStoreRef;
    }

    // Stored data
    data = {
    };

    // Loaders
    loaders = {
        checkStreamingCost: false,
        getStreamingBotsAvailable: false,
        streamLink: false,
    };

    // Actions
    setValueByKey = (key, value) => {
        this.data[key] = value;
    };

    checkStreamingCost = async ({ token }) => {
        this.loaders.checkStreamingCost = true;

        const response = await StreamingAPI.checkStreamingCost({ token }).finally(
            () => {
                this.loaders.checkStreamingCost = false;
            }
        );

        return response;
    };

    getStreamingBotsAvailable = async ({ token }) => {
        this.loaders.getStreamingBotsAvailable = true;

        const response = await StreamingAPI.getStreamingBotsAvailable({ token }).finally(
            () => {
                this.loaders.getStreamingBotsAvailable = false;
            }
        );

        return response;
    };

    streamLink = async ({ token }) => {
        this.loaders.streamLink = true;

        const response = await StreamingAPI.streamLink({ token }).finally(
            () => {
                this.loaders.streamLink = false;
            }
        );

        return response;
    };
}

decorate(StreamingStore, {
    data: observable,
    loaders: observable,
    setValueByKey: action,
    checkStreamingCost: action,
    getStreamingBotsAvailable: action,
    streamLink: action,
});

export default StreamingStore;
