<script>
  import { browser } from "wxt/browser";
  import cardTwo from "~/assets/cardTwo.png";

  async function openNewTab() {
    const pageUrl = browser.runtime.getURL(
      "system-duplicate-image-search.html",
    );
    await browser.tabs.create({ url: pageUrl });
  }
</script>

<button
  on:click={openNewTab}
  aria-label="Search Your System to Find Duplicates"
  class="hover:scale-[1.02] transition-transform duration-300"
>
  <div class="bg-[#121212] text-white rounded-lg border border-[#454545] hover:shadow-lg transition-all">
    <div class="p-6">
      <div class="flex items-center">
        <div class="mr-6">
          <figure class="w-32 h-32 overflow-hidden rounded-lg">
            <img 
              alt="Card Icon" 
              src={cardTwo} 
              class="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </figure>
        </div>
        <div>
          <p class="text-lg font-medium pb-4 text-white">
            Optimize Your Images Effortlessly
          </p>
          <p class="text-sm text-gray-300">
            Easily upload your images to compress both their size and quality. Our tool works to optimize file storage while maintaining the integrity of your visuals.
          </p>
        </div>
      </div>
    </div>
  </div>
</button>

<style>
  /* Preserve necessary button reset */
  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }
  /* Match original shadow intensity */
  .hover\:shadow-lg {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
</style>