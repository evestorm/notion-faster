class StorageCell {
  private data: any;
  private timeout: number;
  private createTime: number;
  constructor(data: any, timeout: number) {
    this.data = data;
    this.timeout = timeout; // 超时时间，单位秒
    this.createTime = Date.now(); // 创建时间
  }
}

class Storage {
  constructor() {}

  async get(key: string) {
    let cacheCell = null;
    const [err, ret] = await this.getStorageData(key);
    if (!err) {
      cacheCell = ret[key];
      if (!cacheCell) return null;
      const currentTime = Date.now();
      const overTime = (currentTime - cacheCell.createTime) / 1000;
      // 手动设置了缓存且超时再清除
      if (cacheCell.timeout !== 0 && overTime > cacheCell.timeout) {
        await this.remove(key);
        cacheCell.data = null;
      }
      if (cacheCell.data) {
        return cacheCell.data;
      }
    }
    return null;
  }

  // 默认永久缓存(0)
  async set(key: string, data: any, timeout = 0) {
    const cacheCell = new StorageCell(data, timeout);
    return await this.setStorageData(key, cacheCell);
  }

  async remove(key: string) {
    try {
      await chrome.storage.sync.remove(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  async has(key: string) {
    try {
      const allItems = await chrome.storage.sync.get();
      return key in allItems;
    } catch (e) {
      console.error(e);
    }
  }

  async clear() {
    try {
      const allItems = await chrome.storage.sync.get();
      for (const item of Object.keys(allItems)) {
        await chrome.storage.sync.remove(item);
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  getStorageData(key: string): Promise<[any, any]> {
    return new Promise((resolve, reject) =>
      chrome.storage.sync.get(key, result => (chrome.runtime.lastError ? resolve([Error(chrome.runtime.lastError.message), undefined]) : resolve([undefined, result]))),
    );
  }

  setStorageData(key: string, data: any) {
    return new Promise((resolve, reject) => chrome.storage.sync.set({ [key]: data }, () => resolve(!chrome.runtime.lastError)));
  }
}

export default new Storage();
