document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('form').addEventListener('submit', function(evt) {
    evt.preventDefault();
    var dsnEl = document.getElementById('dsn');
    chrome.tabs.query({active: true}, function(tabs) {
      var url = tabs[0].url;
      var items = {};
      items[url] = dsnEl.value;
      chrome.storage.local.set(items, function() {
        // TODO: handle failure
      });
      dsnEl.value = '';
    });
  });
});

