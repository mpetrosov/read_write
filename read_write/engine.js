//window.onload = function(){
var addressBookMessages = {};
var messagesContainer = null;
var addressBookForm = null;
// The URL of the WORKING API from which we fetch and store data.
var apiUrl = 'http://localhost/read_write/api.php';

// This is the function generates an API URL used to insert messages.
// We shall be calling it using async HTTP request (to avoid page reloads). 
function generateApiWriteUrl(fullname, comment) {
    return apiUrl + '?action=write&mykey=' + fullname + '&value=' + comment;
}

// Make an async request to the API. Returns a new record.
function apiWrite(fullname, comment) {
    var url = generateApiWriteUrl(fullname, comment);
    var request = new XMLHttpRequest();
    request.open('GET', url, false);  // `false` makes the request synchronous
    request.send(null);

    if (request.status === 200) {
        return request.responseText;
    }
}

//make the field accessable only for numbers
function isNumberKey(evt)
{
   var charCode = (evt.which) ? evt.which : event.keyCode
   if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

   return true;
}

// Start listening to DOM events when DOM content is laoded
document.addEventListener('DOMContentLoaded', function() {

    // On page load get all existing address book messages saved in the local storage.
    // If no messages or problem with loading the message, we return an empty object.
    try {
        addressBookMessages = JSON.parse(localStorage.getItem('address_book_messages'));
    } catch(exception) {
        addressBookMessages = {};
    }

    // Just checking. If object is null or empty list, make an empty object of it.
    if (addressBookMessages == null || addressBookMessages == []) {
        addressBookMessages = {};
    }
    
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

    // This is the container which holds all the HTML messages
    messagesContainer = document.getElementById('messages');
    // This is the form HTML element
    addressBookForm = document.getElementById('address-book-form');
    
    // Loop through all the address book messages and add corespondent HTML elements.
    for (var index in addressBookMessages) {
        // Create the HTML element from data given
        var child = createChildElement(index, addressBookMessages[index]);
        
        // Add the created HTML element to the list of HTML elements
        messagesContainer.appendChild(child);
    }


    // Save the address book record
    function saveAddressBookRecord(event) {
        // The {event} we have here is the form "submit" event and by default it does a POST request
        // to the same page, which results a page reload. I don't want that. What I want is on submit
        // add the address book record to the local storage and add it to the bottom of the page.
        event.preventDefault();

        var addressBookRecordId = document.getElementById('record').value;

        // Save into the database.
        addressBookRecordId = apiWrite(
            document.getElementById('fullname').value, 
            document.getElementById('comment').value
        );

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
        localStorage.setItem('address_book_messages', JSON.stringify(addressBookMessages));

        // Reset form data
        addressBookForm.reset();

        document.getElementById('record').value = "";

        // Scroll down
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }


    document.getElementById('address-book-form').addEventListener('submit', saveAddressBookRecord);
    var allRemoveLinkElements = document.querySelectorAll('a.remove');
    

}, false);
//}
