<script lang="ts">
  import icon from "../../assets/Brand-Icon.png";
</script>

<main class="min-h-screen bg-base-200 p-4">
  <div id="root" class="container mx-auto max-w-2xl">

    <!-- Info Card -->
    <div class="card bg-base-100 shadow-md mt-5">
      <div class="card-body">
        <div class="flex items-center mb-4">
          <figure class="w-32 h-32 mr-4">
            <img id="icon" src={icon} alt="icon" class="rounded-lg" />
          </figure>
          <h2 class="text-xl font-bold">PixDuplicate</h2>
        </div>
        <div class="space-y-4">
          <p>
            Welcome to <a
              href="https://www.pixduplicate.com"
              class="font-medium text-primary"
              target="_blank">PixDuplicate.com</a
            > - The Smart Way to Organize and Manage Your Photos! Features include:
          </p>

          <div class="my-5">
            <div class="md:w-2/3">
              <span class="badge badge-accent mb-3">Create & Customize</span>
              <ul class="space-y-3">
                <li>
                  <a
                    href="https://pixduplicate.com/find-duplicate-images/image-duplicate-finder/"
                    target="_blank"
                    class="text-primary">Streamline Your Image Library</a
                  >
                  - Upload a single image to scan a folder for duplicate or similar
                  images.
                </li>
                <li>
                  <a
                    href="https://pixduplicate.com/find-duplicate-images/system-duplicate-image-search/"
                    target="_blank"
                    class="text-primary">Organize Your Image Collection</a
                  >
                  - Upload a folder of images for our tool to find duplicates.
                  </li>
              </ul>
            </div>
            <div class="mt-4 italic">
              Are you drowning in a sea of duplicate photos? Visit
              <a
                href="https://www.pixduplicate.com"
                target="_blank"
                class="text-primary">PixDuplicate.com</a
              > and say goodbye to clutter and hello to efficiency!.
            </div>
          </div>

          <div class="mt-5">
            <h3 class="text-lg font-semibold mb-4">Join the Community</h3>
            <a href="https://discord.gg/TztxFS2" class="btn gap-2" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
                class="w-6 h-6"
              >
                <path
                  fill="#5865F2"
                  d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z"
                />
              </svg>
              Join Discord Server
            </a>
          </div>
        </div>

        <div class="card-actions justify-end">
          <a
            href="https://www.pixduplicate.com/"
            class="btn btn-primary mt-4 gap-2"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              class="w-4 h-4"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                clip-rule="evenodd"
              />
            </svg>
            Explore Now
          </a>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  #icon {
    border-radius: 0.5rem;
  }
</style>