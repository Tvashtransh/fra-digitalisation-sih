import { createRoot } from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/theme-provider';
import './output.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <App />
  </ThemeProvider>
);