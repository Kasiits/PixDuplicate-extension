import Mellowtel from 'mellowtel';
import { MELLOWTEL_CONFIG_KEY } from '@/config/mellowtel';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  allFrames: true,
  async main() {
    const mellowtel = new Mellowtel(MELLOWTEL_CONFIG_KEY, { DISABLE_LOGS: false });
    try {
      await mellowtel.initContentScript({
        pascoliFilePath: "pascoli.html",
        meucciFilePath: "meucci.js",
      });
      console.log('[Mellowtel] Content script initialized');
    } catch (error) {
      console.error('[Mellowtel] Content script failed:', error);
    }
  },
});