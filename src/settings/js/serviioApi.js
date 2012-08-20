/* usage
var serviioApi = new ServiioApi(new Store("settings"));
console.log(serviioApi.getSettings());
*/

//define
function ServiioApi(settings) {
    this.settings = settings;
}

//methods
ServiioApi.prototype.getSettings = function () {
    var settings = {
        'host': this.settings.get("host"),
        'port': this.settings.get("port")
    };
    settings.url = "http://" + settings.host + ":" + settings.port;
    settings.urlPing = settings.url + "/rest/ping";
    settings.IsValid = settings.host != null && settings.port != null;
    return settings;
};

ServiioApi.prototype.ping = function (result) {
    this.request("GET", "/rest/ping", null, result);
};

ServiioApi.prototype.getRepository = function (result) {
    this.request("GET", "/rest/repository", null, result);
};

ServiioApi.prototype.setRepository = function (repo, result) {
    this.request("PUT", "/rest/repository", JSON.stringify(repo), result);
};

ServiioApi.prototype.forceLibraryRefresh = function (id, result) {
    //<?xml version="1.0" encoding="UTF-8" ?>
    var action = '<?xml version="1.0" encoding="UTF-8" ?>' + "\n" + '<action><name>forceOnlineResourceRefresh</name><parameter>' + id + '</parameter></action>';
    this.request("POST", "/rest/action", action, result);
};

ServiioApi.prototype.isValidResponse = function(r) {
    return r == null || r.errorCode == null || r.errorCode == 0;
}

ServiioApi.prototype.getOnlineResource = function (uri, result) {
    var obj = this;
    this.getRepository(function (r) {
        if (!obj.isValidResponse(r)) {
            result(result);
            return;
        }
        var found = null;
        for (var i = 0; i < r.onlineRepositories.length; i++) {
            repo = r.onlineRepositories[i];
            if (repo.contentUrl == uri) {
                found = repo;
                break;
            }
        }
        console.log("getOnlineResource for [" + uri + "][" + (found != null) + "]");
        result(found);
    });
};

ServiioApi.prototype.addOnlineResource = function (name, uri, result) {

    var thisPointer = this;
    this.getRepository(function (r) {

        var found = false;
        // check if it is not already there
        for (var i = 0; i < r.onlineRepositories.length; i++) {
            repo = r.onlineRepositories[i];
            if (repo.contentUrl == uri) {
                found = true;
                break;
            }
        }
        if (found) {
            console.log("Skip add because it was found");
            result(found);
        }
        else {
            // add to existing format
            var newOnlineRepo = {
                accessGroupIds: [1],
                contentUrl: uri,
                enabled: true,
                fileType: "VIDEO",
                repositoryName: name,
                repositoryType: "FEED"
            }
            r.onlineRepositories[r.onlineRepositories.length] = newOnlineRepo;
            // push
            thisPointer.setRepository(r, function (resSet) {
                result(true);
            });

        }
    });
};

ServiioApi.prototype.removeOnlineResource = function (id, result) {

    var thisPointer = this;
    this.getRepository(function (r) {

        var found = false;
        var newonlineRepositories = [];

        // check if it is not already there
        for (var i = 0; i < r.onlineRepositories.length; i++) {
            repo = r.onlineRepositories[i];
            if (repo.id == id) {
                found = true;
            }
            else {
                newonlineRepositories[newonlineRepositories.length] = repo;
            }
        }
        if (found) {
            r.onlineRepositories = newonlineRepositories;
            thisPointer.setRepository(r, function (resSet) {
            });
        }
        result(found);

    });
};


ServiioApi.prototype.request = function (type, path, body, result) {
    var settings = this.getSettings();
    if (settings.isValid) {
        var fullUri = settings.url + path;
        console.log("Loading " + type + ": " + fullUri);

        $.ajax({
            type: type,
            url: fullUri,
            data: body,
            success: function (data) {
                result(data);
            },
            error: function (e) {
                console.log("Fatal call");
                result({ errorCode: 1, errorMessage: "Error while connecting to " + fullUri });
            },
            dataType: "json",
            headers: { Accept: "application/json", "Content-Type": "application/json; charset=UTF-8" },
            scriptCharset: "utf-8"
            //contentType: "application/xml, text/xml"
        });
    }
    else {
        result({ errorCode: 1, errorMessage: "Invalid settings" });
    }

};