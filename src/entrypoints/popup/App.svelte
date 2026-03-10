<script lang="ts">
  import Router from 'svelte-spa-router';
  import {link} from 'svelte-spa-router';
  import {push, location} from 'svelte-spa-router';
  import { storage } from '@wxt-dev/storage';
  import Home from '../pages/Home.svelte';
  import Second from '../pages/Second.svelte';
  import Third from '../pages/Third.svelte'

  const routes = {
    '/': Home,
    '/second': Second,
    '/third': Third
  };

  // Load last route when popup opens
  let initialRouteLoaded = false;
  storage.getItem<string>('local:lastRoute').then((lastRoute) => {
    if (lastRoute && lastRoute !== '/' && !initialRouteLoaded) {
      push(lastRoute);
    }
    initialRouteLoaded = true;
  });

  // Save route when it changes
  $: {
    if ($location && initialRouteLoaded) {
      storage.setItem('local:lastRoute', $location);
    }
  }
</script>

<main class="mx-2 mt-2">
  <div class="flex justify-center mb-4">
    <div class="tabs tabs-boxed bg-base-100">
      <ul class="flex space-x-1">
        <li class="rounded">
          <a href="/" 
             use:link
             class="tab flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-base-300
                   {$location === '/' 
                     ? 'tab-active bg-primary text-primary-content hover:!text-primary-content' 
                     : 'hover:bg-base-300'}">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 512 512">
              <path fill="currentColor" d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm-6 336H54a6 6 0 0 1-6-6V118a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v276a6 6 0 0 1-6 6zM128 152c-22.091 0-40 17.909-40 40s17.909 40 40 40s40-17.909 40-40s-17.909-40-40-40zM96 352h320v-80l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L192 304l-39.515-39.515c-4.686-4.686-12.284-4.686-16.971 0L96 304v48z"/>
            </svg>
            <span class="text-sm">Image Search</span>
          </a>
        </li>
        <li class="rounded">
          <a href="/second" 
             use:link
             class="tab flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-base-300
                   {$location === '/second' 
                     ? 'tab-active bg-primary text-primary-content hover:!text-primary-content' 
                     : 'hover:bg-base-300'}">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 512 512">
              <path fill="currentColor" d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm-6 336H54a6 6 0 0 1-6-6V118a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v276a6 6 0 0 1-6 6zM128 152c-22.091 0-40 17.909-40 40s17.909 40 40 40s40-17.909 40-40s-17.909-40-40-40zM96 352h320v-80l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L192 304l-39.515-39.515c-4.686-4.686-12.284-4.686-16.971 0L96 304v48z"/>
            </svg>
            <span class="text-sm">System Search</span>
          </a>
        </li>
        <li class="rounded">
          <a href="/third" 
             use:link
             class="tab flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-base-300
                   {$location === '/third' 
                     ? 'tab-active bg-primary text-primary-content hover:!text-primary-content' 
                     : 'hover:bg-base-300'}">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 512 512">
              <path fill="currentColor" d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.4-8.6 5.8-14.4c-11.1-34.6-30-67.4-55.4-92.7c-3.6-3.7-8.9-4.9-13.9-3.2l-42.6 24.6c-18-13.7-38.7-24.4-60.9-30.8V33c0-5.5-3.5-10.4-8.8-11.7c-36.7-8.9-75.3-7.3-110.6 4.7c-5.2 1.8-8.7 6.8-8.7 12.2v49.1c-22.2 6.4-42.9 17.1-60.9 30.8L83.1 85.5c-5-1.7-10.3-.5-13.9 3.2c-25.4 25.3-44.3 58.1-55.4 92.7c-1.6 5.8.9 11.6 5.8 14.4l42.6 24.6c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.4 8.6-5.8 14.4c11.1 34.6 30 67.4 55.4 92.7c3.6 3.7 8.9 4.9 13.9 3.2l42.6-24.6c18 13.7 38.7 24.4 60.9 30.8v49.1c0 5.5 3.5 10.4 8.8 11.7c36.7 8.9 75.3 7.3 110.6-4.7c5.2-1.8 8.7-6.8 8.7-12.2v-49.1c22.2-6.4 42.9-17.1 60.9-30.8l42.6 24.6c5 1.7 10.3.5 13.9-3.2c25.4-25.3 44.3-58.1 55.4-92.7c1.5-5.8-.9-11.6-5.8-14.4zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80s80 35.9 80 80s-35.9 80-80 80z"/>
            </svg>
            <span class="text-sm">Settings</span>
          </a>
        </li>
      </ul>
    </div>
  </div>

  <Router {routes} />
</main>

<style>
  .tab {
    &:not(:checked, label:has(:checked), :hover, .tab-active, [aria-selected="true"]) {
        @supports (color: color-mix(in lab, red, red)) {
            color: #626262;
        }
    }
}
</style>