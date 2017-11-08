var getHostname = function(url) {
  var location = document.createElement('a');
  location.href = url;
  return location.hostname;
};

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('form').addEventListener('submit', function(evt) {
    evt.preventDefault();
    var dsnEl = document.getElementById('dsn');
    chrome.tabs.query({active: true}, function(tabs) {
      var url = tabs[0].url;
      var items = {};
      items[getHostname(url)] = dsnEl.value;
      chrome.storage.local.set(items, function() {
        // TODO: handle failure
        chrome.tabs.executeScript(null, {
          code: 'window.location.reload();'
        })
        dsnEl.value = '';
      });
    });
  });
});
