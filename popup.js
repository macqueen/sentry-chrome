var getHostname = function(url) {
  var location = document.createElement('a');
  location.href = url;
  return location.hostname;
};

document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({active: true}, function(tabs) {
    var hostname = getHostname(tabs[0].url);
    chrome.storage.local.get(hostname, function(items) {
      var dsn = items[hostname];
      if (dsn) {
        document.getElementById('dsn').value = dsn;
      }
    });
  });

  document.getElementById('dsn-form').addEventListener('submit', function(evt) {
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
      });
    });
  });

  document.getElementById('clear-form').addEventListener('submit', function(evt) {
    evt.preventDefault();
    var radios = document.getElementsByName('clearInstalls');
    var value;
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        value = radios[i].value;
        break;
      }
    }
    if (value === 'all') {
      chrome.storage.local.clear();
    } else if (value === 'current') {
      chrome.tabs.query({active: true}, function(tabs) {
        var url = tabs[0].url;
        chrome.storage.local.remove(getHostname(url));
      });
    }
    document.getElementById('dsn').value = '';
  });
});
