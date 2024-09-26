import { fetchBins, fetchBinContent, updateBin, deleteBin, setBinName, createBin } from './jsonBinApi.js';

const binsList = document.getElementById('binsList');
const jsonContent = document.getElementById('jsonContent');
const updateBtn = document.getElementById('updateBtn');
const deleteBtn = document.getElementById('deleteBtn');
const binNameInput = document.getElementById('binName');
const setNameBtn = document.getElementById('setNameBtn');
const logContent = document.getElementById('logContent');
const newBinContent = document.getElementById('newBinContent');
const newBinName = document.getElementById('newBinName');
const createBinBtn = document.getElementById('createBinBtn');
const binsSpinner = document.getElementById('binsSpinner');
const actionSpinner = document.getElementById('actionSpinner');

function addLog(message, isError = false) {
    const timestamp = new Date().toLocaleString();
    const logMessage = `[${timestamp}] ${message}\n`;
    logContent.textContent += isError? `❌ ${logMessage}` : `✔️ ${logMessage}`;
    logContent.scrollTop = logContent.scrollHeight;
}

function showSpinner(spinner, show) {
    spinner.style.display = show? 'inline-block' : 'none';
}

function populateBinsList(bins) {
    binsList.innerHTML = '<option value="">选择一个 Bin</option>';
    bins.forEach(bin => {
        const option = document.createElement('option');
        const binName = bin.snippetMeta.name || bin.record;
        option.value = bin.record;
        option.textContent = binName;
        binsList.appendChild(option);
    });

    binsList.addEventListener('change', async () => {
        const binId = binsList.value;
        if (!binId) return;
        await fetchBinContent(binId);
    });
}

updateBtn.addEventListener('click', async () => {
    const binId = binsList.value;
    let updatedContent;
    try {
        updatedContent = JSON.parse(jsonContent.value);
        await updateBin(binId, updatedContent);
    } catch (error) {
        addLog('JSON 格式错误，请输入合法的 JSON。', true);
    }
});

deleteBtn.addEventListener('click', async () => {
    const binId = binsList.value;
    await deleteBin(binId);
});

setNameBtn.addEventListener('click', async () => {
    const binId = binsList.value;
    const binName = binNameInput.value.trim();
    if (!binName) {
        addLog('请输入有效的 Bin 名称。', true);
        return;
    }
    await setBinName(binId, binName);
});

createBinBtn.addEventListener('click', async () => {
    const content = newBinContent.value.trim();
    const binName = newBinName.value.trim();
    if (!content) {
        addLog('请输入有效的 JSON 数据。', true);
        return;
    }
    await createBin(content, binName);
});

document.addEventListener('DOMContentLoaded', async () => {
    await fetchBins();
});
