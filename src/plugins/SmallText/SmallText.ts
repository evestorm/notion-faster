import "./smallText.css";
import storage from "../../utils/storage";
interface IProps {
  targetSelector?: string;
}
export default class SmallText {
  static targetEle: HTMLElement | null = null;
  private targetSelector: string;
  isOpen: boolean = true;
  constructor(props: IProps = {}) {
    this.targetSelector = props.targetSelector || "#notion-app";
    this.init();
  }
  async init() {
    const targetEle = document.querySelector(this.targetSelector) as HTMLElement;
    if (targetEle) {
      SmallText.targetEle = targetEle;
      const smallTextInfo = await storage.getSmallTextInfo();
      console.log(smallTextInfo);
      this.isOpen = smallTextInfo ? smallTextInfo.isOpen : false;
      await storage.setSmallTextInfo(Object.assign(smallTextInfo || {}, { isOpen: this.isOpen }));
      this.setStatus();
    }
  }
  setStatus() {
    // @ts-ignore
    this.isOpen ? SmallText.targetEle.classList.add("small-text") : SmallText.targetEle.classList.remove("small-text");
  }
}
