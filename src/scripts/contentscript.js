console.log("[TS] " + "Start loading");

var buttonAddStyle = generateButton("Add to serviio", "images/icon.add.png", "add");
var buttonRemoveStyle = generateButton("Remove from serviio", "images/icon.remove.png", "remove");
var buttonRefreshStyle = generateButton("Refresh feed on serviio", "images/icon.refresh.png", "refresh"); 

// look through all edit buttons
$('.yt-lockup2-content').each(function (index) {
    
    var name = $(this).find('.yt-uix-sessionlink').text();
    var playListUri = $(this).find('.yt-uix-sessionlink').attr("href");
    var playlistId = extractPlaylistId(playListUri);
    var playlistUrl = getPlaylistUrl(playlistId);
    console.log("Found playlist " + name + "  " + playListUri + "  " + playlistUrl + " ");
    var currentButtonCollection = $(this).find('.yt-lockup2-meta-info, .yt-lockup2-meta').last();
    getOnlineResource(playlistUrl, function (response) {
        if (!response.isValidResponse) return "";
        //Append the add 
        var addbutton = currentButtonCollection.append(buttonAddStyle).find(".add");
        var removebutton = currentButtonCollection.append(buttonRemoveStyle).find(".remove");
        var refbutton = currentButtonCollection.append(buttonRefreshStyle).find(".refresh");

        addbutton.click(function () {
            var currentButton = $(this);
            currentButton.hide('slow');
            if (!response.found) {
                addOnlineResource(name, playlistUrl, function (r) {
                    getOnlineResource(playlistUrl, function (getNv) {
                        response = getNv;
                        removebutton.show('slow');
                        refbutton.show('slow');
                    });

                });
            }
        });
        
        //Append remove button
        removebutton.click(function () {
            var currentButton = $(this);
            currentButton.hide('slow');
            if (response.found) {
                console.log(response);
                removeOnlineResource(response.onlineRep.id, function (r) {
                    response.found = false;
                    addbutton.show('slow');
                    refbutton.hide('slow');
                });
            }
        });

        //Append the add refresh button
        refbutton.click(function () {
            var currentButton = $(this);
            if (response.found) {
                currentButton.hide('slow');
                refreshOnlineResource(response.onlineRep.id, function (r) {
                    if (!response.isValidResponse) return "";
                    currentButton.show('slow');
                });
            }
        });

        if (response.found) {
            removebutton.show('slow');
            refbutton.delay(1000).show('slow');
        }
        else {
            addbutton.show('slow');
        }

    });

});

function generateButton(name, icon, className) {
    var textWithImage = '<img src="' + chrome.extension.getURL(icon) + '" style="margin-right:5px"/>'
    var buttonTemplate = '<button type="button"  title="{0}"  style="display:none;float:right" class="{1} serviiotubebutton yt-uix-button yt-uix-button-default yt-uix-tooltip" role="button"><span class="yt-uix-button-content">{t}</span></button>'.replace("{t}", textWithImage);
    return buttonTemplate.replace("{0}", name).replace("{1}", className);
}

function getOnlineResource(url, func) {
    chrome.extension.sendMessage({ type: "getOnlineResource", url: url }, function (response) {
        console.log("response recieved");
        func(response);
    });
}

function addOnlineResource(name, url, func) {
    chrome.extension.sendMessage({ type: "addOnlineResource", name: name, url: url }, function (response) {
        console.log("response recieved");
        func(response);
    });
}

function removeOnlineResource(id, func) {
    chrome.extension.sendMessage({ type: "removeOnlineResource", id: id }, function (response) {
        console.log("response recieved");
        func(response);
    });
}

function refreshOnlineResource(id, func) {
    chrome.extension.sendMessage({ type: "refreshOnlineResource", id: id }, function (response) {
        console.log("response recieved");
        func(response);
    });
}

function extractPlaylistId(url) {
    var regEx = /list=PL([A-z0-9]+)/;
    var matches = regEx.exec(url);
    if (matches) {
        var playlistId = matches[1];
        return playlistId;
    }
    regEx = /list=([A-z0-9]+)/;
    matches = regEx.exec(url);
    playlistId = matches[1];
    return playlistId;
};

function getPlaylistUrl(playlistId) {
    return "http://gdata.youtube.com/feeds/api/playlists/"+playlistId;
};


