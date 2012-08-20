console.log("[TS] " + "Start loading");

// look through all edit buttons
$('.vm-video-item-content').each(function (index) {
    console.log(index + " play list ");

    var name = $(this).find('.vm-video-title-text').text();
    var playListUri = $(this).find('button').attr("href");
    var regEx = /list=PL([A-Z0-9]+)/;
    var matches = regEx.exec(playListUri);
    var playlistId = matches[1];

    console.log(playlistId);
    var currentButtonCollection = $(this).find('.vm-pl-edit');
    getOnlineResource(getPlaylistUrl(playlistId), function (response) {
        var text = "Add";
        var id = ""
        if (response.found) {
            text = "Remove";

        }

        var button = '<button type="button" class="addRemove yt-uix-button yt-uix-button-default" role="button"><span class="yt-uix-button-content">' + text + '</span></button>';
        var nbutton = currentButtonCollection.append(button);

        nbutton.click(function () {
            var currentButton = nbutton.find(".addRemove");
            currentButton.hide();
            if (response.found) {
                console.log(response);
                removeOnlineResource(response.onlineRep.id, function (r) {
                    response.found = false;
                    currentButton.find("span").text("Add");
                    currentButton.show();
                });


            }
            else {

                addOnlineResource(name, getPlaylistUrl(playlistId), function (r) {
                    getOnlineResource(getPlaylistUrl(playlistId), function (getNv) {
                        response = getNv;
                        currentButton.find("span").text("Remove");
                        currentButton.show();
                    });

                });
            }
        });

    });


});

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

function getPlaylistUrl(playlistId) {
    return "http://gdata.youtube.com/feeds/api/playlists/"+playlistId;
};


