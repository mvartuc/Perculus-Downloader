document.getElementById('start').onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      { code: `merge("${document.getElementById("file_name").value}.mp4")` });
  });
};

document.getElementById('file_name').value = "filename";
