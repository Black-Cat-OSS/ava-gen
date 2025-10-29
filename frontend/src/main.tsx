import { createRoot } from 'react-dom/client';
import './shared/lib/utils/i18n';
import { App } from './app';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
