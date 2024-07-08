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
    let authorList = document.createElement("ul");
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
    }
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


// Get the "packageDetail" div
/*var packageDetail = document.getElementById("packageDetail");

//empty the packageDetail div
packageDetail.innerHTML = "";

// Create the package title
var title = document.createElement("h1");
title.innerHTML = packageName;
packageDetail.appendChild(title);

// Create the structure count
var count = document.createElement("p");
count.innerHTML = "This package has " + structureCount + " structures";
packageDetail.appendChild(count);

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
}
);

console.log(sortedAuthors);



//add a title "Authors" to the packageDetail div
var authorTitle = document.createElement("h2");
authorTitle.innerHTML = "Authors";
packageDetail.appendChild(authorTitle);
var authorList = document.createElement("ul");
packageDetail.appendChild(authorList);

for (var i = 0; i < sortedAuthors.length; i++) {
    var author = sortedAuthors[i][0];
    var count = sortedAuthors[i][1];
    var listItem = document.createElement("li");
    var link = document.createElement("a");
    link.href = "author.html?author=" + author;
    link.innerHTML = author + " (" + count + " structures)";
    listItem.appendChild(link);
    authorList.appendChild(listItem);
}

// Add a "Download Package" button
var downloadButton = document.createElement("button");
downloadButton.innerHTML = "Download Package";
downloadButton.onclick = function() {
    console.log("Downloading package: " + packageName);
    var zip_path = "../downloads/" + packageName + ".zip";
    window.open(zip_path);
}

packageDetail.appendChild(downloadButton);

// Create the structure list
var structureList = document.createElement("ul");
packageDetail.appendChild(structureList);

// Create the structure list items
for (var structure in structureData) {
    if (structureData[structure].pack == packageName) {
        var listItem = document.createElement("li");
        var link = document.createElement("a");
        link.href = "structure.html?structureName=" + structure;
        link.innerHTML = structure;
        listItem.appendChild(link);
        structureList.appendChild(listItem);
    }
}
*/

function createKnownPackagePage() {

    // Load the package data
    loadPackageData().then(function(data) {
        console.log(data);
        createHeader();
        createPackageInfo(data.packageData);
        createPackageAuthors(data.packageName, data.structureData);
        createPackageStructures(data.packageName, data.structureData);
        //createPackageGallery(data.packageName, data.structureData);

    });

}

createKnownPackagePage()