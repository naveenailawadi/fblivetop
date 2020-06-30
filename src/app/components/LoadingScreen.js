import React from 'react';

const LoadingScreen = () => {
    return (<div style={{ height: '100vh', width: '100vw', fontSize: '2rem' }} className="d-flex w-100 align-items-center justify-content-center">
        <div className="spinner-border" role="status" style={{ width: '4rem', height: '4rem' }}>
            <span className="sr-only">Loading...</span>
        </div>
    </div>)
}

export default LoadingScreen;
