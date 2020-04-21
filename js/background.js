// chrome.tabs.onCreated.addListener(function (tab) {
//   var newURL = "http://stackoverflow.com/";
//   chrome.tabs.create({ url: newURL });
// })

chrome.runtime.onStartup.addListener(function() {
  table_data = localStorage.getItem(`table_data`);
})
