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
async function loadAuthorData() {
    // Load the author JSON file
    console.log(author + ' json path: ' + '../json/authors/' + author + '.json');
    
    try {
        const response = await fetch('../json/authors/' + author + '.json');
        const data = await response.json();
        AuthorData = data;
    } catch (error) {
        console.log('Author JSON not found');
        AuthorData = {
            "description": "No description available"
        };
    }
    

    // Load the author profile image
    AuthorProfileImage.src = '../img/authors/profiles/' + author + '.png';
    AuthorProfileImage.onerror = function() {
        console.log('Author image not found');
        AuthorProfileImage.src = '../img/AW2.png';
    }

    // Load the author gallery as an array of images.
    // The authhor gallery images are found in the folder ../img/authors/gallery/authorName/
    // Load and store all the images from the author gallery folder
    console.log(author + ' gallery path: ' + '../img/authors/gallery/' + author + '/');
    try {
        const response = await fetch('../img/authors/gallery/' + author + '/');
        const data = await response.text();
        var parser = new DOMParser();
        var htmlDoc = parser.parseFromString(data, 'text/html');
        var images = htmlDoc.getElementsByTagName('a');
        for (var i = 0; i < images.length; i++) {
            AuthorGallery.push(images[i].href.split('/').pop());
        }
    }
    catch (error) {
        console.log('Author gallery not found');
    }

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

    // Add a "see structures" button that moves to the authorStructures div (smooth scroll)
    const seeStructuresButton = document.createElement('button');
    seeStructuresButton.innerHTML = 'See structures';
    seeStructuresButton.onclick = function() {
        document.getElementById('authorStructures').scrollIntoView({behavior: "smooth"});
    }
    authorCountDiv.appendChild(seeStructuresButton);

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
    AuthorHeader.innerHTML = '';

    //inside this div, we have a div and a nav bar
    // create the div for the author profile image
    let AuthorProfile = document.createElement('div');
    AuthorProfile.className = 'author-banner';

    //Inside "AuthorProfile", we have the image of the author, and a h1 element with the author name
    AuthorProfile.appendChild(AuthorProfileImage);
    let authorName = document.createElement('h1');
    authorName.innerHTML = author;
    AuthorProfile.appendChild(authorName);

    // Add the authorProfile to the authorHeader
    AuthorHeader.appendChild(AuthorProfile);


    // Create the nav bar
    const navBar = document.createElement('nav');

    // Create the "About" button
    const aboutButton = document.createElement('button');
    aboutButton.innerHTML = 'About';
    aboutButton.onclick = function() {
        document.getElementById('authorInfo').scrollIntoView({behavior: "smooth"});
    }

    // Create the "Structures" button
    const structuresButton = document.createElement('button');
    structuresButton.innerHTML = 'Structures';
    structuresButton.onclick = function() {
        document.getElementById('authorStructures').scrollIntoView({behavior: "smooth"});
    }

    // Create the "Gallery" button
    const galleryButton = document.createElement('button');
    galleryButton.innerHTML = 'Gallery';
    galleryButton.onclick = function() {
        document.getElementById('authorGallery').scrollIntoView({behavior: "smooth"});
    }

    // Create the "Contact" button
    const contactButton = document.createElement('button');
    contactButton.innerHTML = 'Contact';
    contactButton.onclick = function() {
        document.getElementById('authorContact').scrollIntoView({behavior: "smooth"});
    }

    // Add the buttons to the nav bar
    navBar.appendChild(aboutButton);
    navBar.appendChild(structuresButton);
    navBar.appendChild(galleryButton);
    navBar.appendChild(contactButton);

    // Add the nav bar to the authorHeader
    AuthorHeader.appendChild(navBar);
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

    //split AuthorData.description on \n
    let descriptionArray = AuthorData.description.split('\n');
    //loop through the array
    for (var i = 0; i < descriptionArray.length; i++) {
        // Add the description to the authorInfo div
        authorInfo.innerHTML += '<p>' + descriptionArray[i] + '</p>';
    }
}

// Function to create the "authorContact" div
function createAuthorContact() {
    // get the authorContact div
    var authorContact = document.getElementById('authorContact');
    //clean the authorContact div
    authorContact.innerHTML = '';

    // Add the contact information to the authorContact
    authorContact.innerHTML += '<h2>Contact</h2>';

    // create the contact informations (from the author JSON, in the "socialMediaLinks" dictionary)
    //create an UL
    var ul = document.createElement('ul');
    //loop through the socialMediaLinks dictionary
    for (var key in AuthorData.socialMediaLinks) {
        //create an LI
        var li = document.createElement('li');
        //create an A element
        var a = document.createElement('a');
        //set the href attribute to the value of the key
        a.href = AuthorData.socialMediaLinks[key];
        //set the innerHTML to the key
        a.innerHTML = key;
        //add the A element to the LI element
        li.appendChild(a);
        //add the LI element to the UL element
        ul.appendChild(li);
    }
    //add the UL element to the authorContact div
    authorContact.appendChild(ul);
}

// Function to create the "authorStructures" div
function createAuthorStructures() {
    // get the authorStructures div
    var authorStructures = document.getElementById('authorStructures');
    //clean the authorStructures div
    authorStructures.innerHTML = '';

    // Add a list of all structures by the author to the authorStructures
    authorStructures.innerHTML += '<h2>Structures</h2>';

    // Create the page buttons:
    const pageButtons = document.createElement('div');
    authorStructures.appendChild(pageButtons);
    pageButtons.className = 'page-buttons';

    // Create the page input div:
    const pageInputDiv = document.createElement('div');
    pageInputDiv.className = 'page-input-div';
    pageButtons.appendChild(pageInputDiv);

    // Create the page input:
    const pageInput = document.createElement('input');
    pageInput.type = 'number';
    pageInput.min = 1;
    pageInput.max = totalPages;
    pageInput.value = currentPage;
    pageInputDiv.appendChild(pageInput);

    // Create the go button:
    const goButton = document.createElement('button');
    goButton.innerHTML = 'Go';
    pageInputDiv.appendChild(goButton);

    const goToPage = function() {
        const inputPage = parseInt(pageInput.value);
        if (inputPage >= 1 && inputPage <= totalPages) {
            currentPage = inputPage;
            currentIndex = (currentPage - 1) * cardsPerPage;
            maxIndex = currentIndex + cardsPerPage;
            structureList.innerHTML = '';
            for (var key in structureListArray) {
                if (currentIndex <= key && key < maxIndex) {
                    const card = createStructureCard(structureListArray[key]);
                    structureList.appendChild(card);
                }
            }
            // Update the page number:
            pageNumber.innerHTML = 'Page ' + currentPage + ' of ' + totalPages;
        }
    };

    goButton.onclick = goToPage;

    pageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            goToPage();
        }
    });

    // Create the structure list:
    const structureList = document.createElement('div');
    structureList.className = 'author-structures';
    authorStructures.appendChild(structureList);

    //cards per page
    var cardsPerPage = 6;
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
                if (currentIndex <= key && key < maxIndex) {
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
                if (currentIndex <= key && key < maxIndex) {
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
        if (currentIndex <= key && key < maxIndex) {
            // Create the structure card:
            const card = createStructureCard(structureListArray[key]);
            // Add the card to the structure list:
            structureList.appendChild(card);
        }
    }
}

// Function to create the "authorGallery" div
function createAuthorGallery() {
    // get the authorGallery div
    var authorGallery = document.getElementById('authorGallery');
    //clean the authorGallery div
    authorGallery.innerHTML = '';

    // Add the gallery to the authorGallery
    authorGallery.innerHTML += '<h2>Gallery</h2>';

    //if gallery is empty
    if (AuthorGallery.length === 0) {
        // Add a message to the authorGallery
        authorGallery.innerHTML += '<p>No images available</p>';
    } else {
        // Create the gallery images
        for (var i = 0; i < AuthorGallery.length; i++) {
            // Create the image:
            const image = document.createElement('img');
            image.src = '../img/authors/gallery/' + author + '/' + AuthorGallery[i];
            image.alt = author + ' gallery image ' + i;
            // Add the image to the authorGallery:
            authorGallery.appendChild(image);
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
    loadAuthorData().then(() => {
        // Create the asideGeneralMenu
        createAsideGeneralMenu();

        // Create the authorHeader
        createAuthorHeader();

        // Create the authorInfo
        createAuthorInfo();

        // Create the authorStructures
        createAuthorStructures();

        // Create the authorGallery
        createAuthorGallery();

        // Create the authorContact
        createAuthorContact();
    });

}