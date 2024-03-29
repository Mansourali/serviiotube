///
/// initialization
///
var settings = new Store("settings");
var serviioApi = new ServiioApi(settings);
var lastTabId = 0;
var lastOnClicked = null;
var clickObj = {};

///
/// messaging with contentscripts
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
              sendResponse({ isValidResponse : serviioApi.isValidResponse(r), found: r != null, onlineRep: r });
          });
          return true;
      }
      ///
      /// addYoutubePlayList
      ///
      if (request.type == "addOnlineResource") {
          console.log("Request to add " + request.name);
          serviioApi.addOnlineResource(request.name, request.url, function (r) {
              sendResponse({ isValidResponse : serviioApi.isValidResponse(r), done: r });
          });
          return true;
      }

      ///
      /// removeYoutubePlayList
      ///
      if (request.type == "removeOnlineResource") {
          console.log("Request to remove " + request.id);
          serviioApi.removeOnlineResource(request.id, function (r) {
              sendResponse({ isValidResponse: serviioApi.isValidResponse(r), done: r });
          });
          return true;
      }

      ///
      /// refreshOnlineResource
      ///
      if (request.type == "refreshOnlineResource") {
          console.log("Request to refresh " + request.id);
          serviioApi.refreshOnlineResource(request.id, function (r) {
              sendResponse({ isValidResponse: serviioApi.isValidResponse(r), done: r });
          });
          return true;
      }
       
  });

///
/// Page action
///
chrome.pageAction.onClicked.addListener(function (tab) {
    // Called when the user clicks on the page action.
    if (clickObj.type == "results") {
        AddNewUrlToService(clickObj.name, getSearchUrl(tab.url));
    }
    else if (clickObj.type == "user") {
        AddNewUrlToService(clickObj.name, "https://gdata.youtube.com/feeds/api/users/" + getUserFromUrl(tab.url) + "/uploads");
    }
    else if (clickObj.type == "playlist") {
        AddNewUrlToService(clickObj.name, getPlaylistUrl(tab.url));
    }
    else if (clickObj.type == "watch") {
        AddNewUrlToService(clickObj.name, getPlaylistUrl(tab.url));
    }

});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == "complete") {
        var uri = tab.url;
        //check for youtube
        if (uri.indexOf("http://www.youtube.com/") == 0) {
            // Any results pages
            if (uri.indexOf("http://www.youtube.com/results") == 0) {
                chrome.pageAction.setTitle({ title: "Click to add search to serviio", tabId: tabId });
                chrome.pageAction.setIcon({ path: "images/icon.add.png", tabId: tabId });
                chrome.pageAction.show(tabId);
                clickObj = { type: "results", name: tab.title, url: uri, tabId: tabId };
            }
            // Any user pages
            else if (uri.indexOf("http://www.youtube.com/user/") == 0) {
                chrome.pageAction.setTitle({ title: "Click to add user feed to serviio", tabId: tabId });
                chrome.pageAction.setIcon({ path: "images/icon.add.png", tabId: tabId });
                chrome.pageAction.show(tabId);
                clickObj = { type: "user", name: tab.title, url: uri, tabId: tabId };
            }
            // Any pages playlist pages 
            else if (uri.indexOf("http://www.youtube.com/playlist") == 0) {
                chrome.pageAction.setTitle({ title: "Click to add playlist to serviio", tabId: tabId });
                chrome.pageAction.setIcon({ path: "images/icon.add.png", tabId: tabId });
                chrome.pageAction.show(tabId);
                clickObj = { type: "playlist", name: tab.title, url: uri, tabId: tabId };
            }
            // Any pages with playlist on watch
            else if (uri.indexOf("http://www.youtube.com/watch") == 0 && uri.indexOf("list=") > 0) {
                chrome.pageAction.setTitle({ title: "Click to add playlist to serviio", tabId: tabId });
                chrome.pageAction.setIcon({ path: "images/icon.add.png", tabId: tabId });
                chrome.pageAction.show(tabId);
                clickObj = { type: "watch", name: tab.title, url: uri, tabId: tabId };
            }
            else {
                clickObj = {}
            }
        }
    }
});

function AddNewUrlToService(name, url) {
    console.log("Adding " + url +" ["+name+"] to server" );
    chrome.pageAction.hide(clickObj.tabId);
    serviioApi.getOnlineResource(url,
    function (response) {
        // exception
        if (!serviioApi.isValidResponse(response)) {
            displayOptionToViewSettings();
        }
        else {
            if (response != null) {
                if (confirm("Feed already exists would you like to remove it")) {
                    serviioApi.removeOnlineResource(response.id, function (removed) {
                        console.log("Feed removed");
                    });
                }
            }
            else {
                serviioApi.addOnlineResource(name, url, function (added) {
                    console.log("Feed added");
                });
            }
        }
    });
}

function displayOptionToViewSettings() {
    if (confirm("Error while connecting to serviio. Would you like to check your settings?")) {
        chrome.tabs.create({
            'url': chrome.extension.getURL('settings/index.html'),
            'selected': true
        });
    }
}

function getPlaylistUrl(url) {
    var regEx = /list=PL([A-z0-9]+)/;
    var matches = regEx.exec(url);
    if (matches) {
        var playlistId = matches[1];
        var uri = "http://gdata.youtube.com/feeds/api/playlists/" + playlistId;
        return uri;
    }
    regEx = /list=([A-z0-9]+)/;
    matches = regEx.exec(url);
    playlistId = matches[1];
    uri = "http://gdata.youtube.com/feeds/api/playlists/" + playlistId;
    return uri;
};

function getParameterByName(name, url) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getUserFromUrl(url) {
    var regexS = "user/([^/^?^&^#]+)";
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
    var newUrl = "http://gdata.youtube.com/feeds/api/videos?q=" + searchString + "&v=2" + search_type;
    return newUrl;
}