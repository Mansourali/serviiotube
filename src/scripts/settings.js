var options = {};

var errorColor = "#f37979";
var successColor = "#79f37f";
window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {
        options = settings;
        console.log(settings);
        settings.manifest.testconnection.addEvent("action", function () {
            var connection = getConnectionValues();
            var myRequest = new Request.JSON({
                url: connection.urlPing,
                method: 'get',
                timeout : 10000,
                onRequest: function () {
                    showStatus(i18n.get("Connecting to " + connection.urlPing + " ..."))
                },
                onSuccess: function (response) {
                    if (response == null) {
                        showStatus(i18n.get("Page does not contain json" + errorcode + " ..."), errorColor);
                    }
                    else if (response.errorCode == 0) {
                        showStatus(i18n.get("Successfully connected to  " + connection.url + " "), successColor);
                    }
                    else {
                        showStatus(i18n.get("Connected but recieved error code [" + response.errorCode + "]"), errorColor);
                    }
                },
                onFailure: function (e) {
                    showStatus(i18n.get("Failed to connect to " + connection.urlPing + " ..."), errorColor);
                },
                onTimeout: function (e) {
                    showStatus(i18n.get("Timeout to connect to " + connection.urlPing + " ..."), errorColor);
                }
            }).get();

        });
    });

});

function showStatus(message,color) {
    var elementToUpdate = $$(options.manifest.connectionStatus.container);
    if (elementToUpdate) {
        console.log(message);
        console.log(elementToUpdate);
        elementToUpdate.set('html', message);
        elementToUpdate.set('style', "margin:10px 10px 10px 0px; width:320px; padding:10px;border:1px solid #cccccc; display:block; background-color:" + color);
    }
}

function getConnectionValues() {
    var settings = {
        'host': options.manifest.host.get(),
        'port': options.manifest.port.get(),
        

    };
    //add some defaults 
    if (!settings.host) {
        settings.host = "localhost";
    }
    if (!settings.port) {
        settings.port = "23423";
    }
    settings.url = "http://" + settings.host + ":" + settings.port;
    settings.urlPing = settings.url + "/rest/ping";
    return settings;
}