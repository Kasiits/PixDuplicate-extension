<script lang="ts">
  import { onMount } from "svelte";
  import Link from "@/lib/ImgDuplicate.svelte";

  onMount(() => {
    const browserName = import.meta.env.BROWSER || "unknown";
    const utmParams = new URLSearchParams({
      utm_source: "webextension",
      utm_medium: "extension",
      utm_content: "button_click",
      ref: `webextension-${browserName}`,
    });

    // Query links within THIS component
    const links = document.querySelectorAll<HTMLAnchorElement>('a[href*="pixduplicate.com"]');
    
    links.forEach((link) => {
      const url = new URL(link.href);
      const existingParams = new URLSearchParams(url.search);
      
      // Merge UTM params
      utmParams.forEach((value, key) => {
        existingParams.set(key, value);
      });

      link.href = `${url.origin}${url.pathname}?${existingParams.toString()}`;
    });
  });
</script>

<main class="min-h-screen bg-gray-100 p-4">
  <div class="container mx-auto max-w-2xl">
    <div class="bg-white rounded-lg shadow-md p-6">
      <Link />
    </div>
  </div>
</main>

<footer class="footer py-6 bg-gray-100">
  <nav class="flex justify-center items-center gap-4 w-full flex-nowrap">
    <a href="https://pixduplicate.com/find-duplicate-images/image-duplicate-finder/" 
       class="btn btn-soft"
       target="_blank">
      View Live Page
    </a>
    
    <a href="https://www.pixduplicate.com/blog/pixduplicate-guide-remove-duplicate-images/" 
       class="btn btn-primary"
       target="_blank">
      <svg xmlns="http://www.w3.org/2000/svg" 
           class="w-4 h-4 mr-2" 
           viewBox="0 0 20 20" 
           fill="currentColor">
        <path fill-rule="evenodd"
              d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
              clip-rule="evenodd" />
      </svg>
      <span>Tutorial</span>
    </a>
  </nav>
</footer>

<style>
  .min-h-screen {
    min-height: 40vh;
  }
</style>