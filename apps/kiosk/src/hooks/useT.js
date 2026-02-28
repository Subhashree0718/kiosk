/**
 * useT — Translation hook
 * Returns a `t(en, hi)` function that picks the right string based on the kiosk language.
 * Usage:  const t = useT();
 *         t('Pay Now', 'भुगतान करें')    → 'Pay Now' or 'भुगतान करें'
 *
 * Also returns the current `lang` string ('en' | 'hi') and an `isHindi` boolean.
 */
import { useKioskStore } from '../store/index.js';

export function useT() {
    const lang = useKioskStore(s => s.language) || 'en';
    const isHindi = lang === 'hi';

    function t(en, hi) {
        return isHindi ? hi : en;
    }

    return { t, lang, isHindi };
}
