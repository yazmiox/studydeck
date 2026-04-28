import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AppContextProvider } from './context/AppContext';
import { ErrorBoundary } from './ErrorBoundary';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
        <ErrorBoundary>
            <AppContextProvider>
                <App />
            </AppContextProvider>
        </ErrorBoundary>
    );
}