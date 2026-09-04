import { mount } from 'svelte';
import App from './App.svelte';
import '../../assets/css/index.css';
import Mellowtel from 'mellowtel'; // ← YOU WERE MISSING THIS LINE
import { MELLOWTEL_CONFIG_KEY } from '@/config/mellowtel';

const app = mount(App, {
  target: document.getElementById('app')!,
});

const mellowtel = new Mellowtel(MELLOWTEL_CONFIG_KEY);

export { mellowtel };
export default app;