// 添加日志
function addLog(message) {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] ${message}`);
}

// 获取所有 bins
export async function fetchBins() {
    addLog('正在获取 bins...');
    try {
        const response = await fetch('https://api.jsonbin.io/v3/c/uncategorized/bins', {
            method: 'GET',
            headers: {
                'X-Master-key': '$2a$10$rEId5bUDOPNeLaQGQFcVy.ioVLw1iAa5Y9KEbgSG3wyUTjW/qa4Rq'
            }
        });
        const bins = await response.json();
        addLog('成功获取 bins。');
        return bins;
    } catch (error) {
        addLog(`获取 bins 时出错: ${error.message}`);
        return [];
    }
}

// 填充 bins 下拉列表
export function populateBinsList(bins) {
    const binsList = document.getElementById('binsList');
    binsList.innerHTML = '<option value="">选择一个 Bin</option>';
    bins.forEach(bin => {
        const option = document.createElement('option');
        const binName = bin.snippetMeta.name || bin.record;
        option.value = bin.record;
        option.textContent = binName;
        binsList.appendChild(option);
    });

    binsList.addEventListener('change', fetchBinContent);
}

// 获取选定 bin 的内容
export async function fetchBinContent() {
    const binId = document.getElementById('binsList').value;
    if (!binId) return;

    addLog(`正在获取 Bin ID: ${binId} 的内容...`);
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-key': '$2a$10$rEId5bUDOPNeLaQGQFcVy.ioVLw1iAa5Y9KEbgSG3wyUTjW/qa4Rq'
            }
        });
        const { record } = await response.json();
        addLog('成功获取 Bin 内容。');
        const jsonContent = document.getElementById('jsonContent');
        jsonContent.value = JSON.stringify(record, null, 2);
        jsonContent.disabled = false;
        const updateBtn = document.getElementById('updateBtn');
        updateBtn.disabled = false;
        const deleteBtn = document.getElementById('deleteBtn');
        deleteBtn.disabled = false;
        const binNameInput = document.getElementById('binName');
        binNameInput.disabled = false;
        const setNameBtn = document.getElementById('setNameBtn');
        setNameBtn.disabled = false;
    } catch (error) {
        addLog(`获取 Bin 内容时出错: ${error.message}`);
    }
}

// 更新 bin 内容
export async function updateBin() {
    const binId = document.getElementById('binsList').value;
    const updatedContent = JSON.parse(document.getElementById('jsonContent').value);

    addLog(`正在更新 Bin ID: ${binId}...`);
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-key': '$2a$10$rEId5bUDOPNeLaQGQFcVy.ioVLw1iAa5Y9KEbgSG3wyUTjW/qa4Rq'
            },
            body: JSON.stringify(updatedContent)
        });

        if (response.ok) {
            addLog('成功更新 Bin！');
        } else {
            throw new Error('更新 Bin 失败');
        }
    } catch (error) {
        addLog(`更新 Bin 时出错: ${error.message}`);
    }
}

// 删除 bin
export async function deleteBin() {
    const binId = document.getElementById('binsList').value;

    addLog(`正在删除 Bin ID: ${binId}...`);
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            method: 'DELETE',
            headers: {
                'X-Master-key': '$2a$10$rEId5bUDOPNeLaQGQFcVy.ioVLw1iAa5Y9KEbgSG3wyUTjW/qa4Rq'
            }
        });

        if (response.ok) {
            addLog('成功删除 Bin！');
            // 刷新列表
            fetchBins().then(bins => populateBinsList(bins));
        } else {
            throw new Error('删除 Bin 失败');
        }
    } catch (error) {
        addLog(`删除 Bin 时出错: ${error.message}`);
    }
}

// 设置 bin 名称
export async function setBinName() {
    const binId = document.getElementById('binsList').value;
    const binName = document.getElementById('binName').value.trim();

    if (!binName) {
        addLog('请输入有效的 Bin 名称。');
        return;
    }

    addLog(`正在设置 Bin ID: ${binId} 的名称...`);
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/meta/name`, {
            method: 'PUT',
            headers: {
                'X-Master-key': '$2a$10$rEId5bUDOPNeLaQGQFcVy.ioVLw1iAa5Y9KEbgSG3wyUTjW/qa4Rq',
                'X-Bin-Name': binName
            },
            body: JSON.stringify({})
        });

        if (response.ok) {
            addLog('成功设置 Bin 名称！');
            // 刷新列表
            fetchBins().then(bins => populateBinsList(bins));
        } else {
            throw new Error('设置 Bin 名称失败');
        }
    } catch (error) {
        addLog(`设置 Bin 名称时出错: ${error.message}`);
    }
}

// 打开新建 bin 窗口
export function openNewBinWindow() {
    const newWindow = window.open('', 'newBinWindow', 'width=400,height=300');
    newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>新建 Bin</title>
            <link rel="stylesheet" href="../styles.css">
        </head>
        <body>
            <h1>新建 Bin</h1>
            <textarea id="newBinContent" placeholder="输入 JSON 数据"></textarea>
            <input type="text" id="newBinName" placeholder="输入新 Bin 名称">
            <button id="createBinBtn">新建 Bin</button>
            <script>
                const apiKey = '${'$2a$10$rEId5bUDOPNeLaQGQFcVy.ioVLw1iAa5Y9KEbgSG3wyUTjW/qa4Rq'}';
                const createBinBtn = document.getElementById('createBinBtn');
                const newBinContent = document.getElementById('newBinContent');
                const newBinName = document.getElementById('newBinName');

                // 新建 bin
                async function createBin() {
                    const content = newBinContent.value.trim();
                    const binName = newBinName.value.trim();

                    if (!content) {
                        alert('请输入有效的 JSON 数据。');
                        return;
                    }

                    try {
                        const jsonData = JSON.parse(content);

                        const response = await fetch('https://api.jsonbin.io/v3/b', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Master-key': apiKey,
                                'X-Bin-Name': binName
                            },
                            body: JSON.stringify(jsonData)
                        });

                        if (response.ok) {
                            alert('成功新建 Bin！');
                            window.close();
                        } else {
                            throw new Error('新建 Bin 失败');
                        }
                    } catch (error) {
                        alert('新建 Bin 时出错: ' + error);
                    }
                }

                createBinBtn.addEventListener('click', createBin);
            </script>
        </body>
        </html>
    `);
}
