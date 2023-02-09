import "./outline.css";
import storage from "../../utils/storage/index.js";
import { debounce, getStyles } from "../../utils/index.js";
export default class Outline {
  static outlineWrapper = null;
  static headerClassName = "header-title";
  static outlineClassName = "outline-wrapper";
  static headerContainerClassName = "header-title-container";
  constructor(props = {}) {
    this.outerArea = props.outerArea || "#notion-app"; // parent container
    this.headerClassNameList = props.headerClassNameList || ["notion-header-block", "notion-sub_header-block", "notion-sub_sub_header-block"]; // h1~hN's class name
    this.indentGap = props.indentGap || 15; // Indent of outline tree
    this.innerArea = props.innerArea || ".whenContentEditable"; // editor container
    this.outlineParent = props.outlineParent || ".notion-frame"; // outline's parent element
    this.scrollContent = props.scrollContent || ".notion-frame .notion-scroller.vertical";
    this.eyeUrl = chrome.runtime.getURL("images/eye.svg");
    this.eyeHiddenUrl = chrome.runtime.getURL("images/eye-hidden.svg");
    this.init();
  }
  async init() {
    const outlineInfo = await storage.getOutlineInfo();
    this.outlineShow = outlineInfo ? outlineInfo.show : true;
    await storage.setOutlineInfo(Object.assign(outlineInfo || {}, { show: this.outlineShow }));
    this.bindContentScrollFn = debounce(this.headerScrollIntoView.bind(this), 500);
    this.observeContentChange();
  }

  observeContentChange() {
    const mainContainer = document.querySelector(this.outerArea);
    let contentHeight = 0;
    const observer = new MutationObserver((mutationList, observer) => {
      // Updated outline after content changes
      const content = document.querySelector(this.innerArea);
      if (content) {
        const newContentHeight = getStyles(content, "height");
        if (contentHeight !== newContentHeight) {
          contentHeight = newContentHeight;
          this.initOutlineWrapper();
        }
      }
      mutationList.forEach(mutation => {
        switch (mutation.type) {
          case "childList":
            if (
              mutation.removedNodes.length &&
              ![...mutation.removedNodes].some(v => v.className === Outline.headerClassName || v.className === Outline.headerContainerClassName)
            ) {
              this.initOutlineWrapper();
            }
            break;
          case "characterData":
            this.initOutlineWrapper();
            break;
        }
      });
    });
    observer.observe(mainContainer, {
      childList: true,
      // attributes: true,
      characterData: true,
      subtree: true,
    });
  }
  initOutlineWrapper() {
    setTimeout(() => {
      this.outlineDOMArr = this.getOutlineDOM();
      if (!Outline.outlineWrapper) {
        Outline.outlineWrapper = this.renderOutlineWrapper(document.querySelector(this.outlineParent));
      }
      this.renderOutlineTree(Outline.outlineWrapper, this.outlineDOMArr);
      this.setShowOutline();
      this.scrollContentEle = document.querySelector(this.scrollContent);
      this.removeListenerContentScroll();
      this.addListenerContentScroll();
      this.headerScrollIntoView();
    }, 500);
  }
  getOutlineDOM() {
    const outlineArr = [];
    const allChildren = document.querySelector(this.outlineParent).getAllElementChildren();
    for (const item of allChildren) {
      const isHeader = this.headerClassNameList.reduce((pre, cur) => {
        if (item.classList?.contains(cur) && item.innerText) {
          item.headerClassName = cur;
          return true;
        }
        return pre;
      }, false);
      if (isHeader) {
        outlineArr.push(item);
      }
    }
    return outlineArr;
  }
  renderOutlineWrapper(container) {
    container.style.position = "relative";
    const outlineWrapper = document.createElement("div");
    outlineWrapper.classList.add(Outline.outlineClassName);
    container.prepend(outlineWrapper);
    return outlineWrapper;
  }
  renderOutlineTree(container, DOMArr) {
    let headerClassNameList = [...this.headerClassNameList];
    const fragment = document.createDocumentFragment();
    fragment.append(this.generateHeader());
    fragment.append(this.generateOutlineContainer(DOMArr, headerClassNameList));
    container.innerHTML = "";
    container.append(fragment);
  }
  generateHeader() {
    const header = document.createElement("header");
    header.className = "outline-header";

    const title = document.createElement("div");
    title.className = "item";
    title.innerText = "Outline";

    // const eye = document.createElement('img');
    // eye.className = 'item';
    // eye.addEventListener('click', () => {
    //   this.outlineShow = !this.outlineShow;
    //   this.setShowOutline();
    // });
    // this.eye = eye;

    header.append(title);
    return header;
  }
  generateOutlineContainer(DOMArr, headerClassNameList) {
    const headerContainer = document.createElement("div");
    headerContainer.className = Outline.headerContainerClassName;
    // 有h1，则 headerClassNameList 不变
    // 无h1，找有没有h2，有则从 h2 开始， headerClassNameList 往后不变
    for (let i = 0; i < headerClassNameList.length; i++) {
      if (!DOMArr.some(v => v.headerClassName === headerClassNameList[i])) {
        headerClassNameList.splice(i, 1);
        i--;
      } else {
        break;
      }
    }
    for (const dom of DOMArr) {
      const div = document.createElement("div");
      div.className = "header-title";
      div.style.paddingLeft = headerClassNameList.findIndex(v => v === dom.headerClassName) * this.indentGap + "px";
      const dataBlockId = dom.getAttribute("data-block-id");
      const id = dataBlockId.replaceAll("-", "");
      div.innerHTML = `<a href="#${id}">${dom.innerText}</a>`;
      div.title = `${dom.innerText}`;
      div.dataset.id = dataBlockId;
      headerContainer.append(div);
    }
    return headerContainer;
  }
  setShowOutline() {
    // this.eye.src = this.outlineShow ? this.eyeHiddenUrl : this.eyeUrl;
    this.outlineShow ? Outline.outlineWrapper.classList.add("show") : Outline.outlineWrapper.classList.remove("show");
  }
  addListenerContentScroll() {
    this.scrollContentEle.addEventListener("scroll", this.bindContentScrollFn);
  }
  removeListenerContentScroll() {
    this.scrollContentEle.removeEventListener("scroll", this.bindContentScrollFn);
  }
  headerScrollIntoView() {
    const ele = this.scrollContentEle;
    for (const header of this.outlineDOMArr) {
      if (header.offsetTop < ele.scrollTop + ele.clientHeight && header.offsetTop + parseInt(header.getBoundingClientRect().height) >= ele.scrollTop) {
        const targets = document.getElementsByClassName(Outline.headerClassName);
        [...targets].forEach(v => v.classList.remove("scroll-into-view"));
        const firstTarget = [...targets].find(v => v.dataset.id === header.dataset.blockId);
        if (firstTarget) {
          firstTarget.classList.add("scroll-into-view");
          firstTarget.scrollIntoView({
            // behavior: 'smooth',
            block: "center",
          });
        }
        break;
      }
    }
  }
}
