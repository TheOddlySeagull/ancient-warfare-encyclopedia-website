// this script will generate an author's specific page.

//Get the author name from the URL if any
if (window.location.search.substring(1).split('=')[0] === 'author') {
    var author = window.location.search.substring(1).split('=')[1];
}

// Get the div of id authorHeader
var authorPageMain = document.getElementById('authorHeader');

// From local storage, get the structure data
const structureData = JSON.parse(localStorage.getItem("structure_list"));

var PackAuthors;

var AuthorData = {};
var AuthorProfileImage = new Image();
var AuthorGallery = [];

// Function to load the data from the author JSON, and the author folders
function loadAuthorData() {
    // Load the author JSON file
    console.log(author + ' json path: ' + '../json/authors/' + author + '.json');
    fetch('../json/authors/' + author + '.json')
        .then(response => response.json())
        .then(data => {
            AuthorData = data;
        });
    // check if data is loaded
    console.log(AuthorData);


    // Load the author profile image
    AuthorProfileImage.src = '../img/authors/profiles/' + author + '.png';
    AuthorProfileImage.onerror = function() {
        console.log('Author image not found');
        AuthorProfileImage.src = '../img/AW2.png';
    }

    // Load the author gallery as an array of images.
    // The authhor gallery images are found in the folder ../img/authors/gallery/authorName/
    // Load and store all the images from the author gallery folder
    fetch('../img/authors/gallery/' + author + '/')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            AuthorGallery = data;
        });

    console.log(AuthorData);
    console.log(AuthorProfileImage);

}

// Function to create a small structure card
function createStructureCard(structure)
{
    // The card is simply the structure name, and the icon. Clicking on the card will take you to the structure page.
    const card = document.createElement('div');
    card.className = 'structure-card';
    card.onclick = function() {
        window.location.href = 'structure.html?structureName=' + structure.pack + '/' + structure.name;
    }

    // Create the structure icon:
    const icon = document.createElement('img');
    icon.src = structure.icon;
    icon.alt = structure.name;
    card.appendChild(icon);

    // Create the structure name:
    const name = document.createElement('p');
    name.innerHTML = structure.name;
    card.appendChild(name);

    return card;
}

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

// Function to create teh "asideGeneralMenu" div
function createAsideGeneralMenu() {
    // get the asideGeneralMenu div
    var asideGeneralMenu = document.getElementById('asideGeneralMenu');
    //clean the asideGeneralMenu div
    asideGeneralMenu.innerHTML = '';

    // Count how many structures in the structure list have the author
    var authorCount = authors[author];

    // Create a div for the author count
    const authorCountDiv = document.createElement('div');

    // Add the "structures" h3 to the authorCountDiv
    authorCountDiv.innerHTML += '<h3>Structures</h3>';

    // Add the authorCount to the authorCountDiv
    if (authorCount > 1) {
        authorCountDiv.innerHTML += '<p>There are ' + authorCount + ' structures by this author</p>';
    } else {
        authorCountDiv.innerHTML += '<p>There is ' + authorCount + ' structure by this author</p>';
    }

    // Add a "see structures" button that moves to the authorStructures div
    authorCountDiv.innerHTML += '<button onclick="window.location.href=\'#authorStructures\'">See structures</button>';


    // Add the authorCountDiv to the asideGeneralMenu
    asideGeneralMenu.appendChild(authorCountDiv);

    // Create a div for the packages
    const packagesDiv = document.createElement('div');

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

    // Add the authorPackages to the packagesDiv
    packagesDiv.innerHTML += '<h3>Packages</h3>';
    for (var key in authorPackages) {
        if (authorPackages[key] > 1) {
            packagesDiv.innerHTML += '<p>' + key + ' (' + authorPackages[key] + ' structures)</p>';
        } else {
            packagesDiv.innerHTML += '<p>' + key + ' (' + authorPackages[key] + ' structure)</p>';
        }
    }

    // Add the packagesDiv to the asideGeneralMenu
    asideGeneralMenu.appendChild(packagesDiv);
}


// Funbction to create the "authorHeader" div
function createAuthorHeader() {
    // get the authorHeader div
    let AuthorHeader = document.getElementById('authorHeader');
    //clean the authorHeader div
    AuthorHeader.innerHTML = '';

    // add the image of the author to the authorHeader div
    AuthorHeader.appendChild(AuthorProfileImage);

    // create the H2 element with the author name
    let authorName = document.createElement('h1');
    authorName.innerHTML = author;
    AuthorHeader.appendChild(authorName);
}

//Function to create the "authorInfo" div
function createAuthorInfo() {
    // Here we make an h2 title "About", add the description of the author
    
    // get the authorInfo div
    let authorInfo = document.getElementById('authorInfo');
    authorInfo.innerHTML = '';

    // Add the h2 title "About" to the authorInfo div
    let aboutTitle = document.createElement('h2');
    aboutTitle.innerHTML = 'About';
    authorInfo.appendChild(aboutTitle);

    // Add the description of the author to the authorInfo div
    let aboutText = document.createElement('p');
    aboutText.innerHTML = AuthorData.description;
    authorInfo.appendChild(aboutText);
}

// Function to create the "authorContact" div
function createAuthorContact() {
    // get the authorContact div
    var authorContact = document.getElementById('authorContact');
    //clean the authorContact div
    authorContact.innerHTML = '';
    authorContact.className = 'author-contact';

    // Add the contact information to the authorContact
    authorContact.innerHTML += '<h2>Contact</h2>';
    authorContact.innerHTML += '<p>For any inquiries, please contact the author at <a href="mailto:' + author + '@ancient-warfare.com">' + author + '@ancient-warfare.com</a></p>';

}

// Function to create the "authorStructures" div
function createAuthorStructures() {
    // get the authorStructures div
    var authorStructures = document.getElementById('authorStructures');
    //clean the authorStructures div
    authorStructures.innerHTML = '';
    authorStructures.className = 'author-structures';

    // Add a list of all structures by the author to the authorStructures
    authorStructures.innerHTML += '<h2>Structures</h2>';

    // Create the page buttons:
    const pageButtons = document.createElement('div');
    authorStructures.appendChild(pageButtons);
    pageButtons.className = 'page-buttons';

    // Create the structure list:
    const structureList = document.createElement('div');
    authorStructures.appendChild(structureList);

    //cards per page
    var cardsPerPage = 10;
    //current page
    var currentPage = 1;
    //total pages
    var totalPages = Math.ceil(authors[author] / cardsPerPage);
    //current index
    var currentIndex = 0;
    //max index
    var maxIndex = cardsPerPage;
    //list of all structures by the author
    var structureListArray = [];
    //loop through the object (dictionary) structureData
    for (var key in structureData) {
        // if the author is the author
        if (structureData[key].validation.structureAuthor === author) {
            // add the structure to the list of all structures by the author
            structureListArray.push(structureData[key]);
        }
    }
    //sort the list of all structures by the author by name
    structureListArray.sort((a, b) => (a.name > b.name) ? 1 : -1);

    // Create the previous button:
    const previousButton = document.createElement('button');
    previousButton.innerHTML = 'Previous';
    previousButton.onclick = function() {
        if (currentPage > 1) {
            currentPage--;
            currentIndex -= cardsPerPage;
            maxIndex -= cardsPerPage;
            structureList.innerHTML = '';
            for (var key in structureListArray) {
                if (currentIndex < key && key < maxIndex) {
                    const card = createStructureCard(structureListArray[key]);
                    structureList.appendChild(card);
                }
            }
            // Update the page number:
            pageNumber.innerHTML = 'Page ' + currentPage + ' of ' + totalPages;
        }
    }
    pageButtons.appendChild(previousButton);

    // Create the page number:
    const pageNumber = document.createElement('p');
    pageButtons.appendChild(pageNumber);

    // Set the initial page number:
    pageNumber.innerHTML = 'Page ' + currentPage + ' of ' + totalPages;

    // Create the next button:
    const nextButton = document.createElement('button');
    nextButton.innerHTML = 'Next';
    nextButton.onclick = function() {
        if (currentPage < totalPages) {
            currentPage++;
            currentIndex += cardsPerPage;
            maxIndex += cardsPerPage;
            structureList.innerHTML = '';
            for (var key in structureListArray) {
                if (currentIndex < key && key < maxIndex) {
                    const card = createStructureCard(structureListArray[key]);
                    structureList.appendChild(card);
                }
            }
            // Update the page number:
            pageNumber.innerHTML = 'Page ' + currentPage + ' of ' + totalPages;
        }
    }
    pageButtons.appendChild(nextButton);

    //loop through the list of all structures by the author
    for (var key in structureListArray) {
        // if the index is between the current index and the max index
        if (currentIndex < key && key < maxIndex) {
            // Create the structure card:
            const card = createStructureCard(structureListArray[key]);
            // Add the card to the structure list:
            structureList.appendChild(card);
        }
    }
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

    // Load the author data
    loadAuthorData();

    // Create the asideGeneralMenu
    createAsideGeneralMenu();

    // Create the authorHeader
    createAuthorHeader();

    // Create the authorInfo
    createAuthorInfo();

    // Create the authorStructures
    createAuthorStructures();

}