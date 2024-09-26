const apiKey = '$2a$10$rEId5bUDOPNeLaQGQFcVy.ioVLw1iAa5Y9KEbgSG3wyUTjW/qa4Rq';

export async function fetchBins() {
    try {
        const response = await fetch('https://api.jsonbin.io/v3/c/uncategorized/bins', {
            method: 'GET',
            headers: {
                'X-Master-key': apiKey
            }
        });
        const bins = await response.json();
        return bins;
    } catch (error) {
        throw new Error(`获取 bins 时出错: ${error}`);
    }
}

export async function fetchBinContent(binId) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
            method: 'GET',
            headers: {
                'X-Master-key': apiKey
            }
        });
        const { record } = await response.json();
        return record;
    } catch (error) {
        throw new Error(`获取 Bin 内容时出错: ${error}`);
    }
}

export async function updateBin(binId, updatedContent) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-key': apiKey
            },
            body: JSON.stringify(updatedContent)
        });
        if (response.ok) {
            return true;
        } else {
            throw new Error('更新 Bin 失败');
        }
    } catch (error) {
        throw new Error(`更新 Bin 时出错: ${error}`);
    }
}

export async function deleteBin(binId) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            method: 'DELETE',
            headers: {
                'X-Master-key': apiKey
            }
        });
        if (response.ok) {
            return true;
        } else {
            throw new Error('删除 Bin 失败');
        }
    } catch (error) {
        throw new Error(`删除 Bin 时出错: ${error}`);
    }
}

export async function setBinName(binId, binName) {
    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/meta/name`, {
            method: 'PUT',
            headers: {
                'X-Master-key': apiKey,
                'X-Bin-Name': binName
            },
            body: JSON.stringify({})
        });
        if (response.ok) {
            return true;
        } else {
            throw new Error('设置 Bin 名称失败');
        }
    } catch (error) {
        throw new Error(`设置 Bin 名称时出错: ${error}`);
    }
}

export async function createBin(content, binName) {
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
            return true;
        } else {
            throw new Error('新建 Bin 失败');
        }
    } catch (error) {
        throw new Error(`新建 Bin 时出错: ${error}`);
    }
}
