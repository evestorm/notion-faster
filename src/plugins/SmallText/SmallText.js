import "./smallText.css";
import storage from "../../utils/storage/index.js";
export default class SmallText {
  static targetEle = null;
  constructor(props = {}) {
    this.targetSelector = props.targetSelector || "#notion-app";
    this.init();
  }
  async init() {
    const targetEle = document.querySelector(this.targetSelector);
    if (targetEle) {
      SmallText.targetEle = targetEle;
      const smallTextInfo = await storage.getSmallTextInfo();
      this.smallTextShow = smallTextInfo ? smallTextInfo.show : false;
      await storage.setSmallTextInfo(Object.assign(smallTextInfo || {}, { show: this.smallTextShow }));
      this.setSmallText();
    }
  }
  setSmallText() {
    this.smallTextShow ? SmallText.targetEle.classList.add("small-text") : SmallText.targetEle.classList.remove("small-text");
  }
}
