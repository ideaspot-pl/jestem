import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('mark-attendance-root')
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<h1>Hello! From react!</h1>);
}
