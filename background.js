chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case 'show-outline':
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (tabs) => {
        let message = { id: 'outline' };
        // send to content script
        chrome.tabs.sendMessage(tabs[0].id, message);
      })
      break;
    case 'show-fullPages':
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (tabs) => {
        let message = { id: 'fullPages' };
        // send to content script
        chrome.tabs.sendMessage(tabs[0].id, message);
      })
      break;
    case 'show-smallText':
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (tabs) => {
        let message = { id: 'smallText' };
        // send to content script
        chrome.tabs.sendMessage(tabs[0].id, message);
      })
      break;
  }
});