import { useKioskStore } from '../store/index.js';
import i18n from '../../../packages/i18n/src/index.js';

export function useTranslation() {
    const lang = useKioskStore(s => s.language) || 'en';

    function t(key, options) {
        return i18n.t(key, { lng: lang, ...options });
    }

    return { t, lang };
}

