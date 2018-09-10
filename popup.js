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
  var regMatch = /https:\/\/(?!partlow|docs|help|www)\S*.datadoghq\S*/g;
  var regReplace = /https\S*datadoghq.com/g;
  chrome.tabs.executeScript(null,
    {code: `
      chrome.storage.local.set({
        'cakeToolStatus': 'No Links Found',
      });
      var orgId = '';
      var nodeList = document.querySelectorAll('.ember-view.form_field.custom_field_25184603 input');
      for(var x = 0; x < nodeList.length; x++) {
        if (nodeList[x].value) {
          orgId = nodeList[x].value;
        }
      }
      if(orgId) {
        var els = document.querySelectorAll('div.comment a');
        for (var i = 0; i < els.length; i++) {
          var linkText = els[i].innerText;
          if(linkText.match(${regMatch})){
            linkText = linkText.replace(${regReplace}, 'https://partlow.datadoghq.com/admin/switch_handle_get/org_id/' + orgId + '?next_url=');
            els[i].href = linkText;
            els[i].innerText = linkText;
            chrome.storage.local.set({
              'cakeToolStatus': 'Links Replaced!',
            });
          }
        }
      } else {
        chrome.storage.local.set({
          'cakeToolStatus': 'Please fill in the org_id field',
        });
      }
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
      replaceLinks()
      setTimeout(()=>{
        chrome.storage.local.get(['cakeToolStatus'], function(result) {
          renderHTML(result.cakeToolStatus);
        })
      }, 100);
    } else {
      renderHTML('Page Not Supported');
      setTimeout(()=>{
        window.close();
      }, 2000);
    }
  });
});
