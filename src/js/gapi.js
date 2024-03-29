// Client ID and API key from the Developer Console
var CLIENT_ID = '254806280783-kreur0o4gdptuprht0sg0pdep9o6uf6h.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDadv4Q0JV0tJcI2mZcRlCp3jMgIaj2sYs';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad()
{
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient()
{
    gapi.client.init(
    {
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function ()
    {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    },
    function(error)
    {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn)
{
    if (isSignedIn)
    {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listMajors();
    }
    else
    {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event)
{
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event)
{
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message)
{
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors()
{
    // gapi.client.sheets.spreadsheets.values.get(
    // {
    //     spreadsheetId: '1pRriIo_BLP3RWQ8Hjg9LfSg-ytl9CEn6ct9C4dYry8k',
    //     range: 'Sheet1!A2:F100',
    // }).then(function(response)
    // {
    //     var range = response.result;
    //     if (range.values.length > 0)
    //     {
    //         for (i = 0; i < range.values.length; i++)
    //         {
    //             var row = range.values[i];
    //             appendPre(row[0]+", ["+row[1]+"-"+row[2]+"-"+row[3]+"], "+row[4]+", "+row[5]);
    //         }
    //     }
    //     else
    //     {
    //         appendPre('No data found.');
    //     }
    // },
    // function(response)
    // {
    //     appendPre('Error: ' + response.result.error.message);
    // });
}