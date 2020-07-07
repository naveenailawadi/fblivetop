import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import validator from 'validator';

const StreamingForm = () => {
    const [minutes, setMinutes] = useState(1);
    const [fbAccounts, setFbAccounts] = useState(1);
    const [streamUrl, setStreamUrl] = useState('');

    const handleSubmitForm = () => {
        if (minutes < 1 || !_.isInteger(minutes)) return alert('Minutes should be an integer larger than 0.');
        if (fbAccounts < 1 || !_.isInteger(fbAccounts)) return alert('Facebook accounts should be an integer larger than 0.')

        if (!validator.isURL(streamUrl)) return alert('Stream url should be a valid URL.');

        // TODO: STREAM LINK
    }


    useEffect(() => {
        if (!_.isInteger(minutes))
            setMinutes(Math.floor(minutes))
        if (minutes < 1) setMinutes(1);
    }, [minutes])

    useEffect(() => {
        if (!_.isInteger(fbAccounts))
            setMinutes(Math.floor(fbAccounts))
        if (fbAccounts < 1) setFbAccounts(1);
    }, [fbAccounts])

    return (
        <div className="container-sm" style={{ maxWidth: '760px' }}>
            <div className="text-center mb-4 mt-5">
                <h1 className="h3 mb-3 font-weight-normal">Streaming Form</h1>
            </div>
            <div className="card">
                <div className="card-body">
                    <div>
                        <div className="form-group">
                            <label htmlFor="streamingFormMinutes">Number of minutes</label>
                            <input value={minutes} pattern="\d*" step="1" onChange={evt => setMinutes(evt.target.value)} min={1} type="number" className="form-control" id="streamingFormMinutes" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="streamingFormAccounts">Number of Facebook accounts</label>
                            <input value={fbAccounts} pattern="\d*" step="1" onChange={evt => setFbAccounts(evt.target.value)} min={1} type="number" className="form-control" id="streamingFormAccounts" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="streamingFormStreamUrl">Link to stream</label>
                            <input value={streamUrl} onChange={evt => setStreamUrl(evt.target.value)} className="form-control" id="streamingFormStreamUrl" />
                        </div>
                        <button className="btn btn-lg btn-primary btn-block" onClick={handleSubmitForm}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StreamingForm;
