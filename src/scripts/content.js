import Outline from "../plugins/Outline/Outline.js";
import FullPages from "../plugins/FullPages/FullPages.js";
import SmallText from "../plugins/SmallText/SmallText.js";
import storage from "../utils/storage/index.js";
const outline = new Outline();
const fullPages = new FullPages();
const smallText = new SmallText();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  switch (request.id) {
    case "outline":
      outline.outlineShow = !outline.outlineShow;
      storage.getOutlineInfo().then(outlineInfo => {
        const newOutlineInfo = Object.assign(outlineInfo || {}, { show: outline.outlineShow });
        storage.setOutlineInfo(newOutlineInfo);
        outline.setShowOutline();
        // send to popup
        chrome.runtime.sendMessage({
          id: "outline",
          outlineInfo: newOutlineInfo,
        });
        sendResponse(outline.outlineShow);
      });
      break;
    case "fullPages":
      fullPages.fullPagesShow = !fullPages.fullPagesShow;
      storage.getFullPagesInfo().then(fullPagesInfo => {
        const newFullPagesInfo = Object.assign(fullPagesInfo || {}, { show: fullPages.fullPagesShow });
        storage.setFullPagesInfo(newFullPagesInfo);
        fullPages.setFullPages();
        chrome.runtime.sendMessage({
          id: "fullPages",
          fullPagesInfo: newFullPagesInfo,
        });
        sendResponse(fullPages.fullPagesShow);
      });
      break;
    case "smallText":
      smallText.smallTextShow = !smallText.smallTextShow;
      storage.getSmallTextInfo().then(smallTextInfo => {
        const newSmallTextInfo = Object.assign(smallTextInfo || {}, { show: smallText.smallTextShow });
        storage.setSmallTextInfo(newSmallTextInfo);
        smallText.setSmallText();
        chrome.runtime.sendMessage({
          id: "smallText",
          smallTextInfo: newSmallTextInfo,
        });
        sendResponse(smallText.smallTextShow);
      });
      break;
  }
});
