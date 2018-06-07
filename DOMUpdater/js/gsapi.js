
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}
function initClient() {
    gapi.client.init({
        clientId: "904413149069-hdr9cblbf6al8n7i6tch91scj3t14i6i.apps.googleusercontent.com",
        //apiKey: 'AIzaSyDw9OUdG0-viGv90RBBt8AF0-bAcUjHXYs',
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
        scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
        propt: 'none',

    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
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
        spreadsheetId: '1MLsluD-wfEruLrKL_LpfgcCvWKZG9liDXqPjcW5uCJQ',
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
