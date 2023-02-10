import "./fullPages.css";
import storage from "../../utils/storage/index";

interface IProps {
  targetSelector?: string;
}
export default class FullPages {
  static targetEle: null | Element = null;
  private readonly targetSelector: string;
  isOpen: boolean = true;
  constructor(props: IProps = {}) {
    this.targetSelector = props.targetSelector || "#notion-app";
    this.init();
  }
  async init() {
    const targetEle = document.querySelector(this.targetSelector);
    if (targetEle) {
      FullPages.targetEle = targetEle;
      const fullPagesInfo = await storage.getFullPagesInfo();
      this.isOpen = fullPagesInfo ? fullPagesInfo.isOpen : false;
      await storage.setFullPagesInfo(Object.assign(fullPagesInfo || {}, { isOpen: this.isOpen }));
      this.setStatus();
    }
  }
  setStatus() {
    this.isOpen ? FullPages.targetEle!.classList.add("full-width") : FullPages.targetEle!.classList.remove("full-width");
  }
}
