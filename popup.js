// let injected = false;
// const scan = () => {
//   console.log("scan");
//   if (injected) {
//     alert("done");
//     sel.disabled = true;
//     return;
//   }
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.tabs
    .executeScript(tabs[0].id, {
      // code: 'document.body.style.backgroundColor = "red";',
      file: "inject/index.js",
      allFrames: true,
    })
    .then(() => {});
  injected = true;
});
// };

// const sel = document.querySelector("#scan");
// sel.onclick = scan;
// const del = document.querySelector("#download");
// del.onclick = () => alert("download");
