import Outline from "../plugins/Outline/Outline";
import FullPages from "../plugins/FullPages/FullPages";
import SmallText from "../plugins/SmallText/SmallText";
import storage from "../utils/storage";
import { IObjectKeys } from "../types/storage";

const outline = new Outline();
const fullPages = new FullPages();
const smallText = new SmallText();

const handleMessage = (target: Outline | FullPages | SmallText, request: any, sendResponse: (response?: any) => void) => {
  const id = request.id;
  target.isOpen = !target.isOpen;
  const getMethod = `get${id[0].toUpperCase() + id.slice(1)}Info`;
  const setMethod = `set${id[0].toUpperCase() + id.slice(1)}Info`;
  // @ts-ignore
  storage[getMethod as keyof IObjectKeys]().then(info => {
    const newStorageInfo = Object.assign(info || {}, { isOpen: target.isOpen });
    storage[setMethod](newStorageInfo);
    target.setStatus();
    chrome.runtime.sendMessage({
      id: request.id,
      storageInfo: newStorageInfo,
    });
    sendResponse(target.isOpen);
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.id) {
    case "outline":
      handleMessage(outline, request, sendResponse);
      break;
    case "fullPages":
      handleMessage(fullPages, request, sendResponse);
      break;
    case "smallText":
      handleMessage(smallText, request, sendResponse);
      break;
  }
});
