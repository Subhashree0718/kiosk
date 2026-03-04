import i18next from 'i18next';
import en from './en.json' assert { type: 'json' };
import hi from './hi.json' assert { type: 'json' };
import ta from './ta.json' assert { type: 'json' };
import te from './te.json' assert { type: 'json' };
import mr from './mr.json' assert { type: 'json' };
import gu from './gu.json' assert { type: 'json' };
import ur from './ur.json' assert { type: 'json' };
import ml from './ml.json' assert { type: 'json' };
import kn from './kn.json' assert { type: 'json' };
import as from './as.json' assert { type: 'json' };

i18next.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
        en: { translation: en },
        hi: { translation: hi },
        ta: { translation: ta },
        te: { translation: te },
        mr: { translation: mr },
        gu: { translation: gu },
        ur: { translation: ur },
        ml: { translation: ml },
        kn: { translation: kn },
        as: { translation: as },
    },
    interpolation: { escapeValue: false },
});

export default i18next;
export { en, hi, ta, te, mr, gu, ur, ml, kn, as };
