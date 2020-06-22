import React, { useState } from 'react';

const StreamingForm = () => {
    const [minutes, setMinutes] = useState(1);
    const [fbAccounts, setFbAccounts] = useState(1);
    const [streamUrl, setStreamUrl] = useState('');

    const handleSubmitForm = () => {
        // TODO: VALIDATE STREAM URL
    }

    return (
        <div className="container-sm" style={{ maxWidth: '760px' }}>
            <div className="text-center mb-4 mt-5">
                <h1 className="h3 mb-3 font-weight-normal">Streaming Form</h1>
            </div>
            <div className="card">
                <div className="card-body">
                    <div>
                        <div className="form-group">
                            <label for="streamingFormMinutes">Number of minutes</label>
                            <input value={minutes} onChange={evt => setMinutes(evt.target.value)} min={1} type="number" className="form-control" id="streamingFormMinutes" />
                        </div>
                        <div className="form-group">
                            <label for="streamingFormAccounts">Number of Facebook accounts</label>
                            <input value={fbAccounts} onChange={evt => setFbAccounts(evt.target.value)} min={1} type="number" className="form-control" id="streamingFormAccounts" />
                        </div>
                        <div className="form-group">
                            <label for="streamingFormStreamUrl">Link to stream</label>
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
