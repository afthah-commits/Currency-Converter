import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="bento-card" style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
                    <h3>Something went wrong.</h3>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>{this.state.error?.message}</p>
                    <button
                        className="btn-linear"
                        style={{ marginTop: '1rem' }}
                        onClick={() => window.location.reload()}
                    >
                        Reload App
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
