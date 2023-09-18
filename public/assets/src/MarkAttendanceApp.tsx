import { createRoot } from 'react-dom/client';
import MarkAttendance from "./MarkAttendance";

const rootElement = document.getElementById('mark-attendance-root')
if (rootElement) {
    const eventCode = rootElement.dataset.eventCode;
    const root = createRoot(rootElement);
    root.render(<MarkAttendance eventCode={eventCode} />);
}
