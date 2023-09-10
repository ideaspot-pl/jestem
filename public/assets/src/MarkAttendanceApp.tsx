import { createRoot } from 'react-dom/client';
import MarkAttendance from "./MarkAttendance";

const rootElement = document.getElementById('mark-attendance-root')
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<MarkAttendance />);
}
