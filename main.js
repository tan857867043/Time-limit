import {
    fetchBins,
    populateBinsList,
    fetchBinContent,
    updateBin,
    deleteBin,
    setBinName,
    openNewBinWindow,
    addLog
} from './jsonBinService.js';

const apiKey = '$2a$10$rEId5bUDOPNeLaQGQFcVy.ioVLw1iAa5Y9KEbgSG3wyUTjW/qa4Rq';
const binsList = document.getElementById('binsList');
const jsonContent = document.getElementById('jsonContent');
const updateBtn = document.getElementById('updateBtn');
const deleteBtn = document.getElementById('deleteBtn');
const binNameInput = document.getElementById('binName');
const setNameBtn = document.getElementById('setNameBtn');
const logContent = document.getElementById('logContent');
const newBinWindowBtn = document.getElementById('newBinWindowBtn');

// 添加日志
function addLog(message) {
    const timestamp = new Date().toLocaleString();
    logContent.textContent += `[${timestamp}] ${message}\n`;
    logContent.scrollTop = logContent.scrollHeight;
}

// 初始化
fetchBins();

binsList.addEventListener('change', fetchBinContent);
updateBtn.addEventListener('click', updateBin);
deleteBtn.addEventListener('click', deleteBin);
setNameBtn.addEventListener('click', setBinName);
newBinWindowBtn.addEventListener('click', openNewBinWindow);
