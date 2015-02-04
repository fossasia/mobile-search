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

//
// FUNCTIONS DECLARATIONS
//

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

function fail(e) {
    window.alert(e.target.error.code);
}

// Directory picker specific functions

var picker_currDir = null;
var picker_parrentDir = null;

function picker_fromPath(name) {
    picker_currDir.getDirectory(name, {create: false}, function(dir){picker_listDir(dir);}, fail);
}

function picker_fromAbsolute(path) {
    window.resolveLocalFileSystemURL(path, function(dir){picker_listDir(dir);}, fail);
}

function picker_listParent() {
    picker_listDir(picker_parrentDir);
}

function picker_selectDir() {
    storage.setItem("searchPath", picker_currDir.toURL());
    window.location.href = "index.html";
}

function picker_listDir(dirEntry) {
    if(!dirEntry.isDirectory) return;
    document.getElementById("currDir").innerHTML = dirEntry.toURL();

    picker_currDir = dirEntry;

    var dirReader = dirEntry.createReader();
    dirReader.readEntries(function(rows) {
        document.getElementById("listDiv").innerHTML  = "<ul class=\"list-group\">";
        dirEntry.getParent(function(dirName){
            document.getElementById("listDiv").innerHTML += "<li class=\"list-group-item\"><a onclick='picker_listParent()'>[GO UP]</a></li>";
            picker_parrentDir = dirName;
        });
       for(var i = 0; i < rows.length; i++) {
           var row = rows[i];
            if(row.isDirectory) {
                document.getElementById("listDiv").innerHTML += "<li class=\"list-group-item\"><a onclick=\"picker_fromPath('" + row.name + "')\">" + row.name + "</a></li>";
            }
           else if(row.isFile) {
                document.getElementById("listDiv").innerHTML += "<li class=\"list-group-item\">" + row.name + "</li>";
            }
       }
        document.getElementById('listDiv').innerHTML += "</ul>";
    });

}

//

//---
//---
//---

function getCategories() {
    if(!keyExists("searchPath") || getCallerId() != "index.html")return;
    window.resolveLocalFileSystemURL(storage.getItem("searchPath"), function(dirLoc){
        if(!dirLoc.isDirectory)return;
        window.alert("Szajs");
       var catReader = dirLoc.createReader();
        catReader.readEntries(function(categories){
            document.getElementById("categoriesUl").innerHTML += "<li class=\"list-group-item\"><input type=\"checkbox\" checked=\"checked\" id='[top]' value='[top]' name='[top]'>[top]</input></li>";
           for(var i = 0; i < categories.length; i++) {
               var category = categories[i];
               if(category.isDirectory) {
                   document.getElementById("categoriesUl").innerHTML += "<li class=\"list-group-item\"><input type=\"checkbox\" checked=\"checked\" id='" + category.name + "' value='" + category.name + "' name='" + category.name + "'>" + category.name + "</input></li>";
               }
           }
        });
    }, fail);
}


//
// END OF FUNCTIONS DECLARATIONS
//

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

        //Code for directory picker - need to be put there (instead of main switch), because of Cordova application architecture
        if(getCallerId() == "directory_picker.html") {
            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                picker_fromAbsolute("file:///"); // Load root of phone's filesystem
            }, fail);
        }

        if(getCallerId() == "index.html" && keyExists("searchPath")) {
            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {getCategories();}, fail);
        }

        //

        app.receivedEvent('deviceready');
    },

    exitApp: function() {
      navigator.vibrate(500);
      navigator.app.exitApp();
    },

    receivedEvent: function(id) {
        console.log('Received Event: ' + id + ' from ' + getCallerId());
    }
};

app.initialize();

switch (getCallerId()) {
    case "index.html":
        if(!keyExists("searchPath")) {
            document.getElementById("searchBtn").disabled = true;
            document.getElementById("errorMsg").innerHTML = "Path isn't specified";
            break;
        }
        else {
            document.getElementById("dirPath").innerHTML = storage.getItem("searchPath");
        }
        break;
}




