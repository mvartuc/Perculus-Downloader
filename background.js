chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        // When a page is a Perculus Lecture page...
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { schemes: ['https', 'http'] },
          css: ["div[id = 'perculus-container']"]
        })
      ],
      // ... show the page action.
      actions: [new chrome.declarativeContent.ShowPageAction() ]
    }]);
  });
});
