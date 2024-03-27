//get the package name from the URL (?packName=)
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const packageName = urlParams.get('packName');

// From local storage, get the structure data
const structureData = JSON.parse(localStorage.getItem("structure_list"));

console.log(structureData);

// count all structures from pack
var structureCount = 0;
for (var structure in structureData) {
    if (structureData[structure].pack == packageName) {
        structureCount++;
    }
}

console.log(structureCount);

// Get the "packageDetail" div
var packageDetail = document.getElementById("packageDetail");

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
