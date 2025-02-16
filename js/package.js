// This script will generate a package specific page

var packageData = {};

//get the package name from the URL (?packName=)
function getPackageName() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    console.log(urlParams.get('packName'));
    return urlParams.get('packName');
}

// From local storage, get the structure data
function getStructureData() {
    const structureData = JSON.parse(localStorage.getItem("structure_list"));
    if (structureData) {
        return structureData;
    }
    return {};
}

// Function to count the number of structures in a package
function countStructuresInPackage(packageName, structureData) {
    var structureCount = 0;
    for (var structure in structureData) {
        if (structureData[structure].pack == packageName) {
            structureCount++;
        }
    }
    return structureCount;
}

// Function to load the package data
async function loadPackageData() {
    const packageName = getPackageName();
    const structureData = getStructureData();
    const structureCount = countStructuresInPackage(packageName, structureData);

    // Load the package json file
    try {
        const response = await fetch("../json/packages/" + packageName + ".json");
        const data = await response.json();
        packageData = data;
    } catch (error) {
        console.log('Package JSON not found');
        packageData = {
            "description": "No description available"
        };
    }

    console.log(packageData);

    // Load the package image
    let packageImage = new Image();
    try {
        packageImage.src = "../img/packages/" + packageName + ".png";
    } catch (error) {
        console.log('Package image not found');
        packageImage.src = '../img/AW2.png';
    }

    return {
        packageName: packageName,
        structureData: structureData,
        structureCount: structureCount,
        packageData: packageData,
        packageImage: packageImage
    };
}

var packageName = getPackageName();
var structureData = getStructureData();
var structureCount = countStructuresInPackage(packageName, structureData);

// Function to create the page header
function createHeader() {
    let packageHeader = document.getElementById("packageHeader");
    packageHeader.innerHTML = "";

    // inside this div, we have a div and a nav bar
    // create the div for the package image
    let packageBanner = document.createElement("div");
    packageBanner.className = 'package-banner';

    // Inside the package image div, we have the image of the package, and a h1 element with the package name
    let packageImage = document.createElement("img");
    packageImage.src = '../img/AW2.png';
    packageBanner.appendChild(packageImage);

    let packageNameDiv = document.createElement("h1");
    packageNameDiv.innerHTML = packageName;
    packageBanner.appendChild(packageNameDiv);

    // Add the package image div to the package header
    packageHeader.appendChild(packageBanner);

    // Create the nav bar
    const navBar = document.createElement('nav');

    // Create the "About" button
    const aboutButton = document.createElement('button');
    aboutButton.innerHTML = 'About';
    aboutButton.onclick = function() {
        document.getElementById('packageInfo').scrollIntoView({behavior: "smooth"});
    }

    // Create the "Authors" button
    const authorsButton = document.createElement('button');
    authorsButton.innerHTML = 'Authors';
    authorsButton.onclick = function() {
        document.getElementById('packageAuthors').scrollIntoView({behavior: "smooth"});
    }

    // Create the "Structures" button
    const structuresButton = document.createElement('button');
    structuresButton.innerHTML = 'Structures';
    structuresButton.onclick = function() {
        document.getElementById('packageStructures').scrollIntoView({behavior: "smooth"});
    }

    // Create the "Gallery" button
    const galleryButton = document.createElement('button');
    galleryButton.innerHTML = 'Gallery';
    galleryButton.onclick = function() {
        document.getElementById('packageGallery').scrollIntoView({behavior: "smooth"});
    }

    // Create the "Download" button
    const downloadButton = document.createElement('button');
    downloadButton.innerHTML = 'Download';
    downloadButton.onclick = function() {
        console.log("Downloading package: " + packageName);
        var zip_path = "../downloads/" + packageName + ".zip";
        window
            .open(zip_path);
    }

    // Add the buttons to the nav bar
    navBar.appendChild(aboutButton);
    navBar.appendChild(authorsButton);
    navBar.appendChild(structuresButton);
    navBar.appendChild(galleryButton);
    navBar.appendChild(downloadButton);

    // Add the nav bar to the package header
    packageHeader.appendChild(navBar);
}

//Function to create the "packageInfo" div
function createPackageInfo(packageData) {
    // Here we make an h2 title "About", add the description of the package

    //get the div
    let packageInfo = document.getElementById("packageInfo");
    packageInfo.innerHTML = "";

    // Add the h2 title "About"
    let aboutTitle = document.createElement("h2");
    aboutTitle.innerHTML = "About";
    packageInfo.appendChild(aboutTitle);

    // Split the description on \n
    let descriptionParts = packageData.description.split("\n");
    // create a p per part
    for (let i = 0; i < descriptionParts.length; i++) {
        let descriptionPart = document.createElement("p");
        descriptionPart.innerHTML = descriptionParts[i];
        packageInfo.appendChild(descriptionPart);
    }
}

//Function to create the "packageAuthors" div
function createPackageAuthors(packageName, structureData) {
    // List all the authors of the structures in the package (structure count and percentage of total)
    var authors = {};
    for (var structure in structureData) {
        if (structureData[structure].pack == packageName) {
            var author = structureData[structure].validation.structureAuthor;
            if (author == "") {
                author = "Unknown";
            }
            if (author in authors) {
                authors[author]++;
            } else {
                authors[author] = 1;
            }
        }
    }

    //sort the authors by structure count
    var sortedAuthors = [];
    for (var author in authors) {
        sortedAuthors.push([author, authors[author]]);
    }
    sortedAuthors.sort(function(a, b) {
        return b[1] - a[1];
    });

    console.log(sortedAuthors);

    //get the div
    let packageAuthors = document.getElementById("packageAuthors");
    packageAuthors.innerHTML = "";

    // Add the h2 title "Authors"
    let authorTitle = document.createElement("h2");
    authorTitle.innerHTML = "Authors";
    packageAuthors.appendChild(authorTitle);

    // Create the author list
    /*let authorList = document.createElement("ul");
    packageAuthors.appendChild(authorList);

    // Add the authors to the author list
    for (var i = 0; i < sortedAuthors.length; i++) {
        var author = sortedAuthors[i][0];
        var count = sortedAuthors[i][1];
        var listItem = document.createElement("li");
        var link = document.createElement("a");
        link.href = "author.html?author=" + author;
        link.innerHTML = author + " (" + count + " structures)";
        listItem.appendChild(link);
        authorList.appendChild(listItem);
    }*/

    // Create the button panel:
    const buttonPanel = document.createElement('div');
    buttonPanel.className = 'author-button-panel';

    for (var i = 0; i < sortedAuthors.length; i++) {
        console.log(sortedAuthors[i]);
        let buttonName = sortedAuthors[i][0];
        let authorName = sortedAuthors[i][0];

        // Create the button's text:
        if (authorName == "Unknown" || authorName == "" || authorName == null || authorName == undefined) {
            buttonName = "Unknown author for " + sortedAuthors[i][1] + " structures";
        } else {
            if (sortedAuthors[i][1] > 1) {
                buttonName = authorName + ' with ' + sortedAuthors[i][1] + ' structures';
            } else {
                buttonName = authorName + ' with ' + sortedAuthors[i][1] + ' structure';
            }
        }

        // Create the button:
        const authorButton = document.createElement('button');
        authorButton.innerHTML = buttonName;
        authorButton.onclick = function() {
            window.location.href = 'author.html?author=' + authorName;
        };

        // Add the button to the panel:
        buttonPanel.appendChild(authorButton);
    }

    // Add the button panel to the package authors
    packageAuthors.appendChild(buttonPanel);
}

// Function to create the "packageStructures" div
function createPackageStructures(packageName, structureData) {
    // Create the structure list
    let packageStructures = document.getElementById("packageStructures");
    packageStructures.innerHTML = "";

    // Add the h2 title "Structures"
    let structureTitle = document.createElement("h2");
    structureTitle.innerHTML = "Structures";
    packageStructures.appendChild(structureTitle);

    // Create the structure list
    let structureList = document.createElement("ul");
    packageStructures.appendChild(structureList);

    // Create the structure list items
    for (var structure in structureData) {
        if (structureData[structure].pack == packageName) {
            let listItem = document.createElement("li");
            let link = document.createElement("a");
            link.href = "structure.html?structureName=" + structure;
            link.innerHTML = structure;
            listItem.appendChild(link);
            structureList.appendChild(listItem);
        }
    }
}

// Function to create the "packageGallery" div
function createPackageGallery(packageName, structureData) {
    // Create the gallery
    let packageGallery = document.getElementById("packageGallery");
    packageGallery.innerHTML = "";

    // Add the h2 title "Gallery"
    let galleryTitle = document.createElement("h2");
    galleryTitle.innerHTML = "Gallery";
    packageGallery.appendChild(galleryTitle);

    // Create the gallery
    let gallery = document.createElement("div");
    gallery.className = 'gallery';
    packageGallery.appendChild(gallery);

    // Create the gallery items
    for (var structure in structureData) {
        if (structureData[structure].pack == packageName) {
            let galleryItem = document.createElement("div");
            galleryItem.className = 'gallery-item';
            let link = document.createElement("a");
            link.href = "structure.html?structureName=" + structure;
            let image = new Image();
            image.src = "../img/structures/" + structure + ".png";
            link.appendChild(image);
            galleryItem.appendChild(link);
            gallery.appendChild(galleryItem);
        }
    }

    // Add the gallery to the package gallery
    packageGallery.appendChild(gallery);
}

// Function to create teh "asideGeneralMenu" div
function createAsideGeneralMenuUnknown() {
    // get the asideGeneralMenu div
    var asideGeneralMenu = document.getElementById('asideGeneralMenu');
    //clean the asideGeneralMenu div
    asideGeneralMenu.innerHTML = '';

    // count the total number of packages
    var totalPackages = 0;
    var pack_name_list = [];
    for (var structure in structureData) {
        if (!pack_name_list.includes(structureData[structure].pack)) {
            pack_name_list.push(structureData[structure].pack);
            totalPackages++;
        }
    }

    // create a div for the "there are x packages on this website" message
    var packageCountDiv = document.createElement('div');

    packageCountDiv.innerHTML += '<h3>Packages</h3>'
    packageCountDiv.innerHTML += '<p>There are ' + totalPackages + ' packages on this website</p>';

    // add the packageCountDiv to the asideGeneralMenu div
    asideGeneralMenu.appendChild(packageCountDiv);

}

// Function to create teh "asideGeneralMenu" div
function createAsideGeneralMenu() {
    // get the number of structure in that package
    var totalStructures = 0;
    for (var structure in structureData) {
        if (structureData[structure].pack == packageName) {
            totalStructures++;
        }
    }

    // get the asideGeneralMenu div
    var asideGeneralMenu = document.getElementById('asideGeneralMenu');
    //clean the asideGeneralMenu div
    asideGeneralMenu.innerHTML = '';

    // create a div for the "there are x structures in this package" message
    var structureCountDiv = document.createElement('div');

    structureCountDiv.innerHTML += '<h3>Structures</h3>'

    if (totalStructures > 1) {
        structureCountDiv.innerHTML += '<p>There are ' + totalStructures + ' structures in this package</p>';
    } else {
        structureCountDiv.innerHTML += '<p>There is ' + totalStructures + ' structure in this package</p>';
    }

    // create a div for the "there are x authors that worked on this package" message
    var authorCountDiv = document.createElement('div');
    authorCountDiv.innerHTML += '<h3>Authors</h3>'


    var totalAuthors = 0;
    var authors = {};
    for (var structure in structureData) {
        if (structureData[structure].pack == packageName) {
            var author = structureData[structure].validation.structureAuthor;
            if (author == "" || author == null || author == undefined || author == " ") {
                author = "Unknown";
            }
            if (author in authors) {
                authors[author]++;
            } else {
                authors[author] = 1;
            }
        }
    }

    for (var author in authors) {
        if (author != "Unknown") {
            totalAuthors++;
        }
    }

    if (totalAuthors > 1) {
        authorCountDiv.innerHTML += '<p>There are ' + totalAuthors + ' known authors that worked on this package</p>';
    } else if (totalAuthors == 0) {
        authorCountDiv.innerHTML += '<p>There are no known authors that worked on this package</p>';
    } else {
        authorCountDiv.innerHTML += '<p>There is ' + totalAuthors + ' known author that worked on this package</p>';
    }

    // add the structureCountDiv to the asideGeneralMenu div
    asideGeneralMenu.appendChild(structureCountDiv);
    // add the authorCountDiv to the asideGeneralMenu div
    asideGeneralMenu.appendChild(authorCountDiv);

    // create a div for the "Download" button
    var downloadDiv = document.createElement('div');
    const packDownloadButton = document.createElement('button');
    packDownloadButton.innerHTML = 'Download Package';
    packDownloadButton.onclick = function() {
        console.log("Downloading package: " + packageName);
        var zip_path = "../downloads/" + packageName + ".zip";
        window
            .open(zip_path);
    }
    downloadDiv.appendChild(packDownloadButton);
    asideGeneralMenu.appendChild(downloadDiv);

}

// Function to create the page header for all packages page
function createUnknownHeader() {
    let packageHeader = document.getElementById("packageHeader");
    packageHeader.innerHTML = "";

    // inside this div, we have a div and a nav bar
    // create the div for the package image
    let packageBanner = document.createElement("div");
    packageBanner.className = 'package-banner';

    // Inside the package image div, we have the image of the package, and a h1 element with the package name
    let packageImage = document.createElement("img");
    packageImage.src = '../img/AW2.png';
    packageBanner.appendChild(packageImage);

    let packageNameDiv = document.createElement("h1");
    packageNameDiv.innerHTML = "Ancient Warfare 2 - Structure Packs";
    packageBanner.appendChild(packageNameDiv);

    // Add the package image div to the package header
    packageHeader.appendChild(packageBanner);
}

//Function to create the "packageInfo" div for all packages page
function createUnknownPackageInfo() {
    // Here we make an h2 title "About", add the description of the package

    //get the div
    let packageInfo = document.getElementById("packageInfo");
    packageInfo.innerHTML = "";

    // Add the h2 title "About"
    let aboutTitle = document.createElement("h2");
    aboutTitle.innerHTML = "About";
    packageInfo.appendChild(aboutTitle);

    // create a p per part
    let descriptionPart = document.createElement("p");
    descriptionPart.innerHTML = "Ancient Warfare 2 is a mod that adds a variety of structures to the game. Here you can find the structure packs that are available for the mod. The structure packs contain a variety of structures, from houses to castles, and from farms to factories. Each structure pack has its own theme and style, and can be used to enhance your world.";
    packageInfo.appendChild(descriptionPart);
}

// Function to create the list of all packages on the website
function createAllPackagesList() {
    // Load the package data
    loadPackageData().then(function(data) {
        console.log(data);

        // Run through all structures and count the number of structures per package
        var packageCount = {};
        for (var structure in data.structureData) {
            var pack = data.structureData[structure].pack;
            if (pack in packageCount) {
                packageCount[pack]++;
            } else {
                packageCount[pack] = 1;
            }
        }

        // Sort the packages by structure count
        var sortedPackages = [];
        for (var pack in packageCount) {
            sortedPackages.push([pack, packageCount[pack]]);
        }
        sortedPackages.sort(function(a, b) {
            return b[1] - a[1];
        });

        console.log(sortedPackages);

        // Get the div
        let packageAuthors = document.getElementById("packageAuthors");
        packageAuthors.innerHTML = "";

        // Add the h2 title "Packages"
        let authorTitle = document.createElement("h2");
        authorTitle.innerHTML = "Packages";
        packageAuthors.appendChild(authorTitle);

        // Create the button panel:
        const buttonPanel = document.createElement('div');
        buttonPanel.className = 'author-button-panel';

        for (var i = 0; i < sortedPackages.length; i++) {
            console.log(sortedPackages[i]);
            let buttonName = sortedPackages[i][0];
            let packageName = sortedPackages[i][0];

            // Create the button's text:
            if (packageName === "Unknown") {
                buttonName = "Unknown package for " + sortedPackages[i][1] + " structures";
            } else {
                if (sortedPackages[i][1] > 1) {
                    buttonName = packageName + ' with ' + sortedPackages[i][1] + ' structures';
                } else {
                    buttonName = packageName + ' with ' + sortedPackages[i][1] + ' structure';
                }
            }

            // Create the button:
            const authorButton = document.createElement('button');
            authorButton.innerHTML = buttonName;
            authorButton.onclick = function() {
                window.location.href = 'package.html?packName=' + packageName;
            };

            // Add the button to the panel:
            buttonPanel.appendChild(authorButton);
        }

        // Add the button panel to the package authors
        packageAuthors.appendChild(buttonPanel);


    });


}

function createKnownPackagePage() {

    // Load the package data
    loadPackageData().then(function(data) {
        console.log(data);
        createHeader();
        createPackageInfo(data.packageData);
        createPackageAuthors(data.packageName, data.structureData);
        createPackageStructures(data.packageName, data.structureData);
        //createPackageGallery(data.packageName, data.structureData);
        createAsideGeneralMenu();
    });

}

function createUnknownPackagePage() {

    createUnknownHeader();
    createUnknownPackageInfo();
    createAllPackagesList();
    createAsideGeneralMenuUnknown();
}

console.log("Package name: " + packageName);
if (packageName != null) {
    createKnownPackagePage();
} else {
    createUnknownPackagePage();
}
