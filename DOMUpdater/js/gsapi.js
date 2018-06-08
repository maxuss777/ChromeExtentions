var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

function handleClientLoad() {
    gapi.load('client:auth2',
        {
            callback: function () { 
                initClient(); 
            },
            onerror: function () {
                alert('failed');
            }
        });
}
function initClient() {
    console.log('initClient');
    gapi.client.init({
        clientId: "414980204301-b2fa07vhlngpa77l6tkteet9cnk3hpel.apps.googleusercontent.com",
        apiKey: 'AIzaSyA82IkzNT71-23h2cf97gZGRz5COcd5VZw',
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
        scope: "https://www.googleapis.com/auth/spreadsheets.readonly"       
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    },
    function(error) {
        console.log(error);
      });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listMajors();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

function listMajors() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '17Z-7_MooBGokx_2e9p39wgQugOJbFmGFDoprEIO7W3o',
        range: 'A2:C',
    }).then(function (response) {
        var range = response.result;
        if (range.values.length > 0) {
            appendPre('SiteId, SiteItem, Attributes:');
            for (i = 0; i < range.values.length; i++) {
                var row = range.values[i];
                appendPre(row[0] + ', ' + row[1] + ', ' + row[2]);
            }
        } else {
            appendPre('No data found.');
        }
    }, function (response) {
        appendPre('Error: ' + response.result.error.message);
    });
}
