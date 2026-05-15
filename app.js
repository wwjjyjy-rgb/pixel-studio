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

const beadBrands = {
    mard: {
        name: 'MARD',
        colors: [
            { id: 'A1', name: 'A1', hex: '#faf5cd' },
            { id: 'A2', name: 'A2', hex: '#fcfed6' },
            { id: 'A3', name: 'A3', hex: '#fcff92' },
            { id: 'A4', name: 'A4', hex: '#f7ec5c' },
            { id: 'A5', name: 'A5', hex: '#f0d83a' },
            { id: 'A6', name: 'A6', hex: '#fda951' },
            { id: 'A7', name: 'A7', hex: '#fa8c4f' },
            { id: 'A8', name: 'A8', hex: '#fbda4d' },
            { id: 'A9', name: 'A9', hex: '#f79d5f' },
            { id: 'A10', name: 'A10', hex: '#f47e38' },
            { id: 'A11', name: 'A11', hex: '#fedb99' },
            { id: 'A12', name: 'A12', hex: '#fda276' },
            { id: 'A13', name: 'A13', hex: '#fec667' },
            { id: 'A14', name: 'A14', hex: '#f75842' },
            { id: 'A15', name: 'A15', hex: '#fbf65e' },
            { id: 'A16', name: 'A16', hex: '#feff97' },
            { id: 'A17', name: 'A17', hex: '#fde173' },
            { id: 'A18', name: 'A18', hex: '#fcbf80' },
            { id: 'A19', name: 'A19', hex: '#fd7e77' },
            { id: 'A20', name: 'A20', hex: '#f9d666' },
            { id: 'A21', name: 'A21', hex: '#fae393' },
            { id: 'A22', name: 'A22', hex: '#edf878' },
            { id: 'A23', name: 'A23', hex: '#e4c8ba' },
            { id: 'A24', name: 'A24', hex: '#f3f6a9' },
            { id: 'A25', name: 'A25', hex: '#fdf785' },
            { id: 'A26', name: 'A26', hex: '#ffc734' },
            { id: 'B1', name: 'B1', hex: '#dff13b' },
            { id: 'B2', name: 'B2', hex: '#64f343' },
            { id: 'B3', name: 'B3', hex: '#a1f586' },
            { id: 'B4', name: 'B4', hex: '#5fdf34' },
            { id: 'B5', name: 'B5', hex: '#39e158' },
            { id: 'B6', name: 'B6', hex: '#64e0a4' },
            { id: 'B7', name: 'B7', hex: '#3eae7c' },
            { id: 'B8', name: 'B8', hex: '#1d9b54' },
            { id: 'B9', name: 'B9', hex: '#2a5037' },
            { id: 'B10', name: 'B10', hex: '#9ad1ba' },
            { id: 'B11', name: 'B11', hex: '#627032' },
            { id: 'B12', name: 'B12', hex: '#1a6e3d' },
            { id: 'B13', name: 'B13', hex: '#c8e87d' },
            { id: 'B14', name: 'B14', hex: '#abe84f' },
            { id: 'B15', name: 'B15', hex: '#305335' },
            { id: 'B16', name: 'B16', hex: '#c0ed9c' },
            { id: 'B17', name: 'B17', hex: '#9eb33e' },
            { id: 'B18', name: 'B18', hex: '#e6ed4f' },
            { id: 'B19', name: 'B19', hex: '#26b78e' },
            { id: 'B20', name: 'B20', hex: '#cbeccf' },
            { id: 'B21', name: 'B21', hex: '#18616a' },
            { id: 'B22', name: 'B22', hex: '#0a4241' },
            { id: 'B23', name: 'B23', hex: '#343b1a' },
            { id: 'B24', name: 'B24', hex: '#e8faa6' },
            { id: 'B25', name: 'B25', hex: '#4e846d' },
            { id: 'B26', name: 'B26', hex: '#907c35' },
            { id: 'B27', name: 'B27', hex: '#d0e0af' },
            { id: 'B28', name: 'B28', hex: '#9ee5bb' },
            { id: 'B29', name: 'B29', hex: '#c6df5f' },
            { id: 'B30', name: 'B30', hex: '#e3fbb1' },
            { id: 'B31', name: 'B31', hex: '#b4e691' },
            { id: 'B32', name: 'B32', hex: '#92ad60' },
            { id: 'C1', name: 'C1', hex: '#f0fee4' },
            { id: 'C2', name: 'C2', hex: '#abf8fe' },
            { id: 'C3', name: 'C3', hex: '#a2e0f7' },
            { id: 'C4', name: 'C4', hex: '#44cdfb' },
            { id: 'C5', name: 'C5', hex: '#06aadf' },
            { id: 'C6', name: 'C6', hex: '#54a7e9' },
            { id: 'C7', name: 'C7', hex: '#3977ca' },
            { id: 'C8', name: 'C8', hex: '#0f52bd' },
            { id: 'C9', name: 'C9', hex: '#3349c3' },
            { id: 'C10', name: 'C10', hex: '#3cbce3' },
            { id: 'C11', name: 'C11', hex: '#2aded3' },
            { id: 'C12', name: 'C12', hex: '#1e334e' },
            { id: 'C13', name: 'C13', hex: '#cde7fe' },
            { id: 'C14', name: 'C14', hex: '#d5fcf7' },
            { id: 'C15', name: 'C15', hex: '#21c5c4' },
            { id: 'C16', name: 'C16', hex: '#1858a2' },
            { id: 'C17', name: 'C17', hex: '#02d1f3' },
            { id: 'C18', name: 'C18', hex: '#213244' },
            { id: 'C19', name: 'C19', hex: '#18869d' },
            { id: 'C20', name: 'C20', hex: '#1a70a9' },
            { id: 'C21', name: 'C21', hex: '#bcddfc' },
            { id: 'C22', name: 'C22', hex: '#6bb1bb' },
            { id: 'C23', name: 'C23', hex: '#c8e2fd' },
            { id: 'C24', name: 'C24', hex: '#7ec5f9' },
            { id: 'C25', name: 'C25', hex: '#a9e8e0' },
            { id: 'C26', name: 'C26', hex: '#42adcf' },
            { id: 'C27', name: 'C27', hex: '#d0def9' },
            { id: 'C28', name: 'C28', hex: '#bdcee8' },
            { id: 'C29', name: 'C29', hex: '#364a89' },
            { id: 'D1', name: 'D1', hex: '#acb7ef' },
            { id: 'D2', name: 'D2', hex: '#868dd3' },
            { id: 'D3', name: 'D3', hex: '#3554af' },
            { id: 'D4', name: 'D4', hex: '#162d7b' },
            { id: 'D5', name: 'D5', hex: '#b34ec6' },
            { id: 'D6', name: 'D6', hex: '#b37bdc' },
            { id: 'D7', name: 'D7', hex: '#8758a9' },
            { id: 'D8', name: 'D8', hex: '#e3d2fe' },
            { id: 'D9', name: 'D9', hex: '#d5b9f4' },
            { id: 'D10', name: 'D10', hex: '#301a49' },
            { id: 'D11', name: 'D11', hex: '#beb9e2' },
            { id: 'D12', name: 'D12', hex: '#dc99ce' },
            { id: 'D13', name: 'D13', hex: '#b5038d' },
            { id: 'D14', name: 'D14', hex: '#862993' },
            { id: 'D15', name: 'D15', hex: '#2f1f8c' },
            { id: 'D16', name: 'D16', hex: '#e2e4f0' },
            { id: 'D17', name: 'D17', hex: '#c7d3f9' },
            { id: 'D18', name: 'D18', hex: '#9a64b8' },
            { id: 'D19', name: 'D19', hex: '#d8c2d9' },
            { id: 'D20', name: 'D20', hex: '#9a35ad' },
            { id: 'D21', name: 'D21', hex: '#940595' },
            { id: 'D22', name: 'D22', hex: '#38389a' },
            { id: 'D23', name: 'D23', hex: '#eadbf8' },
            { id: 'D24', name: 'D24', hex: '#768ae1' },
            { id: 'D25', name: 'D25', hex: '#4950c2' },
            { id: 'D26', name: 'D26', hex: '#d6c6eb' },
            { id: 'E1', name: 'E1', hex: '#f6d4cb' },
            { id: 'E2', name: 'E2', hex: '#fcc1dd' },
            { id: 'E3', name: 'E3', hex: '#f6bde8' },
            { id: 'E4', name: 'E4', hex: '#e8649e' },
            { id: 'E5', name: 'E5', hex: '#f0569f' },
            { id: 'E6', name: 'E6', hex: '#eb4172' },
            { id: 'E7', name: 'E7', hex: '#c53674' },
            { id: 'E8', name: 'E8', hex: '#fddbe9' },
            { id: 'E9', name: 'E9', hex: '#e376c7' },
            { id: 'E10', name: 'E10', hex: '#d13b95' },
            { id: 'E11', name: 'E11', hex: '#f7dad4' },
            { id: 'E12', name: 'E12', hex: '#f693bf' },
            { id: 'E13', name: 'E13', hex: '#b5026a' },
            { id: 'E14', name: 'E14', hex: '#fad4bf' },
            { id: 'E15', name: 'E15', hex: '#f5c9ca' },
            { id: 'E16', name: 'E16', hex: '#fbf4ec' },
            { id: 'E17', name: 'E17', hex: '#f7e3ec' },
            { id: 'E18', name: 'E18', hex: '#f9c8db' },
            { id: 'E19', name: 'E19', hex: '#f6bbd1' },
            { id: 'E20', name: 'E20', hex: '#d7c6ce' },
            { id: 'E21', name: 'E21', hex: '#c09da4' },
            { id: 'E22', name: 'E22', hex: '#b38c9f' },
            { id: 'E23', name: 'E23', hex: '#937d8a' },
            { id: 'E24', name: 'E24', hex: '#debee5' },
            { id: 'F1', name: 'F1', hex: '#fe9381' },
            { id: 'F2', name: 'F2', hex: '#f63d4b' },
            { id: 'F3', name: 'F3', hex: '#ee4e3e' },
            { id: 'F4', name: 'F4', hex: '#fb2a40' },
            { id: 'F5', name: 'F5', hex: '#e10328' },
            { id: 'F6', name: 'F6', hex: '#913635' },
            { id: 'F7', name: 'F7', hex: '#911932' },
            { id: 'F8', name: 'F8', hex: '#bb0126' },
            { id: 'F9', name: 'F9', hex: '#e0677a' },
            { id: 'F10', name: 'F10', hex: '#874628' },
            { id: 'F11', name: 'F11', hex: '#592323' },
            { id: 'F12', name: 'F12', hex: '#f3536b' },
            { id: 'F13', name: 'F13', hex: '#f45c45' },
            { id: 'F14', name: 'F14', hex: '#fcadb2' },
            { id: 'F15', name: 'F15', hex: '#d50527' },
            { id: 'F16', name: 'F16', hex: '#f8c0a9' },
            { id: 'F17', name: 'F17', hex: '#e89b7d' },
            { id: 'F18', name: 'F18', hex: '#d07f4a' },
            { id: 'F19', name: 'F19', hex: '#be454a' },
            { id: 'F20', name: 'F20', hex: '#c69495' },
            { id: 'F21', name: 'F21', hex: '#f2b8c6' },
            { id: 'F22', name: 'F22', hex: '#f7c3d0' },
            { id: 'F23', name: 'F23', hex: '#ed806c' },
            { id: 'F24', name: 'F24', hex: '#e09daf' },
            { id: 'F25', name: 'F25', hex: '#e84854' },
            { id: 'G1', name: 'G1', hex: '#ffe4d3' },
            { id: 'G2', name: 'G2', hex: '#fcc6ac' },
            { id: 'G3', name: 'G3', hex: '#f1c4a5' },
            { id: 'G4', name: 'G4', hex: '#dcb387' },
            { id: 'G5', name: 'G5', hex: '#e7b34e' },
            { id: 'G6', name: 'G6', hex: '#e3a014' },
            { id: 'G7', name: 'G7', hex: '#985c3a' },
            { id: 'G8', name: 'G8', hex: '#713d2f' },
            { id: 'G9', name: 'G9', hex: '#e4b685' },
            { id: 'G10', name: 'G10', hex: '#da8c42' },
            { id: 'G11', name: 'G11', hex: '#dac898' },
            { id: 'G12', name: 'G12', hex: '#fec993' },
            { id: 'G13', name: 'G13', hex: '#b2714b' },
            { id: 'G14', name: 'G14', hex: '#8b684c' },
            { id: 'G15', name: 'G15', hex: '#f6f8e3' },
            { id: 'G16', name: 'G16', hex: '#f2d8c1' },
            { id: 'G17', name: 'G17', hex: '#77544e' },
            { id: 'G18', name: 'G18', hex: '#ffe3d5' },
            { id: 'G19', name: 'G19', hex: '#dd7d41' },
            { id: 'G20', name: 'G20', hex: '#a5452f' },
            { id: 'G21', name: 'G21', hex: '#b38561' },
            { id: 'H1', name: 'H1', hex: '#ffffff' },
            { id: 'H2', name: 'H2', hex: '#fbfbfb' },
            { id: 'H3', name: 'H3', hex: '#b4b4b4' },
            { id: 'H4', name: 'H4', hex: '#878787' },
            { id: 'H5', name: 'H5', hex: '#464648' },
            { id: 'H6', name: 'H6', hex: '#2c2c2c' },
            { id: 'H7', name: 'H7', hex: '#010101' },
            { id: 'H8', name: 'H8', hex: '#e7d6dc' },
            { id: 'H9', name: 'H9', hex: '#efedee' },
            { id: 'H10', name: 'H10', hex: '#ebebeb' },
            { id: 'H11', name: 'H11', hex: '#cdcdcd' },
            { id: 'H12', name: 'H12', hex: '#fdf6ee' },
            { id: 'H13', name: 'H13', hex: '#f4edf1' },
            { id: 'H14', name: 'H14', hex: '#ced7d4' },
            { id: 'H15', name: 'H15', hex: '#9aa6a6' },
            { id: 'H16', name: 'H16', hex: '#1b1213' },
            { id: 'H17', name: 'H17', hex: '#f0eeef' },
            { id: 'H18', name: 'H18', hex: '#fcfff6' },
            { id: 'H19', name: 'H19', hex: '#f2eee5' },
            { id: 'H20', name: 'H20', hex: '#96a09f' },
            { id: 'H21', name: 'H21', hex: '#f8fbe6' },
            { id: 'H22', name: 'H22', hex: '#cacad2' },
            { id: 'H23', name: 'H23', hex: '#9b9c94' },
            { id: 'M1', name: 'M1', hex: '#bbc6b6' },
            { id: 'M2', name: 'M2', hex: '#909994' },
            { id: 'M3', name: 'M3', hex: '#697e81' },
            { id: 'M4', name: 'M4', hex: '#e0d4bc' },
            { id: 'M5', name: 'M5', hex: '#d1ccaf' },
            { id: 'M6', name: 'M6', hex: '#b0aa86' },
            { id: 'M7', name: 'M7', hex: '#b0a796' },
            { id: 'M8', name: 'M8', hex: '#ae8082' },
            { id: 'M9', name: 'M9', hex: '#a68862' },
            { id: 'M10', name: 'M10', hex: '#c4b3bb' },
            { id: 'M11', name: 'M11', hex: '#9d7693' },
            { id: 'M12', name: 'M12', hex: '#644b51' },
            { id: 'M13', name: 'M13', hex: '#c79266' },
            { id: 'M14', name: 'M14', hex: '#c27563' },
            { id: 'M15', name: 'M15', hex: '#747d7a' },
        ]
    },
    perler: {
        name: 'Perler',
        colors: [
            { id: 'p1', name: 'Black', hex: '#000000' },
            { id: 'p2', name: 'White', hex: '#FFFFFF' },
            { id: 'p3', name: 'Red', hex: '#FF0000' },
            { id: 'p4', name: 'Orange', hex: '#FFA500' },
            { id: 'p5', name: 'Yellow', hex: '#FFFF00' },
            { id: 'p6', name: 'Green', hex: '#00FF00' },
            { id: 'p7', name: 'Blue', hex: '#0000FF' },
            { id: 'p8', name: 'Purple', hex: '#800080' },
            { id: 'p9', name: 'Pink', hex: '#FFC0CB' },
            { id: 'p10', name: 'Brown', hex: '#8B4513' },
            { id: 'p11', name: 'Gray', hex: '#808080' },
            { id: 'p12', name: 'Light Gray', hex: '#D3D3D3' },
            { id: 'p13', name: 'Dark Green', hex: '#006400' },
            { id: 'p14', name: 'Light Blue', hex: '#ADD8E6' },
            { id: 'p15', name: 'Dark Blue', hex: '#00008B' },
            { id: 'p16', name: 'Cyan', hex: '#00FFFF' },
        ]
    },
    hama: {
        name: 'Hama',
        colors: [
            { id: 'h1', name: 'Black', hex: '#000000' },
            { id: 'h2', name: 'White', hex: '#FFFFFF' },
            { id: 'h3', name: 'Red', hex: '#FF3333' },
            { id: 'h4', name: 'Orange', hex: '#FF9933' },
            { id: 'h5', name: 'Yellow', hex: '#FFFF33' },
            { id: 'h6', name: 'Green', hex: '#33CC33' },
            { id: 'h7', name: 'Blue', hex: '#3333FF' },
            { id: 'h8', name: 'Purple', hex: '#9933FF' },
            { id: 'h9', name: 'Pink', hex: '#FF99CC' },
            { id: 'h10', name: 'Brown', hex: '#996633' },
            { id: 'h11', name: 'Gray', hex: '#808080' },
            { id: 'h12', name: 'Beige', hex: '#F5F5DC' },
            { id: 'h13', name: 'Light Green', hex: '#99FF99' },
            { id: 'h14', name: 'Sky Blue', hex: '#99CCFF' },
            { id: 'h15', name: 'Navy', hex: '#000080' },
            { id: 'h16', name: 'Magenta', hex: '#FF00FF' },
        ]
    },
    artkal: {
        name: 'Artkal',
        colors: [
            { id: 'a1', name: 'Black', hex: '#000000' },
            { id: 'a2', name: 'White', hex: '#FFFFFF' },
            { id: 'a3', name: 'Red', hex: '#E53935' },
            { id: 'a4', name: 'Orange', hex: '#FB8C00' },
            { id: 'a5', name: 'Yellow', hex: '#FDD835' },
            { id: 'a6', name: 'Green', hex: '#43A047' },
            { id: 'a7', name: 'Blue', hex: '#1E88E5' },
            { id: 'a8', name: 'Purple', hex: '#8E24AA' },
            { id: 'a9', name: 'Pink', hex: '#EC407A' },
            { id: 'a10', name: 'Brown', hex: '#6D4C41' },
            { id: 'a11', name: 'Gray', hex: '#757575' },
            { id: 'a12', name: 'Tan', hex: '#D7CCC8' },
            { id: 'a13', name: 'Lime', hex: '#76FF03' },
            { id: 'a14', name: 'Cyan', hex: '#00BCD4' },
            { id: 'a15', name: 'Indigo', hex: '#3949AB' },
            { id: 'a16', name: 'Violet', hex: '#7B1FA2' },
        ]
    },
    nabbi: {
        name: 'Nabbi',
        colors: [
            { id: 'n1', name: 'Black', hex: '#000000' },
            { id: 'n2', name: 'White', hex: '#FFFFFF' },
            { id: 'n3', name: 'Red', hex: '#FF0000' },
            { id: 'n4', name: 'Yellow', hex: '#FFFF00' },
            { id: 'n5', name: 'Green', hex: '#00FF00' },
            { id: 'n6', name: 'Blue', hex: '#0000FF' },
            { id: 'n7', name: 'Purple', hex: '#800080' },
            { id: 'n8', name: 'Orange', hex: '#FFA500' },
        ]
    },
    simbrix: {
        name: 'Simbrix',
        colors: [
            { id: 's1', name: 'Black', hex: '#000000' },
            { id: 's2', name: 'White', hex: '#FFFFFF' },
            { id: 's3', name: 'Red', hex: '#CC0000' },
            { id: 's4', name: 'Orange', hex: '#FF6600' },
            { id: 's5', name: 'Yellow', hex: '#FFCC00' },
            { id: 's6', name: 'Green', hex: '#00CC00' },
            { id: 's7', name: 'Blue', hex: '#0066CC' },
            { id: 's8', name: 'Purple', hex: '#6600CC' },
            { id: 's9', name: 'Pink', hex: '#FF6699' },
            { id: 's10', name: 'Brown', hex: '#996633' },
        ]
    }
};

function calculateSizeByRatio(maxSize, imgWidth, imgHeight) {
    const ratio = imgWidth / imgHeight;
    let width, height;
    
    if (ratio >= 1) {
        width = maxSize;
        height = Math.round(maxSize / ratio);
    } else {
        height = maxSize;
        width = Math.round(maxSize * ratio);
    }
    
    return { width: Math.max(10, width), height: Math.max(10, height) };
}

let beadUploadedImage = null;
let currentBeadPattern = null;

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function colorDistance(color1, color2) {
    const r = color1.r - color2.r;
    const g = color1.g - color2.g;
    const b = color1.b - color2.b;
    return Math.sqrt(r * r + g * g + b * b);
}

function findClosestBeadColor(rgb, brandColors) {
    let closest = brandColors[0];
    let minDist = colorDistance(rgb, hexToRgb(closest.hex));
    
    for (const color of brandColors) {
        const dist = colorDistance(rgb, hexToRgb(color.hex));
        if (dist < minDist) {
            minDist = dist;
            closest = color;
        }
    }
    return closest;
}

function applyFloydSteinbergDithering(imageData, width, height, brandColors) {
    const data = imageData.data;
    const errorBuffer = new Float32Array(width * height * 3);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const index = (y * width + x) * 4;
            const r = Math.max(0, Math.min(255, data[index] + errorBuffer[index]));
            const g = Math.max(0, Math.min(255, data[index + 1] + errorBuffer[index + 1]));
            const b = Math.max(0, Math.min(255, data[index + 2] + errorBuffer[index + 2]));
            
            const closest = findClosestBeadColor({ r, g, b }, brandColors);
            const closestRgb = hexToRgb(closest.hex);
            
            data[index] = closestRgb.r;
            data[index + 1] = closestRgb.g;
            data[index + 2] = closestRgb.b;
            
            const rError = r - closestRgb.r;
            const gError = g - closestRgb.g;
            const bError = b - closestRgb.b;
            
            const neighbors = [
                { dx: 1, dy: 0, weight: 7 / 16 },
                { dx: -1, dy: 1, weight: 3 / 16 },
                { dx: 0, dy: 1, weight: 5 / 16 },
                { dx: 1, dy: 1, weight: 1 / 16 }
            ];
            
            for (const n of neighbors) {
                const nx = x + n.dx;
                const ny = y + n.dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const nIndex = (ny * width + nx) * 4;
                    errorBuffer[nIndex] += rError * n.weight;
                    errorBuffer[nIndex + 1] += gError * n.weight;
                    errorBuffer[nIndex + 2] += bError * n.weight;
                }
            }
        }
    }
}

function simplifyImage(imageData, width, height) {
    const data = imageData.data;
    const outputData = new Uint8ClampedArray(data.length);
    
    for (let i = 0; i < data.length; i += 4) {
        outputData[i] = data[i];
        outputData[i + 1] = data[i + 1];
        outputData[i + 2] = data[i + 2];
        outputData[i + 3] = data[i + 3];
    }
    
    const edgeThreshold = 30;
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            
            const tl = (y - 1) * width + x - 1;
            const tc = (y - 1) * width + x;
            const tr = (y - 1) * width + x + 1;
            const cl = y * width + x - 1;
            const cr = y * width + x + 1;
            const bl = (y + 1) * width + x - 1;
            const bc = (y + 1) * width + x;
            const br = (y + 1) * width + x + 1;
            
            let sumR = 0, sumG = 0, sumB = 0;
            const neighbors = [tl, tc, tr, cl, cr, bl, bc, br];
            for (const n of neighbors) {
                sumR += data[n * 4];
                sumG += data[n * 4 + 1];
                sumB += data[n * 4 + 2];
            }
            
            const avgR = sumR / 8;
            const avgG = sumG / 8;
            const avgB = sumB / 8;
            
            const diffR = Math.abs(data[idx] - avgR);
            const diffG = Math.abs(data[idx + 1] - avgG);
            const diffB = Math.abs(data[idx + 2] - avgB);
            
            if (diffR + diffG + diffB < edgeThreshold) {
                outputData[idx] = avgR;
                outputData[idx + 1] = avgG;
                outputData[idx + 2] = avgB;
            }
        }
    }
    
    return new ImageData(outputData, width, height);
}

function extractMainSubject(imageData, width, height) {
    const data = imageData.data;
    
    let totalR = 0, totalG = 0, totalB = 0;
    let pixelCount = 0;
    
    const edgeWidth = Math.floor(width * 0.1);
    const edgeHeight = Math.floor(height * 0.1);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (x < edgeWidth || x >= width - edgeWidth || y < edgeHeight || y >= height - edgeHeight) {
                const idx = (y * width + x) * 4;
                totalR += data[idx];
                totalG += data[idx + 1];
                totalB += data[idx + 2];
                pixelCount++;
            }
        }
    }
    
    const bgR = totalR / pixelCount;
    const bgG = totalG / pixelCount;
    const bgB = totalB / pixelCount;
    
    const threshold = 50;
    
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const dist = Math.sqrt(
            Math.pow(r - bgR, 2) + 
            Math.pow(g - bgG, 2) + 
            Math.pow(b - bgB, 2)
        );
        
        if (dist < threshold) {
            const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            const targetBrightness = Math.min(1, brightness + 0.3);
            
            data[i] = targetBrightness * 255;
            data[i + 1] = targetBrightness * 255;
            data[i + 2] = targetBrightness * 255;
        }
    }
    
    return imageData;
}

function generateBeadPattern() {
    if (!beadUploadedImage) {
        alert('请先上传图片！');
        return;
    }
    
    const brand = document.getElementById('beadBrandSelect').value;
    const width = parseInt(document.getElementById('beadWidthInput').value);
    const height = parseInt(document.getElementById('beadHeightInput').value);
    const colorCount = parseInt(document.getElementById('beadColorSlider').value);
    const useDithering = document.getElementById('beadDitheringCheck').checked;
    
    const size = { width, height };
    const brandColors = beadBrands[brand].colors;
    
    const originalCanvas = document.getElementById('beadOriginalCanvas');
    const patternCanvas = document.getElementById('beadPatternCanvas');
    const pCtx = patternCanvas.getContext('2d');
    
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = size.width;
    smallCanvas.height = size.height;
    const smallCtx = smallCanvas.getContext('2d');
    smallCtx.imageSmoothingEnabled = false;
    smallCtx.drawImage(beadUploadedImage, 0, 0, size.width, size.height);
    
    const smallImageData = smallCtx.getImageData(0, 0, size.width, size.height);
    
    if (useDithering) {
        applyFloydSteinbergDithering(smallImageData, size.width, size.height, brandColors);
    } else {
        const data = smallImageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const rgb = { r: data[i], g: data[i + 1], b: data[i + 2] };
            const closest = findClosestBeadColor(rgb, brandColors);
            const closestRgb = hexToRgb(closest.hex);
            data[i] = closestRgb.r;
            data[i + 1] = closestRgb.g;
            data[i + 2] = closestRgb.b;
        }
    }
    
    smallCtx.putImageData(smallImageData, 0, 0);
    
    const cellSize = 24;
    const padding = 40;
    const headerHeight = 30;
    const labelWidth = 30;
    
    patternCanvas.width = size.width * cellSize + labelWidth + padding;
    patternCanvas.height = size.height * cellSize + headerHeight + padding;
    
    pCtx.fillStyle = '#ffffff';
    pCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
    
    pCtx.strokeStyle = '#d0d0d0';
    pCtx.lineWidth = 1;
    for (let i = 0; i <= size.width; i++) {
        pCtx.beginPath();
        pCtx.moveTo(labelWidth + i * cellSize, headerHeight);
        pCtx.lineTo(labelWidth + i * cellSize, headerHeight + size.height * cellSize);
        pCtx.stroke();
    }
    for (let i = 0; i <= size.height; i++) {
        pCtx.beginPath();
        pCtx.moveTo(labelWidth, headerHeight + i * cellSize);
        pCtx.lineTo(labelWidth + size.width * cellSize, headerHeight + i * cellSize);
        pCtx.stroke();
    }
    
    pCtx.font = '12px Arial';
    pCtx.fillStyle = '#666666';
    for (let x = 0; x < size.width; x++) {
        pCtx.fillText((x + 1).toString(), labelWidth + x * cellSize + cellSize / 2 - 8, 20);
    }
    for (let y = 0; y < size.height; y++) {
        pCtx.fillText((y + 1).toString(), 5, headerHeight + y * cellSize + cellSize / 2 + 4);
    }
    
    const grid = [];
    const colorStats = new Map();
    const colorPositions = new Map();
    
    const data = smallCtx.getImageData(0, 0, size.width, size.height).data;
    for (let y = 0; y < size.height; y++) {
        const row = [];
        for (let x = 0; x < size.width; x++) {
            const i = (y * size.width + x) * 4;
            const rgb = { r: data[i], g: data[i + 1], b: data[i + 2] };
            const closest = findClosestBeadColor(rgb, brandColors);
            
            pCtx.fillStyle = closest.hex;
            pCtx.fillRect(
                labelWidth + x * cellSize,
                headerHeight + y * cellSize,
                cellSize - 1,
                cellSize - 1
            );
            
            pCtx.font = 'bold 8px Arial';
            const textColor = isDarkColor(closest.hex) ? '#ffffff' : '#333333';
            pCtx.fillStyle = textColor;
            pCtx.textAlign = 'center';
            pCtx.textBaseline = 'middle';
            pCtx.fillText(closest.id, labelWidth + x * cellSize + cellSize / 2, headerHeight + y * cellSize + cellSize / 2);
            
            row.push(closest.id);
            colorStats.set(closest.id, (colorStats.get(closest.id) || 0) + 1);
            
            if (!colorPositions.has(closest.id)) {
                colorPositions.set(closest.id, { x, y });
            }
        }
        grid.push(row);
    }
    
    pCtx.strokeStyle = '#333333';
    pCtx.lineWidth = 3;
    pCtx.strokeRect(labelWidth - 2, headerHeight - 2, size.width * cellSize + 4, size.height * cellSize + 4);
    
    currentBeadPattern = { grid, colorStats, brandColors, size };
    renderBeadColorStats();
}

function isDarkColor(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return false;
    const brightness = (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) / 255;
    return brightness < 0.5;
}

function renderBeadColorStats() {
    if (!currentBeadPattern) return;
    
    const list = document.getElementById('beadColorList');
    const sortedColors = [...currentBeadPattern.colorStats.entries()]
        .sort((a, b) => b[1] - a[1]);
    
    list.innerHTML = sortedColors.map(([colorId, count]) => {
        const color = currentBeadPattern.brandColors.find(c => c.id === colorId);
        const textColor = isDarkColor(color.hex) ? '#ffffff' : '#333333';
        return `
            <div class="bead-color-item">
                <div class="bead-color-swatch" style="background: ${color.hex}">
                    <span class="bead-color-code" style="color: ${textColor}">${color.id}</span>
                </div>
                <div class="bead-color-info">
                    <div class="bead-color-name">${color.name}</div>
                    <div class="bead-color-count">${count} 颗</div>
                </div>
            </div>
        `;
    }).join('');
}

function exportBeadPattern() {
    if (!currentBeadPattern) {
        alert('请先生成图纸！');
        return;
    }
    
    const canvas = document.getElementById('beadPatternCanvas');
    const link = document.createElement('a');
    link.download = 'bead-pattern.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function exportShoppingList() {
    if (!currentBeadPattern) {
        alert('请先生成图纸！');
        return;
    }
    
    const brand = document.getElementById('beadBrandSelect').value;
    const brandName = beadBrands[brand].name;
    
    let csv = `颜色,色号,数量\n`;
    const sortedColors = [...currentBeadPattern.colorStats.entries()]
        .sort((a, b) => b[1] - a[1]);
    
    for (const [colorId, count] of sortedColors) {
        const color = currentBeadPattern.brandColors.find(c => c.id === colorId);
        csv += `${color.name},${colorId},${count}\n`;
    }
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bead-shopping-list.csv';
    link.click();
}

function initBeadUpload() {
    const uploadArea = document.getElementById('beadUploadArea');
    const fileInput = document.getElementById('beadFileInput');
    
    uploadArea.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            loadBeadImage(e.target.files[0]);
        }
    });
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            loadBeadImage(e.dataTransfer.files[0]);
        }
    });
}

function loadBeadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            beadUploadedImage = img;
            const canvas = document.getElementById('beadOriginalCanvas');
            const maxSize = 400;
            let w = img.width, h = img.height;
            if (w > h) {
                h = (h / w) * maxSize;
                w = maxSize;
            } else {
                w = (w / h) * maxSize;
                h = maxSize;
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            
            autoCalculateSize();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function autoCalculateSize() {
    if (!beadUploadedImage) return;
    
    const maxSize = parseInt(document.getElementById('beadSizeSelect').value);
    const size = calculateSizeByRatio(maxSize, beadUploadedImage.width, beadUploadedImage.height);
    
    document.getElementById('beadWidthInput').value = size.width;
    document.getElementById('beadHeightInput').value = size.height;
}

function initBeadControls() {
    const colorSlider = document.getElementById('beadColorSlider');
    const colorValue = document.getElementById('beadColorValue');
    
    colorSlider.addEventListener('input', () => {
        colorValue.textContent = colorSlider.value;
    });
    
    document.getElementById('beadSizeSelect').addEventListener('change', () => {
        autoCalculateSize();
    });
    
    document.getElementById('autoSizeBtn').addEventListener('click', () => {
        autoCalculateSize();
    });
    
    document.getElementById('generatePatternBtn').addEventListener('click', generateBeadPattern);
    document.getElementById('exportPatternBtn').addEventListener('click', exportBeadPattern);
    document.getElementById('exportListBtn').addEventListener('click', exportShoppingList);
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
    initBeadUpload();
    initBeadControls();
    renderGallery();
    renderAssetsList();
}

document.addEventListener('DOMContentLoaded', init);
