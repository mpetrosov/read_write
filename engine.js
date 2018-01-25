//window.onload = function(){
var addressBookMessages = {};
var messagesContainer = null;
var addressBookForm = null;
var limit = 1000;
var lastId = 0;

// The URL of the WORKING API from which we fetch and store data.
var apiUrl = 'http://localhost/read_write/';

// This is the function generates an API URL used to create messages.
// We shall be calling it using async HTTP request (to avoid page reloads). 
function generateApiCreateUrl() {
    return apiUrl + 'api/create.php';
}

// This is the function generates an API URL used to list all messages.
// We shall be calling it using async HTTP request (to avoid page reloads).
function generateApiListUrl(limit=1000, lastId=0) {
    var url = apiUrl + 'api/list.php?limit=' + limit;
    if (lastId) {
        url += '&lastId=' + lastId;
    }
    return url;
}

// Make an async request to the API. Returns a new record.
function apiCreate(fullname, comment) {
    
    var url = generateApiCreateUrl();
    var request = new XMLHttpRequest();
    request.open('POST', url, false);  // `false` makes the request synchronous
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send('mykey=' + fullname + '&value=' + comment);
    if (request.status === 201) {
        return parseInt(request.responseText);
    }
}

// Make an async request to the API. Returns list of all record.
function apiList(limit=1000, lastId=0) {
    var url = generateApiListUrl(limit, lastId);
    var request = new XMLHttpRequest();
    request.open('GET', url, false);  // `false` makes the request synchronous
    request.send(null);
    if (request.status === 200) {
        return request.responseText;
    }
}


// function getLastMessages(limit=1000){
//     try {
//         addressBookMessages = JSON.parse(apiList(limit, lastId));
//     } catch(exception) {
//         addressBookMessages = {};
//     }
//     // console.log(addressBookMessages);

//     // Just checking. If object is null or empty list, make an empty object of it.
//     if (addressBookMessages == null || addressBookMessages == []) {
//         addressBookMessages = {};
//     }
// }


// Create a new HTML child element - a single HTML representation of a single message
function createChildElement(id, record) {
    var elem = document.createElement('div');
    elem.className = "message entry";
    elem.id = "m" + id;
    elem.innerHTML = "" + 
    "<span class='name'> " + record.fullname + "</span>" +
    "<p class='message'> " + record.comment + "</p>";
    return elem;
}


// Save the address book record
function saveAddressBookRecord(event) {
    // The {event} we have here is the form "submit" event and by default it does a POST request
    // to the same page, which results a page reload. I don't want that. What I want is on submit
    // add the address book record to the local storage and add it to the bottom of the page.
    event.preventDefault();

    var addressBookRecordId = document.getElementById('record').value;

    // Save into the database.
    addressBookRecordId = apiCreate(
        document.getElementById('fullname').value, 
        document.getElementById('comment').value
    );
    // console.log(addressBookRecordId);
    if (addressBookRecordId > lastId) {
        lastId = addressBookRecordId;
    }

    var addressBookRecordData = {
        fullname: document.getElementById('fullname').value,
        comment: document.getElementById('comment').value
    };

    addressBookMessages[addressBookRecordId] = addressBookRecordData;

    // Create new HTML element from data given
    var child = createChildElement(addressBookRecordId, addressBookRecordData);

    // Append the new element to the HTML DOM
    messagesContainer.appendChild(child);

    // Update the local storage
    // apiCreate(
    //     document.getElementById('fullname').value,
    //     document.getElementById('comment').value
    // )
    // localStorage.setItem('address_book_messages', JSON.stringify(addressBookMessages));

    // Reset form data
    addressBookForm.reset();

    document.getElementById('record').value = "";

    // Scroll down to the last message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}



//make the field accessable only for numbers
function isNumberKey(evt) {
   var charCode = (evt.which) ? evt.which : event.keyCode
   if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

   return true;
}

// Main function to load the content
function loadContent() {

    // On page load get all existing address book messages saved in the database.
    // If no messages or problem with loading the message, we return an empty object.
    try {
        addressBookMessages = JSON.parse(apiList(limit, lastId));
    } catch(exception) {
        addressBookMessages = {};
    }
    // console.log(addressBookMessages);

    // Just checking. If object is null or empty list, make an empty object of it.
    if (addressBookMessages == null || addressBookMessages == []) {
        addressBookMessages = {};
    }

    // This is the container which holds all the HTML messages
    messagesContainer = document.getElementById('messages');
    // This is the form HTML element
    addressBookForm = document.getElementById('address-book-form');
    
    // Loop through all the address book messages and add corespondent HTML elements.
    for (var index in addressBookMessages) {
        // Create the HTML element from data given
        var addressBookMessage = {
            fullname: addressBookMessages[index]['mykey'],
            comment: addressBookMessages[index]['value']
        }
        var child = createChildElement(index, addressBookMessage);

        if (addressBookMessages[index]['id'] > lastId) {
            lastId = addressBookMessages[index]['id'];
        }
        // console.log(lastId);
        // Add the created HTML element to the list of HTML elements
        messagesContainer.appendChild(child);
    }

    // Scroll to the last message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Start listening to DOM events when DOM content is laoded
document.addEventListener('DOMContentLoaded', function() {
    loadContent();

    document.getElementById('address-book-form').addEventListener('submit', saveAddressBookRecord);
    var allRemoveLinkElements = document.querySelectorAll('a.remove');
    
    setInterval(loadContent, 2000);

}, false);
//}
