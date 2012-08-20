///
/// Init
///
var settings = new Store("settings");
var serviioApi = new ServiioApi(settings);

///
/// messaging
///
chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
      console.log("Message Type: " + request.type);
      ///
      /// hasYoutubePlayList
      ///
      if (request.type == "getOnlineResource") {
          console.log("Request playlist info for " + request.url);
          //sendResponse({ hasYoutubePlayList: false });
          serviioApi.getOnlineResource(request.url, function (r) {
              sendResponse({ found: r != null, onlineRep: r });
          });
          return true;
      }
      ///
      /// addYoutubePlayList
      ///
      if (request.type == "addOnlineResource") {
          console.log("Request to add " + request.name);
          serviioApi.addOnlineResource(request.name, request.url, function (r) {
              sendResponse({ done: r });
          });
          return true;
      }

      ///
      /// removeYoutubePlayList
      ///
      if (request.type == "removeOnlineResource") {
          console.log("Request to remove " + request.id);
          serviioApi.removeOnlineResource(request.id, function (r) {
              sendResponse({ done: r });
          });
          return true;
      }
  });

  ///
  /// Page action
  ///

  var lastTabId = 0;
  var lastOnClicked = null;
  var clickObj = {};
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      console.log(changeInfo);
      if (changeInfo.status == "complete") {
          var uri = tab.url;
          //check for youtube
          if (uri.indexOf("http://www.youtube.com/") == 0) {
              // Any results pages
              if (uri.indexOf("http://www.youtube.com/results") == 0) {
                  chrome.pageAction.setTitle({ title: "Click to add search to serviio", tabId: tabId });
                  chrome.pageAction.setIcon({ path: "icon.png", tabId: tabId });
                  chrome.pageAction.show(tabId);
                  clickObj = { type: "results", name: tab.title, url: uri, tabId: tabId };
              }
              // Any user pages
              else if (uri.indexOf("http://www.youtube.com/user/") == 0) { 
                  chrome.pageAction.setTitle({ title: "Click to add user feed to serviio", tabId: tabId });
                  chrome.pageAction.setIcon({ path: "icon.png", tabId: tabId });
                  chrome.pageAction.show(tabId);
                  clickObj = { type: "user", name: tab.title, url: uri, tabId: tabId };
              }
              // Any pages with a list 
              else if (uri.indexOf("http://www.youtube.com/playlist") == 0) {
                  chrome.pageAction.setTitle({ title: "Click to add playlist to serviio", tabId: tabId });
                  chrome.pageAction.setIcon({ path: "icon.png", tabId: tabId });
                  chrome.pageAction.show(tabId);
                  clickObj = { type: "playlist", name: tab.title, url: uri, tabId: tabId };
              }
          }

      }
  });


  // Called when the user clicks on the page action.
  chrome.pageAction.onClicked.addListener(function (tab) {
      console.log(clickObj);
      if (clickObj.type == "results") {
          AddNewUrlToService(clickObj.name,getSearchUrl(tab.url));
      }
      else if (clickObj.type == "user") {
          AddNewUrlToService(clickObj.name, "https://gdata.youtube.com/feeds/api/users/" + getUserFromUrl(tab.url) + "/uploads");
      }
      else if (clickObj.type == "playlist") {
          AddNewUrlToService(clickObj.name, getPlaylistUrl(tab.url));
      }
      
  });

  function AddNewUrlToService(name,url) {
         console.log("check");
          chrome.pageAction.hide(clickObj.tabId);
          serviioApi.getOnlineResource(url, function (r) {
              if (r != null) {
                  if (confirm("Feed already exists would you like to remove it")) {
                      serviioApi.removeOnlineResource(r.id, function (removed) {
                          console.log("removed");
                      });
                   }
                  
              }
              else {
                serviioApi.addOnlineResource(name, url, function (added) {
                      console.log("added");
                  });
              }
          });


  }

  function getPlaylistUrl(url) {
      var regEx = /list=PL([A-Z0-9]+)/;
      var matches = regEx.exec(url);
      var playlistId = matches[1];
      return "http://gdata.youtube.com/feeds/api/playlists/" + playlistId;
  };

  function getParameterByName(name,url)
    {
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regexS = "[\\?&]" + name + "=([^&#]*)";
      var regex = new RegExp(regexS);
      var results = regex.exec(url);
      if(results == null)
        return "";
      else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    function getUserFromUrl(url) {
        var regexS = "user/([^/]+)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        if (results == null)
            return "";
        else
            return results[1]
    }
    function getSearchUrl(url) {
        var searchString = escape(getParameterByName("search_query", url));
        var search_type = escape(getParameterByName("search_type", url).trim());
        if (search_type.trim().length != 0) search_type = "&category=" + search_type;
        var newUrl = "http://gdata.youtube.com/feeds/api/videos?q=" + searchString + "&start-index=1&max-results=20&v=2" + search_type;
        return newUrl;
    }

  /*


  serviioApi.forceLibraryRefresh(10,function (r) {
  console.log("result: ");
  console.log(r);
  });

  serviioApi.removeYoutubePlayList("FFDE85E34CF2CB80", function (r) {
  console.log("result: " + r);
  });

  */


  /*
  var id = 10;
  var action = '<?xml version="1.0" encoding="UTF-8" ?>\n<action><name>forceOnlineResourceRefresh</name><parameter>' + id + '</parameter></action>';
  //var action = '123';
  console.log("Start");
  console.log(action);
  $.ajax({
  type: "POST",
  url: "http://10.0.0.4:23423/rest/action",
  data: action,
  success: function (data) {
  console.log(data);
  },
  error: function (data) {
  console.log(data);
  },
  dataType: "xml",
  headers: { Accept: "application/xml", "Content-Type": "application/xml; charset=UTF-8" },
  scriptCharset: "utf-8"
  });

  */

  ;