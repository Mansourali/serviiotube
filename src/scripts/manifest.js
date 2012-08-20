// ServiioTube fancy settings manifest
this.manifest = {
    "name": "ServiioTube Extension",
    "icon": "images/icon-large.png",
    "settings": [
        {
            "tab": i18n.get("Serviio"),
            "group": i18n.get("API"),
            "name": "host",
            "type": "text",
            "label": i18n.get("host"),
            "text": "10.0.0.4"
        },
        {
            "tab": i18n.get("Serviio"),
            "group": i18n.get("API"),
            "name": "port",
            "type": "text",
            "label": i18n.get("port"),
            "text": 23423
        },

        {
            "tab": i18n.get("Serviio"),
            "group": i18n.get("API"),
            "name": "testconnection",
            "type": "button",
            "label": i18n.get("Connection"),
            "text": i18n.get("Test connection")
        },
        {
            "tab": i18n.get("Serviio"),
            "group": i18n.get("API"),
            "name": "connectionStatus",
            "type": "description",
            "text": ""
        },
        {
            "tab": i18n.get("youtube"),
            "group": i18n.get("Examples"),
            "name": "playlist",
            "type": "description",
            "text": 'Manage from your <a href="http://www.youtube.com/view_all_playlists" >playlist</href><p class="img"><img src="' + chrome.extension.getURL('images/examples.playlist.jpg') + '" /></p>'
        },
        {
            "tab": i18n.get("youtube"),
            "group": i18n.get("Examples"),
            "name": "playlist",
            "type": "description",
            "text": 'Add directly from your <a href="http://www.youtube.com/results?search_query=serviio" >search query</href>'
        },
        {
            "tab": i18n.get("youtube"),
            "group": i18n.get("Examples"),
            "name": "playlist",
            "type": "description",
            "text": 'Add user <a href="http://www.youtube.com/user/GoogleDevelopers/feed" >feeds</href>'
        },
        {
            "tab": i18n.get("youtube"),
            "group": i18n.get("Examples"),
            "name": "playlist",
            "type": "description",
            "text": 'Add other <a href="http://www.youtube.com/playlist?list=PLF21DC10DF6728F87" >playlists</href><p class="img"><img src="' + chrome.extension.getURL('images/examples.pageaction.jpg') + '" /></p>'
        },
    ],
    "alignment": [
        [
            "host",
            "port",
        ]
        
    ]
};

