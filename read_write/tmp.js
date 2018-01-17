
    //Get from values
    var siteName = document.getElementById('sitename').value;
    var siteUrl = document.getElementById('siteUrl').value;

    var record = {
        name: siteName,
        url: siteUrl
    }

    /*
    // LocalStorage test - key, Hello World - value
    localStorage.setItem('test', 'Hallo world');
    console.log(localStorage.getItem('test', 'Hello World'));
    localStorage.removeItem('test');
    console.log(localStorage.getItem('test'));
    */

    //Test if bookmarks is null
    if (localStorage.getItem('bookmarks') === null){

        //init array
        var bookmarks = [];

        //Add to array
        bookmarks.push(bookmark);

        // Set to localStorage
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }else{
        
        //Get bookmarks from localStorage
        var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        
        //Add bookmarks to array
        bookmarks.push(bookmark);

        //re-set back to localstorage
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    }


    //fetch bookmarks

    function fetchBookmarks() {
        // Get boookmarks from localStoraga
        var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

        // Get output id
        var bookmarksResults = document.getElementById('bookmarksResults');

        // Build output
        bookmarksResults.innerHTML = '';
        for (var i = 0; i < bookmarks.length; i++){
            var name = bookmarks[i].name;
            var url = bookmarks[i].url;

            bookmarksResults.innerHTML += '<div class="well"' + '<h3>' +name+ '</h3>' + '</div>';
        }
    }
    
    //prevent from form sabmitting
    e.preventDefault();