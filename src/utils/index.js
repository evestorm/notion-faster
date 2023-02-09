export function getStyles(elem, prop) {
  if (window.getComputedStyle) {
    if (prop) {
      return window.getComputedStyle(elem, null)[prop];
    } else {
      return window.getComputedStyle(elem, null);
    }
  } else {
    if (prop) {
      return window.currentStyle(elem, null)[prop];
    } else {
      return window.currentStyle(elem, null);
    }
  }
}

export function debounce(fn, delay, triggerNow) {
  let timer = null;
  return function () {
    if (timer) window.clearTimeout(timer);
    if (triggerNow) {
      let exec = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, delay);
      if (exec) {
        fn.apply(this, arguments);
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
        timer = null;
      }, delay);
    }
  };
}

export function throttle(fn, delay) {
  let canUse = true;
  return function () {
    if (canUse) {
      fn.apply(this, arguments);
      canUse = false;
      setTimeout(() => (canUse = true), delay);
    }
  };
}

HTMLElement.prototype.getAllElementChildren = function () {
  let ownChildNodes = this.childNodes,
    elementChildren = [];
  for (let i = 0; i < ownChildNodes.length; i++) {
    const nodeItem = ownChildNodes[i];
    if (nodeItem.nodeType === 1 && nodeItem.nodeName !== "svg") {
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
