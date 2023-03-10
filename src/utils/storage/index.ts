import Storage from "./Storage.js";

const prefix = "notion-";

interface IObjectKeys {
  [key: string]: any;
}

const storage: IObjectKeys = {
  // 设置 outline info
  async setOutlineInfo(data: any) {
    return Storage.set(prefix + "OutlineInfo", data); // notion-OutlineInfo: { show: true }
  },
  async getOutlineInfo() {
    return Storage.get(prefix + "OutlineInfo");
  },
  async removeOutlineInfo() {
    return Storage.remove(prefix + "OutlineInfo");
  },
  // 设置 fullPages info
  async setFullPagesInfo(data: any) {
    return Storage.set(prefix + "FullPagesInfo", data); // notion-FullPagesInfo: { show: true }
  },
  async getFullPagesInfo() {
    return Storage.get(prefix + "FullPagesInfo");
  },
  async removeFullPagesInfo() {
    return Storage.remove(prefix + "FullPagesInfo");
  },
  // 设置 smallText info
  async setSmallTextInfo(data: any) {
    return Storage.set(prefix + "SmallTextInfo", data); // notion-SmallTextInfo: { show: true }
  },
  async getSmallTextInfo() {
    return Storage.get(prefix + "SmallTextInfo");
  },
  async removeSmallTextInfo() {
    return Storage.remove(prefix + "SmallTextInfo");
  },
};

export default storage;
