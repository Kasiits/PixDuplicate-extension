import MicroModal from 'micromodal';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import 'animate.css';

// ============================================
// BROWSER SUPPORT DETECTION
// ============================================
const supportsFileSystemAPI = 'showDirectoryPicker' in window;

// Global directory handle and access state
let directoryHandle = null;
let directoryAccessGranted = false;
let useFileSystemAPI = false;
const fileHandleMap = new Map();

// ============================================
// DRAG & DROP
// ============================================
const fileSelector = document.getElementById('file-selector');
const filesSelected = document.getElementById('filesSelected');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileSelector.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    fileSelector.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    fileSelector.addEventListener(eventName, unhighlight, false);
});

function highlight(e) { fileSelector.classList.add('highlight'); }
function unhighlight(e) { fileSelector.classList.remove('highlight'); }

fileSelector.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    filesSelected.files = files;
    v50(files);
}

// ============================================
// CONFIGURATION & STATE
// ============================================
const v75 = {
    v94: 24,
    v76: 2,
    v37: 12,
    v45: 80000,
    v9: 40 * 1024 * 1024,
    v71: 0,
    v62: 0,
    v15: false,
    v91: 0,
    v73: 0,
    v102: [],
    v47: [],
    v10: [],
    v80: [],
    v77: [],
    v83: [],
    v46: 0,
    v21: [],
    v127: 10,
    v114: 100,
    v33: 50,
    v68: 0.2,
    v51: 2,
    v74: 0.7,
    v38: [],
    v28: /(^image\/gif$)|(^image\/jpeg$)|(^image\/jpg$)|(^image\/bmp$)|(^image\/png$)|(^image\/webp$)/,
    v78: "",
    v105: null,
    v53: 0,
    v29: false,
    v1: 1000,
    v0: null,
    v16: "image/jpeg",
    v7: 0.6,
    v36: 160,
    v30: '\n',
    v19: '\n\n',
    v20: 0,
    v17: false,
    v11: 0,
};

const v81 = {
    v34: v75.v37 * v75.v37,
    v117: v75.v94 * v75.v37,
    v84: v75.v94 * v75.v94,
};

// ============================================
// BROWSER SUPPORT UI
// ============================================
function displayBrowserSupport() {
    const inlineMsg = document.getElementById('browser-support-message');
    if (inlineMsg) {
        if (supportsFileSystemAPI) {
            inlineMsg.innerHTML = '<span class="tag is-success"><span class="icon"><i class="fas fa-check-circle"></i></span> <span>✅ Full features available - You can move and delete files</span></span>';
        } else {
            inlineMsg.innerHTML = '<span class="tag is-warning"><span class="icon"><i class="fas fa-info-circle"></i></span> <span>⚠️ Limited browser support - Some features may be unavailable</span></span>';
        }
    }

    const capNotice = document.getElementById('browser-capability-notice');
    if (capNotice) {
        if (supportsFileSystemAPI) {
            capNotice.innerHTML = '<div class="notification is-success is-light" style="padding:0.6rem 1rem;font-size:0.85rem;font-weight:600;">Full features available — you can move and delete files</div>';
        } else {
            capNotice.innerHTML = '<div class="notification is-warning is-light" style="padding:0.6rem 1rem;font-size:0.85rem;font-weight:600;color:#7a4600;">Move &amp; Delete unavailable — requires Chrome 86+, Edge 86+, or Safari 15.2+</div>';
        }
    }
}// ============================================
// UTILITY FUNCTIONS
// ============================================
function v5() {
    localStorage.setItem("fast-option", $("#fast-option")[0].checked);
    return;
}

function v8() {
    if (localStorage.getItem("fast-option") == null) {
        $("#fast-option")[0].checked = true;
        return;
    }
    if (localStorage.getItem("fast-option") == 'false') {
        $("#fast-option")[0].checked = false;
    } else {
        $("#fast-option")[0].checked = true;
    }
    return;
}

function v49() { v54(); }
function v54() { location.reload(); }

// ============================================
// FOLDER SELECTION
// ============================================
document.getElementById('file-selector').addEventListener('click', v27);

async function v27() {
    if (supportsFileSystemAPI) {
        try {
            directoryHandle = await window.showDirectoryPicker();
            useFileSystemAPI = true;
            directoryAccessGranted = true;
            await processDirectoryHandle();
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error selecting directory:', err);
                showToast('Error accessing directory. Please try again.', 'error');
            }
        }
    } else {
        const v104 = document.getElementById('filesSelected');
        if (!v104.webkitdirectory) {
            showToast('This browser does not support folder selection. Please try the latest desktop Chrome, Firefox or Edge.', 'error');
            return;
        }
        v104.click();
    }
}

async function processDirectoryHandle() {
    const files = [];
    fileHandleMap.clear();

    async function traverseDirectory(dirHandle, path = dirHandle.name) {
        for await (const entry of dirHandle.values()) {
            const fullPath = path ? `${path}/${entry.name}` : entry.name;
            if (entry.kind === 'file') {
                const file = await entry.getFile();
                if (v75.v28.test(file.type) && file.size <= v75.v9) {
                    fileHandleMap.set(fullPath, {
                        handle: entry,
                        parentHandle: dirHandle,
                        file: file
                    });
                    const fileWithPath = new File([file], file.name, { type: file.type });
                    Object.defineProperty(fileWithPath, 'webkitRelativePath', {
                        value: fullPath,
                        writable: false
                    });
                    files.push(fileWithPath);
                }
            } else if (entry.kind === 'directory') {
                await traverseDirectory(entry, fullPath);
            }
        }
    }

    await traverseDirectory(directoryHandle);

    if (files.length > 0) {
        v50(files);
    } else {
        showToast('We found fewer than 2 supported images in the selected folder. Please choose a different folder.', 'error');
    }
}

async function getDirectoryAccess() {
    try {
        directoryHandle = await window.showDirectoryPicker();
        directoryAccessGranted = true;
        return true;
    } catch (err) {
        console.error('Error selecting directory:', err);
        directoryAccessGranted = false;
        return false;
    }
}

// ============================================
// IMAGE PROCESSING
// ============================================
function v35(v97, v103, v111, v82) {
    v97.readAsArrayBuffer(v111.slice(0, v75.v45));
    v97.onload = function (v107) {
        var v108 = new Uint8Array(v107.target.result), v100, v124;
        var v126 = v108.length;
        var v148 = 0;
        for (v148 = 2; v148 < v126; v148++) {
            if (v108[v148] == 0xFF) {
                if (!v100) {
                    if (v108[v148 + 1] == 0xD8) { v100 = v148; }
                } else {
                    if (v108[v148 + 1] == 0xD9) { v124 = v148 + 2; break; }
                }
            }
        }
        if (v100 && v124) {
            v82(new Blob([v108.subarray(v100, v124)], { type: "image/jpeg" }));
        } else {
            v82(null);
        }
    };
    v97.onerror = function () { v82(null); };
}

function v23(v95) {
    if (v75.v20 < 2) {
        $(".fixed-top").hide();
        $(".flex-container-select-files").show();
        $("#messages").text(
            "We found fewer than 2 supported images in the selected folder. Please choose a different folder with more images to analyze."
        );
        $("#messages").show();
        $("#file-selector").hide();
        $("#cancel-link").hide();
        $("#ok-button").show();
        return;
    }
    $(".progress")[0].remove();

    const fileCount = v75.v105.length;
    const fileText = fileCount === 1 ? "file" : "files";
    v14(".progress-text", `Analysis complete. We processed ${fileCount} ${fileText}.`);

    if (v75.v46 === 0) {
        v14(".progress-text", `We didn't find any similar images in the ${fileCount} processed ${fileText}.`);
    }
    return;
}

function v70() {
    var v66 = 0;
    var v142 = 0, v139 = 0, v133 = 0, v136 = 0;
    for (v142 = 1; v142 < v75.v94 - 1; v142 += v75.v76) {
        for (v139 = 1; v139 < v75.v94 - 1; v139 += v75.v76) {
            var v13 = [];
            for (v133 = -1; v133 < 2; v133++) {
                for (v136 = -1; v136 < 2; v136++) {
                    v13.push((v139 + v136) * v75.v94 + v142 + v133);
                }
            }
            v75.v102[v66] = v13;
            v66++;
        }
    }
    v75.v86 = v13.length;
    v75.v91 = v66;
    v75.v73 = 1 / v66;
    v81.v67 = v75.v91 * v75.v33 * v75.v33 * v75.v68;
    v81.v58 = v81.v67 * v75.v51;
    return;
}

v70();

function v4(v103, v72) {
    var v96 = [];
    var v60 = v75.v21[v103];
    var v57 = v75.v21[v72];

    if (typeof v60 === "undefined" && typeof v57 === "undefined") {
        v75.v21[v103] = v75.v46;
        v75.v21[v72] = v75.v46;
        v75.v83.push([v103, v72]);
        v75.v46++;
        v6(v75.v46 - 1);
        v18(v75.v46 - 1, v103);
        v18(v75.v46 - 1, v72);
        return;
    }

    if (typeof v60 === "number" && typeof v57 === "undefined") {
        v96 = v75.v83[v60];
        v96.push(v72);
        v75.v21[v72] = v60;
        v75.v83[v60] = v96;
        v18(v60, v72);
        return;
    }

    if (typeof v60 === "undefined" && typeof v57 === "number") {
        v96 = v75.v83[v57];
        v96.push(v103);
        v75.v21[v103] = v57;
        v75.v83[v57] = v96;
        v18(v57, v103);
        return;
    }
}

function v61(v72) {
    var v131 = 0, v129 = 0;
    var v137 = 0, v134 = 0, v135 = 0, v130 = 0;
    var v121 = 0, v79 = 0, v103 = 0;
    var v39 = [[], [], []];
    var v40 = v75.v47[v72];
    v75.v10[v72] = v40;
    var v103 = 0;

    for (v103 = v72 - 1; v103 >= 0; v103--) {
        v137 = v75.v80[v103], v134 = v75.v77[v103];
        v135 = v75.v80[v72], v130 = v75.v77[v72];
        if (v137 * v130 * v75.v114 + v75.v127 * v137 * v135 < v135 * v134 * v75.v114 ||
            v137 * v130 * v75.v114 > v135 * v134 * v75.v114 + v75.v127 * v137 * v135) {
            continue;
        }

        v39 = v75.v10[v103];

        v121 = 0;
        for (v79 = 0; v79 < v75.v91; v79++) {
            v131 = v39[0][v79]; v129 = v40[0][v79];
            v121 += (v131 - v129) * (v131 - v129);
        }
        if (v121 > v81.v67) { continue; }

        v121 = 0;
        for (v79 = 0; v79 < v75.v91; v79++) {
            v131 = v39[1][v79]; v129 = v40[1][v79];
            v121 += (v131 - v129) * (v131 - v129);
        }
        if (v121 > v81.v58) { continue; }

        v121 = 0;
        for (v79 = 0; v79 < v75.v91; v79++) {
            v131 = v39[2][v79]; v129 = v40[2][v79];
            v121 += (v131 - v129) * (v131 - v129);
        }
        if (v121 > v81.v58) { continue; }

        v4(v103, v72);
        v3();
    }
    return;
}

function v14(v24, v116) { $(v24)[0].textContent = v116; }

function v3() {
    var v144 = "s";
    if (v75.v46 == 1) { v144 = ""; }
    var foundClustersElement = document.querySelector(".found-clusters");
    foundClustersElement.setAttribute('aria-live', 'polite');
    v14(".found-clusters", "Found ".concat(v75.v46, ' duplicate', v144));
}

var v41 = $("#progress-bar");

function v2(v95) {
    if (v95 + 1 == v75.v53) { return; }
    v14(".progress-text", `Analyzing image ${v95 + 1} of ${v75.v53}. Please wait...`);
    var v87 = Math.max(5, ~~(100 * (v95 + 1) / v75.v53));
    v41.width(`${v87}%`);
    v41.attr('aria-valuenow', v87);
    v41.attr('aria-valuemin', '0');
    v41.attr('aria-valuemax', '100');
}

function v89(v44, v32) {
    var v110 = document.createElement("div");
    v110.className = v44;
    v32.appendChild(v110);
    return v110;
}

var v43 = document.getElementById("clusters");

function v6(v65) {
    var v63 = v89("cluster", v43);
    v63.setAttribute('role', 'region');
    v63.setAttribute('aria-label', `Cluster ${v65 + 1}`);

    var v69 = v89("cluster-num", v63);
    v69.textContent = v65 + 1;

    var v25 = v89("cluster-content", v63);
    v25.setAttribute('role', 'list');

    var clusterImgs = v89("cluster-imgs", v25);
    clusterImgs.setAttribute('role', 'group');
    clusterImgs.setAttribute('aria-label', 'Cluster Images');

    var clusterPaths = v89("cluster-paths", v25);
    clusterPaths.setAttribute('role', 'group');
    clusterPaths.setAttribute('aria-label', 'Image Paths');
}

// ============================================
// FILE OPERATIONS
// ============================================
async function v50(v105) {
    v75.v11 = 0;
    clearTimeout(v75.v0);
    $("#file-selector").hide();
    v75.v105 = v105;
    v75.v78 = v105[0].webkitRelativePath.split("/")[0];
    v75.v53 = v105.length;

    const v95 = 0;
    const v103 = 0;
    const v97 = new FileReader();
    const v125 = new Image();
    const v92 = document.createElement("canvas");
    v92.width = v81.v117;
    v92.height = v81.v117;
    const v128 = v92.getContext("2d", { willReadFrequently: true });

    $(".flex-container-select-files").hide();
    $(".fixed-top").show();
    $(".view-list").click(v59);
    $(".fixed-white-2").show();
    v3();
    v31(v95, v103, v97, v125, v128);
}

// ============================================
// MODAL AND UI
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    MicroModal.init({
        onShow: modal => { initializeSlider(); },
        onClose: modal => console.log(`${modal.id} is hidden`),
        openTrigger: 'data-micromodal-trigger',
        closeTrigger: 'data-micromodal-close',
        disableScroll: true,
        disableFocus: false,
        awaitOpenAnimation: false,
        awaitCloseAnimation: false
    });

    document.getElementById('filesSelected').addEventListener('change', e => v50(e.target.files));
    document.getElementById('fast-option').addEventListener('change', v5);
    document.getElementById('cancel-link').addEventListener('click', v49);
    document.getElementById('file-selector').addEventListener('click', v27);

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('cluster-img')) {
            openImageModal(event.target.getAttribute('data-file-index'));
        }
    });

    v8();
    $("#ok-button").hide();
    $("#cancel-link").hide();
    $(".is-danger").click(v54);
    $("#ok-button").click(v54);
    $(document).scrollTop(0);

    displayBrowserSupport();
});

function v18(v65, v103) {
    var v90 = $(".cluster-imgs")[v65];
    var v98 = v89("cluster-img-div", v90);

    var v125 = new Image();
    v125.classList.add("cluster-img");
    v125.setAttribute('data-file-index', v75.v38[v103]);
    v125.setAttribute('loading', 'lazy');

    var v111 = v75.v105[v75.v38[v103]];
    var filePath = v111.webkitRelativePath;
    var fileName = filePath.split('/').pop();

    v125.alt = `${fileName}`;
    v98.appendChild(v125);

    var v64 = v89("image-size", v98);
    var imgPathDiv = v89("img-path", v98);

    var fileSize = v111.size;
    var fileSizeDisplay = fileSize < 1024
        ? fileSize + ' bytes'
        : fileSize < 1048576
            ? (fileSize / 1024).toFixed(2) + ' KB'
            : (fileSize / 1048576).toFixed(2) + ' MB';

    imgPathDiv.innerHTML = `<div>Path: ${filePath}</div><div>Size: ${fileSizeDisplay}</div>`;

    var buttonContainer = document.createElement("div");
    buttonContainer.className = "buttons is-justify-content-space-around mt-4";

    // Copy button — always available
    var copyButton = document.createElement("button");
    copyButton.textContent = "📋 Copy File Name";
    copyButton.className = "button is-small is-hovered";
    copyButton.setAttribute('aria-label', `Copy file name: ${fileName}`);
    copyButton.onclick = function () { copyToClipboard(fileName); };
    buttonContainer.appendChild(copyButton);

    // Delete button — only if File System API is supported
    if (supportsFileSystemAPI) {
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑️ Delete File";
        deleteButton.className = "button is-small is-danger";
        deleteButton.setAttribute('aria-label', `Delete file: ${fileName}`);
        deleteButton.onclick = async function () {
            if (!directoryAccessGranted) {
                const granted = await getDirectoryAccess();
                if (!granted) {
                    showToast("Could not get directory access. Please try again.", 'error');
                    return;
                }
            }
            deleteFile(v111, v98);
        };
        buttonContainer.appendChild(deleteButton);
    }

    v98.appendChild(buttonContainer);

    // Move button — only if File System API is supported
    if (supportsFileSystemAPI) {
        var moveToDuplicatesButton = document.createElement("button");
        moveToDuplicatesButton.textContent = "📂 Move to Duplicates Folder";
        moveToDuplicatesButton.className = "button is-small is-info is-dark has-text-white my-3";
        moveToDuplicatesButton.setAttribute('aria-label', `Move file to duplicates folder: ${fileName}`);
        moveToDuplicatesButton.onclick = async function () {
            if (!directoryAccessGranted) {
                const granted = await getDirectoryAccess();
                if (!granted) {
                    showToast("Could not get directory access. Please try again.", 'error');
                    return;
                }
            }
            moveToDuplicatesFolder(v111, v98);
        };
        v98.appendChild(moveToDuplicatesButton);
    }

    v26(v111, v125, v64);
}

// ============================================
// SLIDER
// ============================================
let mySlider = null;
const DEFAULT_SLIDER_VALUE = 100;

const openImageModal = async (fileIndex) => {
    const file = v75.v105[fileIndex];
    const modalImage = document.getElementById('modal-1-image');
    try {
        const highQualityBlob = await createHighQualityBlob(file);
        modalImage.src = URL.createObjectURL(highQualityBlob);
        MicroModal.show('modal-1');
        setTimeout(initializeSlider, 200);
    } catch (error) {
        console.error('Error creating high-quality image:', error);
        showToast('Error loading high-quality image preview.', 'error');
    }
};

const initializeSlider = () => {
    mySlider?.destroy();
    mySlider = null;
    const sliderValue = loadSliderValue();
    mySlider = new rSlider({
        target: '#sampleSlider',
        values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        tooltip: true,
        scale: true,
        labels: true,
        set: [sliderValue],
        onChange: updateImageSize
    });
};

const updateImageSize = (value) => {
    document.getElementById("modal-1-image").style.width = `${value}%`;
    saveSliderValue(value);
};

const saveSliderValue = (value) => localStorage.setItem('sliderValue', value);
const loadSliderValue = () => {
    const storedValue = localStorage.getItem('sliderValue');
    return storedValue ? parseInt(storedValue, 10) : DEFAULT_SLIDER_VALUE;
};

function createHighQualityBlob(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                canvas.toBlob(blob => { resolve(blob); }, 'image/jpeg', 0.95);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function moveToDuplicatesFolder(file, imgDiv) {
    if (!directoryHandle) {
        showToast('Directory access not available. Please refresh and try again.', 'error');
        return;
    }

    try {
        const relativePath = file.webkitRelativePath;
        const pathParts = relativePath.split('/');
        let fileName = pathParts[pathParts.length - 1];
        let parentHandle = directoryHandle;

        if (useFileSystemAPI && fileHandleMap.has(relativePath)) {
            parentHandle = fileHandleMap.get(relativePath).parentHandle;
        } else if (pathParts.length > 2) {
            for (let i = 1; i < pathParts.length - 1; i++) {
                parentHandle = await parentHandle.getDirectoryHandle(pathParts[i]);
            }
        }

        let duplicatesFolderName = "PixDuplicate-Duplicates";
        let duplicatesFolderHandle;
        let counter = 0;

        while (true) {
            try {
                duplicatesFolderHandle = await directoryHandle.getDirectoryHandle(
                    duplicatesFolderName, { create: true }
                );
                break;
            } catch (err) {
                if (err.name === 'TypeError') {
                    counter++;
                    duplicatesFolderName = `PixDuplicate-Duplicates_${counter}`;
                } else {
                    throw err;
                }
            }
        }

        const fileHandle = await parentHandle.getFileHandle(fileName);
        const fileContent = await fileHandle.getFile();
        const newFileHandle = await duplicatesFolderHandle.getFileHandle(fileName, { create: true });
        const writable = await newFileHandle.createWritable();
        await writable.write(fileContent);
        await writable.close();
        await parentHandle.removeEntry(fileName);

        if (fileHandleMap.has(relativePath)) { fileHandleMap.delete(relativePath); }

        imgDiv.remove();
        showToast(`✅ File moved to "${duplicatesFolderName}" successfully!`);

    } catch (err) {
        console.error('Error moving file to duplicates folder:', err);
        showToast(`Error moving file: ${err.message}`, 'error');
    }
}

async function deleteFile(file, imgDiv) {
    if (!directoryHandle) {
        showToast('Directory access not available. Please refresh and try again.', 'error');
        return;
    }

    try {
        const relativePath = file.webkitRelativePath;
        const pathParts = relativePath.split('/');
        let fileName = pathParts[pathParts.length - 1];
        let parentHandle = directoryHandle;

        if (useFileSystemAPI && fileHandleMap.has(relativePath)) {
            parentHandle = fileHandleMap.get(relativePath).parentHandle;
        } else if (pathParts.length > 2) {
            for (let i = 1; i < pathParts.length - 1; i++) {
                parentHandle = await parentHandle.getDirectoryHandle(pathParts[i]);
            }
        }

        await parentHandle.removeEntry(fileName);
        if (fileHandleMap.has(relativePath)) { fileHandleMap.delete(relativePath); }

        imgDiv.remove();
        showToast("✅ File deleted successfully!");

    } catch (err) {
        console.error('Error deleting file:', err);
        showToast(`Error: ${err.message}`, 'error');
    }
}

function showToast(message, type = 'success') {
    const types = {
        success: { backgroundColor: "#4CAF50" },
        error:   { backgroundColor: "#ff3860" },
        info:    { backgroundColor: "#3298dc" },
        warning: { backgroundColor: "#ffdd57", color: "#363636" },
    };

    Toastify({
        text: message,
        duration: 4000,
        close: true,
        gravity: "bottom",
        position: "right",
        style: types[type] || types.info,
        className: "toastify-custom",
        aria: { live: 'assertive', atomic: 'true' }
    }).showToast();
}

function copyToClipboard(text) {
    var tempTextArea = document.createElement("textarea");
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
    showToast("✅ File name copied to clipboard!");
}

function v26(v111, v125, v64) {
    var v97 = new FileReader();
    v97.v111 = v111;
    v97.onload = function () {
        return function (e) {
            var v42 = new Image();
            v42.src = e.target.result;
            var v92 = document.createElement("canvas");
            var v128 = v92.getContext("2d");
            v42.onload = function () {
                v64.textContent = "".concat(v42.width, "×", v42.height);
                if (v42.width >= v42.height) {
                    v92.height = v75.v36 * 2;
                    v92.width = ~~(v42.width * v92.height / v42.height);
                } else {
                    v92.width = v75.v36 * 2;
                    v92.height = ~~(v42.height * v92.width / v42.width);
                }
                v125.width = v92.width / 2;
                v125.height = v92.height / 2;
                v128.drawImage(v42, 0, 0, v92.width, v92.height);
                v125.src = v92.toDataURL(v75.v16, v75.v7);
                v92 = null; v128 = null; v42 = null; v97 = null;
                v75.v11++;
            };
        };
    }();
    v97.readAsDataURL(v111);
}

function v59() {
    var v115 = "";
    var v140 = 0;
    var v148 = 0;
    for (v140 = 0; v140 < v75.v46; v140++) {
        var v56 = v75.v83[v140];
        for (v148 = 0; v148 < v56.length - 1; v148++) {
            v115 = v115.concat(v75.v105[v75.v38[v56[v148]]].webkitRelativePath, v75.v30);
        }
        v115 = v115.concat(v75.v105[v75.v38[v56[v148]]].webkitRelativePath, v75.v19);
    }
    v115 = v115.slice(0, -2);
    $(".textarea").val(v115);
    $(".textarea").toggleClass("textareaon");
}

function v12() {
    $(".text-left").hide();
    $(".vertical-center-row").toggleClass("vertical-center-narrow");
    v75.v0 = setTimeout(function () {
        $("#messages").text(
            'Please wait while we analyze your images. This may take a few moments, especially for large folders.'
        );
        $("#messages").show();
        $("#file-selector").hide();
        $(".fast-option").hide();
        $("#cancel-link").show();
    }, v75.v1);
}

function v118(v88, v148, v147, v120) {
    return [v88[v147 * (v120 * 4) + (v148 * 4)], v88[v147 * (v120 * 4) + (v148 * 4) + 1],
    v88[v147 * (v120 * 4) + (v148 * 4) + 2]];
}

function v48(v88) {
    var v99 = [[], [], []];
    var v148 = 0, v147 = 0, v143 = 0, v141 = 0;
    var v149 = 0, v150 = 0, v138 = 0;
    var v106 = 0, v101 = 0, v109 = 0;
    var v144 = 0;
    var v85 = [];
    var v132 = 0, v151 = 0, v146 = 0;

    for (v132 = 0; v132 < v75.v91; v132++) {
        v106 = 0, v101 = 0, v109 = 0;
        v144 = 0;
        for (v151 = 0; v151 < v75.v86; v151++) {
            v148 = ~~(v75.v102[v132][v151] / v75.v94);
            v147 = v75.v102[v132][v151] % v75.v94;
            for (v146 = 0; v146 < v81.v34; v146++) {
                v143 = ~~(v146 / v75.v37);
                v141 = v146 % v75.v37;
                v85 = v118(v88, v148 * v75.v37 + v143, v147 * v75.v37 + v141, v81.v117);
                v149 = v85[0]; v150 = v85[1]; v138 = v85[2];

                v106 += 0.299000 * v149 + 0.587000 * v150 + 0.114000 * v138;
                v101 += 128 - 0.168736 * v149 - 0.331264 * v150 + 0.500000 * v138;
                v109 += 128 + 0.500000 * v149 - 0.418688 * v150 - 0.081312 * v138;
                v144++;
            }
        }
        v99[0][v132] = v106 / v144;
        v99[1][v132] = v101 / v144;
        v99[2][v132] = v109 / v144;
    }
    return [v55(v99[0]), v55(v99[1]), v55(v99[2])];
}

function v55(v123) {
    var v93 = [];
    var v145 = v123.length;
    var v113 = 0;
    var v112 = Number.POSITIVE_INFINITY;
    var v141 = 0;
    for (v141 = 0; v141 < v145; v141++) {
        if (v123[v141] > v113) { v113 = v123[v141]; }
        else if (v123[v141] < v112) { v112 = v123[v141]; }
    }
    var v122 = v113 - v112;
    for (v141 = 0; v141 < v145; v141++) {
        v93[v141] = (v123[v141] - v112) * 255 / v122;
    }
    return v93;
}

function v31(v95, v103, v97, v125, v128) {
    if (v95 >= v75.v53) { v23(v95); return; }

    if (!v75.v28.test(v75.v105[v95].type) || v75.v105[v95].size > v75.v9) {
        v95++;
        v31(v95, v103, v97, v125, v128);
        return;
    }

    if (v75.v15 && v75.v105[v95].type == "image/jpeg" && !v75.v29) {
        v35(v97, v103, v75.v105[v95], function (v119) {
            if (v119 == null) {
                v75.v29 = true;
                v31(v95, v103, v97, v125, v128);
                return;
            } else {
                v125.src = URL.createObjectURL(v119);
                v125.onload = function () {
                    v75.v20++;
                    if (v95 < 5 || v95 % 5 === 0) { v2(v95); }
                    v128.drawImage(v125, 0, 0, v81.v117, v81.v117);
                    v75.v47[v103] = v48(v128.getImageData(0, 0, v81.v117, v81.v117).data);
                    v75.v80[v103] = v125.width;
                    v75.v77[v103] = v125.height;
                    v75.v38[v103] = v95;
                    v75.v71 = v103 + 1;
                    v75.v62 = v95 + 1;
                    URL.revokeObjectURL(v125.src);
                    v61(v103);
                    v95++; v103++;
                    if (!v75.v17) { v75.v17 = true; }
                    v75.v29 = false;
                    v31(v95, v103, v97, v125, v128);
                    return;
                };
                v125.onerror = function () {
                    URL.revokeObjectURL(v125.src);
                    v75.v29 = true;
                    v31(v95, v103, v97, v125, v128);
                    return;
                };
                return;
            }
        });
    } else {
        v75.v29 = true;
    }

    if (v75.v29 == false) { return; }

    v97.readAsDataURL(v75.v105[v95]);

    v97.onerror = function () {
        v95++; v75.v29 = false;
        v31(v95, v103, v97, v125, v128);
        return;
    };

    v97.onload = function (evt) {
        v125.src = evt.target.result;
        v125.onerror = function () {
            v95++; v75.v29 = false;
            v31(v95, v103, v97, v125, v128);
            return;
        };
        v125.onload = function () {
            v75.v20++;
            if (v95 < 5 || v95 % 5 === 0) { v2(v95); }
            v128.drawImage(v125, 0, 0, v81.v117, v81.v117);
            v75.v47[v103] = v48(v128.getImageData(0, 0, v81.v117, v81.v117).data);
            v75.v80[v103] = v125.width;
            v75.v77[v103] = v125.height;
            v75.v38[v103] = v95;
            v75.v71 = v103 + 1;
            v75.v62 = v95 + 1;
            v61(v103);
            v95++; v103++;
            if (!v75.v17) { v75.v17 = true; }
            v75.v29 = false;
            v31(v95, v103, v97, v125, v128);
            return;
        };
    };
}