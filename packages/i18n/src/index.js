import i18next from 'i18next';
import en from './en.json' assert { type: 'json' };
import hi from './hi.json' assert { type: 'json' };
import ta from './ta.json' assert { type: 'json' };
import te from './te.json' assert { type: 'json' };

i18next.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
        en: { translation: en },
        hi: { translation: hi },
        ta: { translation: ta },
        te: { translation: te },
    },
    interpolation: { escapeValue: false },
});

export default i18next;
export { en, hi, ta, te };
