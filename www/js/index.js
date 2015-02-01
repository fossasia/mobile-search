/*
 The MIT License (MIT)

 Copyright (c) 2015 FOSSASIA
 Copyright (c) 2015 Tymon Radzik

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

var storage = window.localStorage;

function keyExists(key) {
    return (storage.getItem(key) !== null);
}

function getCallerId() { //returns e.g. "index.html" or "dir.html"
    return document.location.href.split('/')[5];
}

function openUrl(url) {
    window.open(url, "_system");
}

var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('backbutton', this.exitApp, false);
    },

    onDeviceReady: function() {
        if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,
                    null,
                    "Message",
                    'OK'
                );
            };
        }
        app.receivedEvent('deviceready');
    },

    exitApp: function() {
      navigator.app.exitApp();
    },

    receivedEvent: function(id) {
        console.log('Received Event: ' + id + ' from ' + getCallerId());
    }
};

app.initialize();

switch (getCallerId()) {
    default:

        if(!keyExists("searchPath")) {
            document.getElementById("searchBtn").disabled = true;
            document.getElementById("errorMsg").innerHTML = "Path isn't specified";
            break;
        }
        break;
}
