<script>
  import { browser } from "wxt/browser";
  import cardOne from "~/assets/cardOne.png";

  async function openNewTab() {
    const pageUrl = browser.runtime.getURL("image-duplicate-finder.html");
    await browser.tabs.create({ url: pageUrl });
  }
</script>

<button
  on:click={openNewTab}
  aria-label="Upload an Image to Find Duplicates"
  class="hover:scale-[1.02] transition-transform duration-300"
>
  <div class="bg-[#121212] text-white rounded-lg border border-[#454545] hover:shadow-lg transition-all">
    <div class="p-6">
      <div class="flex items-center">
        <div class="mr-6">
          <figure class="w-32 h-32 overflow-hidden rounded-lg">
            <img 
              alt="Card Icon" 
              src={cardOne} 
              class="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          </figure>
        </div>
        <div>
          <p class="text-lg font-medium pb-4 text-white">
            Streamline Your Image Library
          </p>
          <p class="text-sm text-gray-300">
            Upload a single image to scan a folder for duplicate or similar images, making
            it easy to delete or move them to a designated duplicates folder.
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