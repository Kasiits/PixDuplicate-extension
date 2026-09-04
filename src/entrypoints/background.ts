import Mellowtel from 'mellowtel';
import { MELLOWTEL_CONFIG_KEY } from '@/config/mellowtel';
import { storage } from '@wxt-dev/storage';

export default defineBackground(() => {
  const mellowtel = new Mellowtel(MELLOWTEL_CONFIG_KEY, { DISABLE_LOGS: false });

  const initializeMellowtel = async () => {
    try {
      await mellowtel.initBackground();
      console.log('[Mellowtel] initBackground() complete');

      // Resume sharing if user was opted in before the service worker restarted
      const optedIn = await mellowtel.getOptInStatus();
      if (optedIn) {
        await mellowtel.start();
        console.log('[Mellowtel] Service resumed');
      }
    } catch (error) {
      console.error('[Mellowtel] Failed:', error);
    }
  };

  // Run immediately when service worker wakes up
  initializeMellowtel();

  // Run on browser startup
  browser.runtime.onStartup.addListener(initializeMellowtel);

  // Run on install/update
  browser.runtime.onInstalled.addListener(async () => {
    const currentVersion = storage.defineItem<string>("local:currentVersion");
    const updateShown = storage.defineItem<boolean>("local:updateShown", { defaultValue: false });

    const newVersion = browser.runtime.getManifest().version;
    const currentVersionValue = await currentVersion.getValue();

    if (newVersion !== currentVersionValue) {
      await currentVersion.setValue(newVersion);
      await updateShown.setValue(false);

      const updateShownValue = await updateShown.getValue();
      if (!updateShownValue) {
        // Opens your CUSTOM UI page
        await browser.tabs.create({ url: browser.runtime.getURL("/options.html") });
        await updateShown.setValue(true);
      }
    }
  });
});