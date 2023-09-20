import { createRoot } from 'react-dom/client';
import MarkAttendance from "./MarkAttendance";

import i18n from "i18next";
import {initReactI18next} from "react-i18next";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: require("../translations/messages.en.json")
            },
            pl: {
                translation: require("../translations/messages.pl.json")
            }
        },
        lng: "pl",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

const rootElement = document.getElementById('mark-attendance-root')
if (rootElement) {
    const eventCode = rootElement.dataset.eventCode;
    const root = createRoot(rootElement);
    root.render(<MarkAttendance eventCode={eventCode} />);
}
