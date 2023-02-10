export function getStyles(elem: Element, prop: any) {
  if (window.getComputedStyle) {
    if (prop) {
      return window.getComputedStyle(elem, null)[prop];
    } else {
      return window.getComputedStyle(elem, null);
    }
  } else {
    if (prop) {
      // @ts-ignore
      return window.currentStyle(elem, null)[prop];
    } else {
      // @ts-ignore
      return window.currentStyle(elem, null);
    }
  }
}

export function debounce(fn: any, delay: number, triggerNow: boolean = false) {
  let timer: number | null = null;
  return function () {
    if (timer) window.clearTimeout(timer);
    if (triggerNow) {
      let exec = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, delay);
      if (exec) {
        // @ts-ignore
        fn.apply(this, arguments);
      }
    } else {
      timer = setTimeout(() => {
        // @ts-ignore
        fn.apply(this, arguments);
        timer = null;
      }, delay);
    }
  };
}

export function throttle(fn: any, delay: number) {
  let canUse = true;
  return function () {
    if (canUse) {
      // @ts-ignore
      fn.apply(this, arguments);
      canUse = false;
      setTimeout(() => (canUse = true), delay);
    }
  };
}

// @ts-ignore
HTMLElement.prototype.getAllElementChildren = function () {
  let ownChildNodes = this.childNodes,
    elementChildren = [];
  for (let i = 0; i < ownChildNodes.length; i++) {
    const nodeItem = ownChildNodes[i];
    if (nodeItem.nodeType === 1 && nodeItem.nodeName !== "svg") {
      // @ts-ignore
      const subElementChildren = nodeItem.getAllElementChildren();
      if (subElementChildren.length > 0) {
        elementChildren.push(nodeItem, ...subElementChildren);
      } else {
        elementChildren.push(nodeItem);
      }
    }
  }
  return elementChildren;
};
