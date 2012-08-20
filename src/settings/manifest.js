// SAMPLE
this.manifest = {
    "name": "ServiioTube Extension",
    "icon": "icon.png",
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
            "text": i18n.get("Test")
        },
        {
            "tab": i18n.get("Serviio"),
            "group": i18n.get("API"),
            "name": "connectionStatus",
            "type": "description",
            "text": ""
        }
        
    ],
    "alignment": [
        [
            "host",
            "port",
        ]
        
    ]
};