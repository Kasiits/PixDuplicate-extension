import Mellowtel from 'mellowtel';
import { MELLOWTEL_CONFIG_KEY } from '@/config/mellowtel';

const mellowtel = new Mellowtel(MELLOWTEL_CONFIG_KEY, { DISABLE_LOGS: false });

window.onload = async () => {
  console.log('[Options] Page loaded');

  const acceptBtn = document.querySelector('#accept') as HTMLButtonElement;
  const declineBtn = document.querySelector('#decline') as HTMLButtonElement;
  const switchElement = document.querySelector('#optedin') as HTMLInputElement;
  const emojiElement = document.querySelector('#emoji') as HTMLSpanElement;

  const hasOptedIn = await mellowtel.getOptInStatus();
  console.log('[Options] Initial opt-in status:', hasOptedIn);
  switchElement.checked = hasOptedIn;
  emojiElement.innerText = hasOptedIn ? "😀" : "😢";

  // If already opted in, make sure start() is called
  if (hasOptedIn) {
    await mellowtel.start();
    console.log('[Options] Already opted in — started');
  }

  acceptBtn.addEventListener('click', async () => {
    await mellowtel.optIn();
    const started = await mellowtel.start(); // ← Capture the return value
    if (started) {
      switchElement.checked = true;
      emojiElement.innerText = "😀";
      console.log('[Options] Opted in and started successfully');
    } else {
      console.error('[Options] Failed to start - check permissions');
      // Revert UI if start() failed
      switchElement.checked = false;
      emojiElement.innerText = "😢";
    }
  });

  declineBtn.addEventListener('click', async () => {
    await mellowtel.optOut();
    switchElement.checked = false;
    emojiElement.innerText = "😢";
    console.log('[Options] Opted out');
  });

  switchElement.addEventListener('change', async () => {
    if (switchElement.checked) {
      await mellowtel.optIn();
      const started = await mellowtel.start(); // ← Capture the return value
      if (started) {
        emojiElement.innerText = "😀";
        console.log('[Options] Toggle: opted in');
      } else {
        // Revert the toggle if it failed to start
        switchElement.checked = false;
        emojiElement.innerText = "😢";
        console.error('[Options] Toggle: failed to start');
      }
    } else {
      await mellowtel.optOut();
      emojiElement.innerText = "😢";
      console.log('[Options] Toggle: opted out');
    }
  });
};