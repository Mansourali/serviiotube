var options = {};
window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {
        options = settings;
        console.log(settings);
        settings.manifest.testconnection.addEvent("action", function () {
            var connection = getConnectionValues();
            var myRequest = new Request.JSON({
                url: connection.urlPing,
                method: 'get',
                onRequest: function () {
                    showStatus(i18n.get("Connecting to " + connection.urlPing + " ..."))
                },
                onSuccess: function (response) {
                    if (response == null) {
                        showStatus(i18n.get("Page does not contain json" + errorcode + " ..."))
                    }
                    else if (response.errorCode == 0) {
                        showStatus(i18n.get("Successfully connected to  " + connection.url + " "))
                    }
                    else {
                        showStatus(i18n.get("Connected but recieved error code [" + response.errorCode + "]"))
                    }
                },
                onFailure: function (e) {
                    showStatus(i18n.get("Failed to connect to " + connection.urlPing + " ..."))
                }
            }).get();

        });
    });

});

function showStatus(message) {
    var elementToUpdate = $$(options.manifest.connectionStatus.container);
    if (elementToUpdate) {
        console.log(message);
        elementToUpdate.set('html', message)
    }
}

function getConnectionValues() {
    
	return {
		'host': options.manifest.host.get(),
		'port': options.manifest.port.get(),
		'url': "http://"+options.manifest.host.get()+":"+options.manifest.port.get()+"/rest/",
        'urlPing': "http://"+options.manifest.host.get()+":"+options.manifest.port.get()+"/rest/ping"
		
	};
}