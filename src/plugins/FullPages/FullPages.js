import "./fullPages.css";
import storage from "../../utils/storage/index.js";
export default class FullPages {
  static targetEle = null;
  constructor(props = {}) {
    this.targetSelector = props.targetSelector || "#notion-app";
    this.init();
  }
  async init() {
    const targetEle = document.querySelector(this.targetSelector);
    if (targetEle) {
      FullPages.targetEle = targetEle;
      const fullPagesInfo = await storage.getFullPagesInfo();
      this.fullPagesShow = fullPagesInfo ? fullPagesInfo.show : false;
      await storage.setFullPagesInfo(Object.assign(fullPagesInfo || {}, { show: this.fullPagesShow }));
      this.setFullPages();
    }
  }
  setFullPages() {
    this.fullPagesShow ? FullPages.targetEle.classList.add("full-width") : FullPages.targetEle.classList.remove("full-width");
  }
}
