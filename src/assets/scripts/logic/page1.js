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

// Reference image tracking
let referenceFileName = null;
let referenceFilePath = null;

// ============================================
// CONFIGURATION & STATE
// ============================================
$(document).ready(function () {
    v6();
    $("#ok-button").hide();
    $("#cancel-link").hide();
    $(".is-danger").click(v56);
    $("#ok-button").click(v56);
    $(document).ready(function () {
        $(this).scrollTop(0);
    });

    // Display browser support notice on load
    displayBrowserSupport();
});

var v73 = {
    v85: 24,
    v69: 2,
    v41: 12,
    v44: 80000,
    v9: 40 * 1024 * 1024,
    v63: 0,
    v50: 0,
    v16: false,
    v10: false,
    v88: 0,
    v91: [],
    v89: [[], [], []],
    v127: 0,
    v122: 0,
    v39: [],
    v100: [[], [], []],
    v133: 0,
    v132: 0,
    v49: 0,
    v35: [],
    v121: 10,
    v106: 100,
    v37: 50,
    v66: 0.2,
    v59: 2,
    v62: 0.7,
    v28: /(^image\/gif$)|(^image\/jpeg$)|(^image\/jpg$)|(^image\/bmp$)|(^image\/png$)|(^image\/webp$)/,
    v70: "",
    v101: null,
    v52: 0,
    v30: false,
    v1: 1000,
    v0: null,
    v12: "image/jpeg",
    v7: 0.6,
    v40: 160,
    v34: '\n',
    v20: 0,
    v14: false,
    v8: 0,
};

var v71 = {
    v33: v73.v41 * v73.v41,
    v102: v73.v85 * v73.v41,
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
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function v11() {
    localStorage.setItem("fast-option-sis", $("#fast-option")[0].checked);
    return;
}

function v6() {
    if (localStorage.getItem("fast-option-sis") == null) {
        $("#fast-option")[0].checked = true;
        return;
    }
    if (localStorage.getItem("fast-option-sis") == 'false') {
        $("#fast-option")[0].checked = false;
    } else {
        $("#fast-option")[0].checked = true;
    }
    return;
}

function v46() {
    v56();
}

function v56() {
    location.reload();
}

// ============================================
// FOLDER SELECTION
// ============================================
document.getElementById('image-selector').addEventListener('click', v25);

function v25() {
    document.getElementById('imageSelected').click();
}

function v13() {
    document.getElementById('image-selector').removeEventListener('click', v25);
    document.getElementById('folder-selector').addEventListener('click', v19);
    $("#button-image-select").addClass("button-passive");
    $("#button-folder-select").removeClass("button-passive");
    $("#cancel-link").show();
}

async function v19() {
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
        var v90 = document.getElementById('filesSelected');
        if (!!v90.webkitdirectory == false) {
            showToast('This browser does not support folder selection. Please try the latest desktop Chrome, Firefox or Edge.', 'error');
            return;
        }
        v90.click();
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
                if (v73.v28.test(file.type) && file.size <= v73.v9) {
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
        v43(files);
    } else {
        showToast('The selected folder has less than 2 supported images. Please select a different folder.', 'error');
    }
}

async function requestDirectoryAccess() {
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
function v29() {
    $("#messages").text(
        'ERROR. The selected image cannot be read. Please select another image (or the same image in a different format).'
    );
    $("#messages").show();
    $("#cancel-link").show();
    showToast('Could not read the selected image. Please try a different file.', 'error');
}

function v5() {
    $("#messages").hide();
    $("#cancel-link").hide();
}

function v38(v83, v98, v113, v72) {
    v83.readAsArrayBuffer(v113.slice(0, v73.v44));
    v83.onload = function (v97) {
        var v93 = new Uint8Array(v97.target.result),
            v96, v116;
        var v138 = 0;
        for (var v138 = 2; v138 < v93.length; v138++) {
            if (v93[v138] == 0xFF) {
                if (!v96) {
                    if (v93[v138 + 1] == 0xD8) {
                        v96 = v138;
                    }
                } else {
                    if (v93[v138 + 1] == 0xD9) {
                        v116 = v138 + 2;
                        break;
                    }
                }
            }
        }
        if (v96 && v116) {
            v72(new Blob([v93.subarray(v96, v116)], { type: "image/jpeg" }));
        } else {
            v72(null);
        }
    };
    v83.onerror = function () { v72(null); };
}

function v22(v84) {
    if (v73.v20 < 2) {
        $(".fixed-top").hide();
        $(".flex-container-select-files").show();
        $("#messages").text(
            "The selected folder has less than 2 images of supported types. There is nothing to compare. Please select a different folder."
        );
        $("#messages").show();
        $("#folder-selector").hide();
        $("#cancel-link").hide();
        $("#ok-button").show();
        return;
    }
    $(".progress")[0].remove();

    const fileCount = v73.v101.length;
    const fileText = fileCount === 1 ? "file" : "files";
    v17(".progress-text", `Analysis complete. We processed ${fileCount} ${fileText}.`);

    if (v73.v49 === 0) {
        v17(".progress-text", `We didn't find any similar images in the ${fileCount} processed ${fileText}.`);
    }
    return;
}

function v61() {
    var v139 = 0, v142 = 0, v131 = 0, v124 = 0;
    var v60 = 0;
    for (v139 = 1; v139 < v73.v85 - 1; v139 += v73.v69) {
        for (v142 = 1; v142 < v73.v85 - 1; v142 += v73.v69) {
            var v15 = [];
            for (v131 = -1; v131 < 2; v131++) {
                for (v124 = -1; v124 < 2; v124++) {
                    v15.push((v142 + v124) * v73.v85 + v139 + v131);
                }
            }
            v73.v91[v60] = v15;
            v60++;
        }
    }
    v73.v80 = v15.length;
    v73.v88 = v60;
    v73.v64 = 1 / v60;
    v71.v65 = v73.v88 * v73.v37 * v73.v37 * v73.v66;
    v71.v53 = v71.v65 * v73.v59;
    return;
}

v61();

function v81(v84) {
    var v130 = 0, v123 = 0, v125 = 0, v129 = 0, v126 = 0, v128 = 0, v77 = 0, v110 = 0, v68 = 0;
    v130 = v73.v127, v125 = v73.v122;
    v123 = v73.v133, v129 = v73.v132;

    if (v130 * v129 * v73.v106 + v73.v121 * v130 * v123 < v123 * v125 * v73.v106 ||
        v130 * v129 * v73.v106 > v123 * v125 * v73.v106 + v73.v121 * v130 * v123) {
        return false;
    }

    v77 = 0;
    for (v68 = 0; v68 < v73.v88; v68++) {
        v126 = v73.v89[0][v68];
        v128 = v73.v100[0][v68];
        v77 += (v126 - v128) * (v126 - v128);
    }
    if (v77 > v71.v65) { return false; }

    v110 = 0;
    for (v68 = 0; v68 < v73.v88; v68++) {
        v126 = v73.v89[1][v68];
        v128 = v73.v100[1][v68];
        v110 += (v126 - v128) * (v126 - v128);
    }
    if (v110 > v71.v53) { return false; }

    v110 = 0;
    for (v68 = 0; v68 < v73.v88; v68++) {
        v126 = v73.v89[2][v68];
        v128 = v73.v100[2][v68];
        v110 += (v126 - v128) * (v126 - v128);
    }
    if (v110 > v71.v53) { return false; }

    v73.v35.push({ v109: v77, v84: v84 });
    return true;
}

function v17(v21, v112) {
    $(v21)[0].textContent = v112;
}

function v2() {
    var v145 = "s";
    if (v73.v49 == 1) { v145 = ""; }
    v17(".found-clusters", "Found ".concat(v73.v49, ' similar image', v145));
}

function v3(v84) {
    if (v84 + 1 == v73.v52) { return; }
    v17(".progress-text", "Please wait... Comparing to ".concat(v84, ' from ', v73.v52, ' selected files.'));
    var v78 = Math.floor(100 * (v84 + 1) / v73.v52);
    if (v78 < 5) { v78 = 5; }
    var v67 = "".concat(v78, "%");
    $("#progress-bar").width(v67);
}

function v75(v48, v36) {
    var v107 = document.createElement("div");
    v107.className = v48;
    v36.appendChild(v107);
    return v107;
}

var v42 = document.getElementById("clusters");

function v23(v84) {
    var v119 = v55(v84);
    v119.id = v84;
    v42.appendChild(v119);

    v73.v35.sort(function (v141, v148) {
        if (v141.v109 > v148.v109) { return 1; }
        if (v141.v109 < v148.v109) { return -1; }
        return 0;
    });

    var v138 = 0;
    for (v138 = 0; v138 < v73.v35.length; v138++) {
        document.getElementById(v73.v35[v138].v84).style.order = v138;
    }

    // After sort assigns orders, force the reference card to always be first
    if (referenceFileName !== null) {
        var refCard = v42.querySelector('.original-image-card-wrapper');
        if (refCard) { refCard.style.order = '-1'; }
    }
}

// ============================================
// MODAL AND UI
// ============================================
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('imageSelected').addEventListener('change', e => v4(e.target.files));
    document.getElementById('filesSelected').addEventListener('change', e => v43(e.target.files));
    document.getElementById('filesSelected').addEventListener('click', v18);
    document.getElementById('fast-option').addEventListener('change', v11);
    document.getElementById('cancel-link').addEventListener('click', v46);

    MicroModal.init({
        onShow: modal => {
            initializeSlider();
        },
        onClose: modal => console.log(`${modal.id} is hidden`),
        openTrigger: 'data-micromodal-trigger',
        closeTrigger: 'data-micromodal-close',
        disableScroll: true,
        disableFocus: false,
        awaitOpenAnimation: false,
        awaitCloseAnimation: false
    });

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('cluster-img')) {
            openImageModal(event.target.getAttribute('data-file-index'));
        }
    });
});

// ============================================
// CLUSTER CARD BUILDER
// ============================================
function v55(v84) {
    var v117 = new Image();
    var v119 = document.createElement("div");
    v119.className = "cluster";
    v119.id = v84;

    var v26 = v75("cluster-content", v119);
    var v74 = v75("cluster-imgs", v26);
    var v82 = v75("cluster-img-div", v74);

    v117.width = v73.v40;
    v117.classList.add("cluster-img");
    v117.setAttribute('loading', 'lazy');
    v117.setAttribute('data-file-index', v84);

    var fileInfo = v73.v101[v84];
    var filePath = fileInfo.webkitRelativePath;
    var fileName = filePath.split('/').pop();
    var fileSize = fileInfo.size;

    // ── Reference image detection ──────────────────────────────────────
    const isReference = referenceFileName !== null && (
        fileName === referenceFileName ||
        filePath === referenceFilePath
    );

    if (isReference) {
        // v119 (.cluster): overflow:visible so badge on v82 isn't clipped by the row
        v119.classList.add("original-image-card-wrapper");
        v119.style.overflow = "visible";

        // v82 (dark card): teal border + glow + position:relative for badge anchor
        v82.style.boxShadow = "0 0 20px rgba(0, 209, 178, 0.5)";
        v82.style.position = "relative";
        v82.style.overflow = "visible";

        // Badge on v82 — sticks out of the top-right corner of the dark card
        var badge = document.createElement("div");
        badge.className = "original-badge";
        badge.style.cssText = [
            "position:absolute",
            "top:-14px",
            "right:10px",
            "background:#00d1b2",
            "color:white",
            "padding:6px 14px",
            "border-radius:6px",
            "font-weight:bold",
            "font-size:11px",
            "z-index:10",
            "box-shadow:0 2px 8px rgba(0,0,0,0.2)",
            "letter-spacing:0.5px",
        ].join(";");
        badge.textContent = "🔖 ORIGINAL";
        v82.insertBefore(badge, v82.firstChild);
    }
    // ──────────────────────────────────────────────────────────────────

    v117.src = URL.createObjectURL(fileInfo);
    v117.alt = `${fileName}`;
    v82.appendChild(v117);

    var v54 = v75("image-size", v82);
    v54.textContent = `${v73.v133}×${v73.v132}`;

    var fileSizeDisplay = fileSize < 1024
        ? fileSize + ' bytes'
        : fileSize < 1048576
            ? (fileSize / 1024).toFixed(2) + ' KB'
            : (fileSize / 1048576).toFixed(2) + ' MB';

    var imgPathDiv = v75("img-path", v82);
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

    if (isReference) {
        // Buttons inside dark card
        v82.appendChild(buttonContainer);
        // Reference note: INSIDE v82 (dark card), flush to the bottom
        var refInfoBox = document.createElement("article");
        refInfoBox.className = "notification is-info is-light";
        refInfoBox.style.cssText = "padding:0.5rem 0.75rem;font-size:0.82rem;text-align:center;border-radius:6px;word-break:break-word;white-space:normal;";
        refInfoBox.innerHTML = "<strong>🔖 Reference Image</strong><br><span style='font-size:0.78rem;'>This is the image you originally selected for comparison.<br>It\u2019s protected from Move and Delete operations.</span>";
        v82.appendChild(refInfoBox);
    } else {        // Delete button — only if File System API is supported
        if (supportsFileSystemAPI) {
            var deleteButton = document.createElement("button");
            deleteButton.textContent = "🗑️ Delete File";
            deleteButton.className = "button is-small is-danger";
            deleteButton.setAttribute('aria-label', `Delete file: ${fileName}`);
            deleteButton.onclick = async function () {
                if (!directoryAccessGranted) {
                    const granted = await requestDirectoryAccess();
                    if (!granted) {
                        showToast("Could not get directory access. Please try again.", 'error');
                        return;
                    }
                }
                deleteFile(fileInfo, v82);
            };
            buttonContainer.appendChild(deleteButton);
        }

        v82.appendChild(buttonContainer);

        // Move button — only if File System API is supported
        if (supportsFileSystemAPI) {
            var moveToDuplicatesButton = document.createElement("button");
            moveToDuplicatesButton.textContent = "📂 Move to Duplicates Folder";
            moveToDuplicatesButton.className = "button is-small is-info is-dark has-text-white my-3";
            moveToDuplicatesButton.setAttribute('aria-label', `Move file to duplicates folder: ${fileName}`);
            moveToDuplicatesButton.onclick = async function () {
                if (!directoryAccessGranted) {
                    const granted = await requestDirectoryAccess();
                    if (!granted) {
                        showToast("Could not get directory access. Please try again.", 'error');
                        return;
                    }
                }
                moveToDuplicatesFolder(fileInfo, v82);
            };
            v82.appendChild(moveToDuplicatesButton);
        }
    }

    v27(v84, v117, v54);
    return v119;
}

// ============================================
// SLIDER
// ============================================
let mySlider = null;
const DEFAULT_SLIDER_VALUE = 100;

const openImageModal = async (fileIndex) => {
    const file = v73.v101[fileIndex];
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

// ============================================
// FILE OPERATIONS
// ============================================
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

async function moveToDuplicatesFolder(file, imgDiv) {
    if (!directoryHandle) {
        showToast('Directory access not available. Please refresh and try again.', 'error');
        return;
    }

    // Safety check — block accidental move of reference image
    const filePath = file.webkitRelativePath;
    const fileName = filePath.split('/').pop();
    if (referenceFileName && fileName === referenceFileName) {
        showToast('🔒 This is your original reference image — it cannot be moved.', 'warning');
        return;
    }

    try {
        const pathParts = filePath.split('/');
        let parentHandle = directoryHandle;

        if (useFileSystemAPI && fileHandleMap.has(filePath)) {
            parentHandle = fileHandleMap.get(filePath).parentHandle;
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

        if (fileHandleMap.has(filePath)) { fileHandleMap.delete(filePath); }

        imgDiv.remove();
        showToast(`✅ File moved to "${duplicatesFolderName}" successfully!`);

    } catch (err) {
        console.error('Error moving file:', err);
        showToast(`Error moving file: ${err.message}`, 'error');
    }
}

async function deleteFile(file, imgDiv) {
    if (!directoryHandle) {
        showToast('Directory access not available. Please refresh and try again.', 'error');
        return;
    }

    // Safety check — block accidental deletion of reference image
    const filePath = file.webkitRelativePath;
    const fileName = filePath.split('/').pop();
    if (referenceFileName && fileName === referenceFileName) {
        showToast('🔒 This is your original reference image — it cannot be deleted.', 'warning');
        return;
    }

    try {
        const pathParts = filePath.split('/');
        let parentHandle = directoryHandle;

        if (useFileSystemAPI && fileHandleMap.has(filePath)) {
            parentHandle = fileHandleMap.get(filePath).parentHandle;
        } else if (pathParts.length > 2) {
            for (let i = 1; i < pathParts.length - 1; i++) {
                parentHandle = await parentHandle.getDirectoryHandle(pathParts[i]);
            }
        }

        await parentHandle.removeEntry(fileName);
        if (fileHandleMap.has(filePath)) { fileHandleMap.delete(filePath); }

        imgDiv.remove();
        showToast("✅ File deleted successfully!");

    } catch (err) {
        console.error('Error deleting file:', err);
        showToast(`Error deleting file: ${err.message}`, 'error');
    }
}

// ============================================
// IMAGE PROCESSING CORE
// ============================================
function v114(v79, v138, v135, v111) {
    return [v79[v135 * (v111 * 4) + (v138 * 4)], v79[v135 * (v111 * 4) + (v138 * 4) + 1], v79[v135 * (v111 *
        4) + (v138 * 4) + 2]];
}

function v47(v79) {
    var v95 = [[], [], []];
    var v138 = 0, v135 = 0, v146 = 0, v143 = 0;
    var v147 = 0, v140 = 0, v148 = 0;
    var v99 = 0, v92 = 0, v94 = 0;
    var v145 = 0;
    var v76 = [];
    var v134 = 0, v144 = 0, v136 = 0;

    for (v134 = 0; v134 < v73.v88; v134++) {
        v99 = 0, v92 = 0, v94 = 0;
        v145 = 0;
        for (v144 = 0; v144 < v73.v80; v144++) {
            v138 = ~~(v73.v91[v134][v144] / v73.v85);
            v135 = v73.v91[v134][v144] % v73.v85;
            for (v136 = 0; v136 < v71.v33; v136++) {
                v146 = ~~(v136 / v73.v41);
                v143 = v136 % v73.v41;
                v76 = v114(v79, v138 * v73.v41 + v146, v135 * v73.v41 + v143, v71.v102);
                v147 = v76[0]; v140 = v76[1]; v148 = v76[2];

                v99 += 0.299000 * v147 + 0.587000 * v140 + 0.114000 * v148;
                v92 += 128 - 0.168736 * v147 - 0.331264 * v140 + 0.500000 * v148;
                v94 += 128 + 0.500000 * v147 - 0.418688 * v140 - 0.081312 * v148;
                v145++;
            }
        }
        v95[0][v134] = v99 / v145;
        v95[1][v134] = v92 / v145;
        v95[2][v134] = v94 / v145;
    }
    return [v58(v95[0]), v58(v95[1]), v58(v95[2])];
}

function v58(v118) {
    var v86 = [];
    var v137 = v118.length;
    var v104 = 0;
    var v108 = Number.POSITIVE_INFINITY;
    var v143 = 0;
    for (v143 = 0; v143 < v137; v143++) {
        if (v118[v143] > v104) { v104 = v118[v143]; }
        else if (v118[v143] < v108) { v108 = v118[v143]; }
    }
    var v115 = v104 - v108;
    for (v143 = 0; v143 < v137; v143++) {
        v86[v143] = (v118[v143] - v108) * 255 / v115;
    }
    return v86;
}

function v27(v84, v117, v54) {
    var v83 = new FileReader();
    v83.onload = function () {
        return function (e) {
            var v45 = new Image();
            v45.src = e.target.result;
            var v87 = document.createElement("canvas");
            var v120 = v87.getContext("2d");
            v45.onload = function () {
                v54.textContent = `${v45.width}×${v45.height}`;
                if (v45.width >= v45.height) {
                    v87.height = v73.v40 * 2;
                    v87.width = ~~(v45.width * v87.height / v45.height);
                } else {
                    v87.width = v73.v40 * 2;
                    v87.height = ~~(v45.height * v87.width / v45.width);
                }
                v117.width = v87.width / 2;
                v117.height = v87.height / 2;
                v120.drawImage(v45, 0, 0, v87.width, v87.height);
                v117.src = v87.toDataURL(v73.v12, v73.v7);
                v87 = null; v120 = null; v45 = null; v83 = null;
                v73.v8++;
            };
        };
    }();
    v83.readAsDataURL(v73.v101[v84]);
}

function v51() {
    var v105 = "";
    var v138 = 0;
    for (v138 = 0; v138 < v73.v35.length; v138++) {
        v105 = v105.concat(v73.v101[v73.v35[v138].v84].webkitRelativePath, v73.v34);
    }
    v105 = v105.slice(0, -1);
    $(".textarea").val(v105);
    $(".textarea").toggleClass("textareaon");
}

function v18() {
    $(".text-left").hide();
    $(".vertical-center-row").toggleClass("vertical-center-narrow");
    v73.v0 = setTimeout(function () {
        $("#messages").text(
            'Please wait if you selected a very large number of images: it may take tens of seconds before the search starts.'
        );
        $("#messages").show();
        $("#image-selector").hide();
        $("#folder-selector").hide();
        $("#fast").hide();
        $("#cancel-link").show();
    }, v73.v1);
}

function v4(v101) {
    const v32 = v101[0];

    // ── Store reference image identity ────────────────────────────────
    referenceFileName = v32.name;
    referenceFilePath = v32.webkitRelativePath || v32.name;
    // ─────────────────────────────────────────────────────────────────

    var v83 = new FileReader();
    var v117 = new Image();
    var v87 = document.createElement("canvas");
    v87.width = v71.v102;
    v87.height = v71.v102;
    var v120 = v87.getContext("2d");
    v5();

    v83.onerror = function () { v29(); return; };
    v83.onload = function () {
        return function (e) {
            v117.src = e.target.result;
            v117.onerror = function () { v29(); return; };
            v117.onload = function () {
                return function (e2) {
                    v120.drawImage(v117, 0, 0, v71.v102, v71.v102);
                    v73.v89 = v47(v120.getImageData(0, 0, v71.v102, v71.v102).data);
                    v73.v127 = v117.width;
                    v73.v122 = v117.height;

                    // Show toast confirming reference image loaded
                    showToast(`🔖 Reference image set: "${referenceFileName}"`, 'info');
                    v13();
                };
            }();
        };
    }();
    v83.readAsDataURL(v101[0]);
}

function v43(v101) {
    v73.v16 = $("#fast-option")[0].checked;
    v73.v8 = 0;
    clearTimeout(v73.v0);
    $("#folder-selector").hide();
    v73.v101 = v101;
    v73.v70 = v101[0].webkitRelativePath.split("/")[0];
    v73.v52 = v101.length;
    var v84 = 0;
    var v98 = 0;
    var v83 = new FileReader();
    var v117 = new Image();
    var v87 = document.createElement("canvas");
    v87.width = v71.v102;
    v87.height = v71.v102;
    var v120 = v87.getContext("2d", { willReadFrequently: true });
    $(".flex-container-select-files").hide();
    $(".fixed-top").show();
    $(".view-list").click(v51);
    $(".fixed-white-2").show();
    v2();
    v31(v84, v98, v83, v117, v120);
}

function v31(v84, v98, v83, v117, v120) {
    if (v84 >= v73.v52) { v22(v84); return; }

    if (!v73.v28.test(v73.v101[v84].type) || v73.v101[v84].size > v73.v9) {
        v84++;
        v31(v84, v98, v83, v117, v120);
        return;
    }

    if (v73.v16 && v73.v101[v84].type == "image/jpeg" && !v73.v30) {
        v38(v83, v98, v73.v101[v84], function (v103) {
            if (v103 == null) {
                v73.v30 = true;
                v31(v84, v98, v83, v117, v120);
                return;
            } else {
                v117.src = URL.createObjectURL(v103);
                v117.onload = function () {
                    v73.v20++;
                    if (v84 < 5 || v84 % 5 === 0) { v3(v84); }
                    v120.drawImage(v117, 0, 0, v71.v102, v71.v102);
                    v73.v100 = v47(v120.getImageData(0, 0, v71.v102, v71.v102).data);
                    v73.v133 = v117.width;
                    v73.v132 = v117.height;
                    v73.v63 = v98 + 1;
                    v73.v50 = v84 + 1;
                    if (v81(v84)) { v73.v49++; v23(v84); v2(); }
                    v84++; v98++;
                    if (!v73.v14) { v73.v14 = true; }
                    v73.v30 = false;
                    URL.revokeObjectURL(v117.src);
                    v31(v84, v98, v83, v117, v120);
                    return;
                };
                v117.onerror = function () {
                    URL.revokeObjectURL(v117.src);
                    v73.v30 = true;
                    v31(v84, v98, v83, v117, v120);
                    return;
                };
                return;
            }
        });
    } else {
        v73.v30 = true;
    }

    if (v73.v30 == false) { return; }

    v83.readAsDataURL(v73.v101[v84]);

    v83.onerror = function () {
        v84++; v73.v30 = false;
        v31(v84, v98, v83, v117, v120);
        return;
    };

    v83.onload = function (evt) {
        v117.src = evt.target.result;
        v117.onerror = function () {
            v84++; v73.v30 = false;
            v31(v84, v98, v83, v117, v120);
            return;
        };
        v117.onload = function () {
            v73.v20++;
            if (v84 < 5 || v84 % 5 === 0) { v3(v84); }
            v120.drawImage(v117, 0, 0, v71.v102, v71.v102);
            v73.v100 = v47(v120.getImageData(0, 0, v71.v102, v71.v102).data);
            v73.v133 = v117.width;
            v73.v132 = v117.height;
            v73.v63 = v98 + 1;
            v73.v50 = v84 + 1;
            if (v81(v84)) { v73.v49++; v23(v84); v2(); }
            v84++; v98++;
            if (!v73.v14) { v73.v14 = true; }
            v73.v30 = false;
            URL.revokeObjectURL(v117.src);
            v31(v84, v98, v83, v117, v120);
            return;
        };
    };
}