'use strict';
/* global chrome */

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function (tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

function replaceLinks() {
  chrome.tabs.executeScript(null,
    {code: `
      console.log('Links Replaced!');
    `});
  setTimeout(function(){
    window.close();
  }, 2000);
}

function renderHTML(value) {
  document.getElementById('cakeTools').innerHTML = value;
}

document.addEventListener('DOMContentLoaded', function () {
  getCurrentTabUrl (function (url) {
    if (url.indexOf('datadog.zendesk.com/agent/tickets') > -1) {
      replaceLinks();
      renderHTML('Links Replaced!');
    } else {
      renderHTML('Page Not Supported');
    }
  });
});
