// this script will generate an author's specific page.

//Get the author name from the URL if any
if (window.location.search.substring(1).split('=')[0] === 'author') {
    var author = window.location.search.substring(1).split('=')[1];
}

// Get the div of id authorPageMain
var authorPageMain = document.getElementById('authorPageMain');

// From local storage, get the structure data
const structureData = JSON.parse(localStorage.getItem("structure_list"));

var PackAuthors;

// Function to get a list of all existing authors and their structure count
function getAuthors() {
    //initialize an empty dictionary
    var authors = {};
    //loop through the object (dictionary) structureData
    for (var key in structureData) {
        // If author name is "" or undefined, set it to "Unknown"
        if (structureData[key].validation.structureAuthor === '' || structureData[key].validation.structureAuthor === undefined) {
            structureData[key].validation.structureAuthor = "Unknown";
        }
        // if the author is not in the dictionary authors
        if (!(structureData[key].validation.structureAuthor in authors)) {
            // add the author to the dictionary authors
            authors[structureData[key].validation.structureAuthor] = 1;
        } else {
            // increment the count of the author in the dictionary authors
            authors[structureData[key].validation.structureAuthor]++;
        }
    }
    // return the dictionary authors
    return authors;
}




var authors = getAuthors();

// if author is empty
if (author === '' || author === undefined) {
    //in authorPageMain, as H2 element, add the text "No author specified"
    authorPageMain.innerHTML = '<h2>No author specified</h2>';

    // Count how many structures in the structure list have no author
    var noAuthorCount = authors["Unknown"];
    

    let totalStructures = 0;
    for (var key in authors) {
        totalStructures += authors[key];
    }
    

    // Add the noAuthorCount to the authorPageMain
    authorPageMain.innerHTML += '<p>There are ' + noAuthorCount + ' structures with unknown author out of ' + totalStructures + ' structures</p>';

    // Add a list of all authors to the authorPageMain, with buttons to view their pages
    authorPageMain.innerHTML += '<h3>Authors</h3>';
    // Create the button panel:
    const buttonPanel = document.createElement('div');
    buttonPanel.className = 'author-button-panel';

    //sort the authors by number of structures
    authors = Object.fromEntries(Object.entries(authors).sort(([,a],[,b]) => b-a));


    for (var key in authors) {

        let buttonName = key;
        let authorName = key;

        // Create the button's text:
        if (key === "Unknown") {
            buttonName = "Unknown author for " + authors[key] + " structures";
        } else {
            if (authors[key] > 1)
            {
                buttonName = key + ' with ' + authors[key] + ' structures';
            } else {
                buttonName = key + ' with ' + authors[key] + ' structure';
            }
        }

        console.log(key);

        // Create the button:
        const button = document.createElement('button');
        button.innerHTML = buttonName;
        button.onclick = function() {
            window.location.href = 'author.html?author=' + authorName;
        };

        // Add the button to the authorPageMain:
        buttonPanel.appendChild(button);

    }

    authorPageMain.appendChild(buttonPanel);

} else {
    // Add the author to the authorPageMain
    authorPageMain.innerHTML = '<h2>Author: ' + author + '</h2>';

    // Count how many structures in the structure list have the author
    var authorCount = authors[author];

    // Add the authorCount to the authorPageMain
    if (authorCount > 1) {
        authorPageMain.innerHTML += '<p>There are ' + authorCount + ' structures by this author</p>';
    } else {
        authorPageMain.innerHTML += '<p>There is ' + authorCount + ' structure by this author</p>';
    }

    // tell in what packages the author has structures
    var authorPackages = {};
    for (var key in structureData) {
        if (structureData[key].validation.structureAuthor === author) {
            if (!(structureData[key].pack in authorPackages)) {
                authorPackages[structureData[key].pack] = 1;
            } else {
                authorPackages[structureData[key].pack]++;
            }
        }
    }

    // Add the authorPackages to the authorPageMain
    authorPageMain.innerHTML += '<h3>Packages</h3>';
    for (var key in authorPackages) {
        if (authorPackages[key] > 1) {
            authorPageMain.innerHTML += '<p>' + key + ' (' + authorPackages[key] + ' structures)</p>';
        } else {
            authorPageMain.innerHTML += '<p>' + key + ' (' + authorPackages[key] + ' structure)</p>';
        }
    }

    // Add a button to the authorPageMain
    authorPageMain.innerHTML += '<button onclick="window.location.href=\'author.html\'">Return to author page</button>';

    // Add a list of all structures by the author to the authorPageMain
    authorPageMain.innerHTML += '<h3>Structures</h3>';
    // Create the structure list:
    const structureList = document.createElement('ul');
    authorPageMain.appendChild(structureList);

    // Create the structure list items:
    for (var key in structureData) {
        if (structureData[key].validation.structureAuthor === author) {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = 'structure.html?structureName=' + key;
            link.innerHTML = key;
            listItem.appendChild(link);
            structureList.appendChild(listItem);
        }
    }

}