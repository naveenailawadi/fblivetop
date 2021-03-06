import { client, processResponse, processErrorResponse } from "./Client";

export const checkStreamingCost = async ({ token, streamerCount, streamTime }) => {
    try {
        const res = await client({ headers: { token } }).post('/Streaming', { token, streamerCount, streamTime });
        return processResponse(res);
    } catch (err) {
        console.error(err);
        return processErrorResponse(err);
    }
};

export const streamLink = async ({ token, streamerCount, streamTime, streamUrl }) => {
    try {
        const res = await client({ headers: { token } }).put('/Streaming', { token, streamerCount, streamTime, streamUrl });
        return processResponse(res);
    } catch (err) {
        console.error(err);
        return processErrorResponse(err);
    }
};
