const pixelAssets = [
    { id: 'tree1', name: '小松树', category: 'plant', svg: '<svg viewBox="0 0 32 32"><rect x="14" y="24" width="4" height="8" fill="#8B4513"/><polygon points="16,2 4,24 28,24" fill="#228B22"/></svg>' },
    { id: 'tree2', name: '棕榈树', category: 'plant', svg: '<svg viewBox="0 0 32 32"><rect x="14" y="16" width="4" height="16" fill="#8B4513"/><ellipse cx="16" cy="12" rx="14" ry="10" fill="#32CD32"/></svg>' },
    { id: 'flower1', name: '小花', category: 'plant', svg: '<svg viewBox="0 0 32 32"><rect x="15" y="16" width="2" height="12" fill="#228B22"/><circle cx="16" cy="12" r="8" fill="#FF69B4"/><circle cx="16" cy="12" r="4" fill="#FFD700"/></svg>' },
    { id: 'house1', name: '小房子', category: 'building', svg: '<svg viewBox="0 0 48 48"><rect x="8" y="24" width="32" height="24" fill="#CD853F"/><polygon points="24,4 4,24 44,24" fill="#8B0000"/><rect x="18" y="32" width="12" height="16" fill="#654321"/></svg>' },
    { id: 'house2', name: '城堡', category: 'building', svg: '<svg viewBox="0 0 64 64"><rect x="8" y="32" width="48" height="32" fill="#A0A0A0"/><rect x="4" y="24" width="16" height="40" fill="#808080"/><rect x="44" y="24" width="16" height="40" fill="#808080"/><polygon points="12,8 4,24 20,24" fill="#606060"/><polygon points="52,8 44,24 60,24" fill="#606060"/></svg>' },
    { id: 'char1', name: '小人', category: 'character', svg: '<svg viewBox="0 0 32 48"><circle cx="16" cy="10" r="8" fill="#FFDAB9"/><rect x="12" y="18" width="8" height="16" fill="#4169E1"/><rect x="8" y="34" width="6" height="14" fill="#2F4F4F"/><rect x="18" y="34" width="6" height="14" fill="#2F4F4F"/></svg>' },
    { id: 'char2', name: '骑士', category: 'character', svg: '<svg viewBox="0 0 40 56"><rect x="14" y="4" width="12" height="12" fill="#C0C0C0"/><rect x="12" y="16" width="16" height="20" fill="#808080"/><rect x="12" y="36" width="6" height="20" fill="#404040"/><rect x="22" y="36" width="6" height="20" fill="#404040"/></svg>' },
    { id: 'star', name: '星星', category: 'decoration', svg: '<svg viewBox="0 0 32 32"><polygon points="16,2 20,12 30,12 22,18 26,30 16,22 6,30 10,18 2,12 12,12" fill="#FFD700"/></svg>' },
    { id: 'heart', name: '爱心', category: 'decoration', svg: '<svg viewBox="0 0 32 32"><path d="M16 28 C4 18 4 8 10 4 C13 2 16 4 16 8 C16 4 19 2 22 4 C28 8 28 18 16 28" fill="#FF69B4"/></svg>' },
    { id: 'cloud', name: '云朵', category: 'decoration', svg: '<svg viewBox="0 0 64 32"><circle cx="20" cy="20" r="12" fill="#FFFFFF"/><circle cx="36" cy="18" r="14" fill="#FFFFFF"/><circle cx="50" cy="20" r="10" fill="#FFFFFF"/></svg>' },
    { id: 'sun', name: '太阳', category: 'decoration', svg: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="12" fill="#FFD700"/><line x1="24" y1="4" x2="24" y2="10" stroke="#FFD700" stroke-width="3"/><line x1="24" y1="38" x2="24" y2="44" stroke="#FFD700" stroke-width="3"/><line x1="4" y1="24" x2="10" y2="24" stroke="#FFD700" stroke-width="3"/><line x1="38" y1="24" x2="44" y2="24" stroke="#FFD700" stroke-width="3"/></svg>' },
    { id: 'moon', name: '月亮', category: 'decoration', svg: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="12" fill="#F0E68C"/><circle cx="20" cy="14" r="10" fill="#1a1a2e"/></svg>' },
    { id: 'grass', name: '草地', category: 'plant', svg: '<svg viewBox="0 0 48 16"><rect x="0" y="8" width="48" height="8" fill="#228B22"/><rect x="4" y="4" width="4" height="8" fill="#32CD32"/><rect x="16" y="2" width="4" height="10" fill="#32CD32"/><rect x="28" y="4" width="4" height="8" fill="#32CD32"/><rect x="40" y="2" width="4" height="10" fill="#32CD32"/></svg>' },
    { id: 'rock', name: '石头', category: 'decoration', svg: '<svg viewBox="0 0 32 24"><ellipse cx="16" cy="16" rx="14" ry="8" fill="#696969"/><ellipse cx="16" cy="14" rx="12" ry="6" fill="#808080"/></svg>' },
];

let currentPage = 'home';
let currentCategory = 'all';
let canvasLayers = [];
let selectedLayer = null;
let uploadedImage = null;

function switchPage(pageName) {
    currentPage = pageName;
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(`page-${pageName}`).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === pageName) btn.classList.add('active');
    });
    if (pageName === 'gallery') renderGallery();
    else if (pageName === 'workshop') {
        renderAssetsList();
        initCanvas();
    }
}

function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    const filtered = currentCategory === 'all' ? pixelAssets : pixelAssets.filter(a => a.category === currentCategory);
    grid.innerHTML = filtered.map(asset => `
        <div class="gallery-item" onclick="addAssetToCanvas('${asset.id}')">
            ${asset.svg}
            <span>${asset.name}</span>
        </div>
    `).join('');
}

function initCategoryFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentCategory = btn.dataset.category;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGallery();
        });
    });
}

function renderAssetsList() {
    const list = document.getElementById('assetsList');
    list.innerHTML = pixelAssets.map(asset => `
        <div class="asset-item" onclick="addAssetToCanvas('${asset.id}')">
            ${asset.svg}
            <div>${asset.name}</div>
        </div>
    `).join('');
}

function addAssetToCanvas(assetId) {
    const asset = pixelAssets.find(a => a.id === assetId);
    if (!asset) return;
    const layer = {
        id: Date.now(),
        assetId: assetId,
        x: 50 + Math.random() * 100,
        y: 50 + Math.random() * 100,
        scale: 1,
        rotation: 0,
        visible: true,
        zIndex: canvasLayers.length
    };
    canvasLayers.push(layer);
    renderLayersList();
    renderCanvas();
    if (currentPage !== 'workshop') switchPage('workshop');
}

function renderLayersList() {
    const list = document.getElementById('layersList');
    const sortedLayers = [...canvasLayers].sort((a, b) => b.zIndex - a.zIndex);
    list.innerHTML = sortedLayers.map(layer => {
        const asset = pixelAssets.find(a => a.id === layer.assetId);
        return `
            <div class="layer-item ${selectedLayer === layer.id ? 'active' : ''}" onclick="selectLayer(${layer.id})">
                <span>${asset ? asset.name : '图层'}</span>
                <div class="layer-controls">
                    <button onclick="event.stopPropagation(); moveLayerUp(${layer.id})">↑</button>
                    <button onclick="event.stopPropagation(); moveLayerDown(${layer.id})">↓</button>
                    <button onclick="event.stopPropagation(); deleteLayer(${layer.id})">✕</button>
                </div>
            </div>
        `;
    }).join('');
}

function selectLayer(id) {
    selectedLayer = id;
    renderLayersList();
}

function moveLayerUp(id) {
    const idx = canvasLayers.findIndex(l => l.id === id);
    if (idx === -1) return;
    const layer = canvasLayers[idx];
    const maxZ = Math.max(...canvasLayers.map(l => l.zIndex));
    layer.zIndex = maxZ + 1;
    renderLayersList();
    renderCanvas();
}

function moveLayerDown(id) {
    const idx = canvasLayers.findIndex(l => l.id === id);
    if (idx === -1) return;
    const layer = canvasLayers[idx];
    const minZ = Math.min(...canvasLayers.map(l => l.zIndex));
    layer.zIndex = minZ - 1;
    renderLayersList();
    renderCanvas();
}

function deleteLayer(id) {
    canvasLayers = canvasLayers.filter(l => l.id !== id);
    if (selectedLayer === id) selectedLayer = null;
    renderLayersList();
    renderCanvas();
}

function renderCanvas() {
    const canvas = document.getElementById('workshopCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const sortedLayers = [...canvasLayers].sort((a, b) => a.zIndex - b.zIndex);
    sortedLayers.forEach(layer => {
        if (!layer.visible) return;
        const asset = pixelAssets.find(a => a.id === layer.assetId);
        if (!asset) return;
        const img = new Image();
        img.onload = () => {
            ctx.save();
            ctx.translate(layer.x + 32, layer.y + 32);
            ctx.rotate(layer.rotation * Math.PI / 180);
            ctx.scale(layer.scale, layer.scale);
            ctx.drawImage(img, -32, -32, 64, 64);
            ctx.restore();
        };
        img.src = 'data:image/svg+xml,' + encodeURIComponent(asset.svg);
    });
}

function initCanvas() {
    const canvas = document.getElementById('workshopCanvas');
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        let clicked = null;
        const sorted = [...canvasLayers].sort((a, b) => b.zIndex - a.zIndex);
        for (const layer of sorted) {
            if (x >= layer.x && x <= layer.x + 64 && y >= layer.y && y <= layer.y + 64) {
                clicked = layer;
                break;
            }
        }
        selectedLayer = clicked ? clicked.id : null;
        renderLayersList();
    });
    renderCanvas();
}

function clearCanvas() {
    canvasLayers = [];
    selectedLayer = null;
    renderLayersList();
    renderCanvas();
}

function exportCanvas() {
    const canvas = document.getElementById('workshopCanvas');
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function initUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) loadImage(e.target.files[0]);
    });
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) loadImage(e.dataTransfer.files[0]);
    });
}

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            uploadedImage = img;
            const originalCanvas = document.getElementById('originalCanvas');
            originalCanvas.width = img.width;
            originalCanvas.height = img.height;
            const ctx = originalCanvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            applyPixelation();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function applyPixelation() {
    if (!uploadedImage) return;
    const pixelatedCanvas = document.getElementById('pixelatedCanvas');
    const pixelSize = parseInt(document.getElementById('pixelSizeSlider').value);
    const colorCount = parseInt(document.getElementById('colorCountSlider').value);
    pixelatedCanvas.width = uploadedImage.width;
    pixelatedCanvas.height = uploadedImage.height;
    const ctx = pixelatedCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const scaledW = Math.floor(uploadedImage.width / pixelSize);
    const scaledH = Math.floor(uploadedImage.height / pixelSize);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = scaledW;
    tempCanvas.height = scaledH;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(uploadedImage, 0, 0, scaledW, scaledH);
    const imageData = tempCtx.getImageData(0, 0, scaledW, scaledH);
    const data = imageData.data;
    if (colorCount < 256) {
        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.round(data[i] / (256 / colorCount)) * (256 / colorCount);
            data[i + 1] = Math.round(data[i + 1] / (256 / colorCount)) * (256 / colorCount);
            data[i + 2] = Math.round(data[i + 2] / (256 / colorCount)) * (256 / colorCount);
        }
    }
    tempCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(tempCanvas, 0, 0, pixelatedCanvas.width, pixelatedCanvas.height);
}

function initConverterControls() {
    const pixelSizeSlider = document.getElementById('pixelSizeSlider');
    const colorCountSlider = document.getElementById('colorCountSlider');
    const pixelSizeValue = document.getElementById('pixelSizeValue');
    const colorCountValue = document.getElementById('colorCountValue');
    pixelSizeSlider.addEventListener('input', () => pixelSizeValue.textContent = pixelSizeSlider.value);
    colorCountSlider.addEventListener('input', () => colorCountValue.textContent = colorCountSlider.value);
    document.getElementById('convertBtn').addEventListener('click', applyPixelation);
    document.getElementById('exportConvertedBtn').addEventListener('click', exportConverted);
}

function exportConverted() {
    const pixelatedCanvas = document.getElementById('pixelatedCanvas');
    const link = document.createElement('a');
    link.download = 'pixelated-image.png';
    link.href = pixelatedCanvas.toDataURL('image/png');
    link.click();
}

function init() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => switchPage(btn.dataset.page));
    });
    initCategoryFilters();
    initUpload();
    initConverterControls();
    document.getElementById('clearCanvasBtn').addEventListener('click', clearCanvas);
    document.getElementById('exportCanvasBtn').addEventListener('click', exportCanvas);
    renderGallery();
    renderAssetsList();
}

document.addEventListener('DOMContentLoaded', init);
