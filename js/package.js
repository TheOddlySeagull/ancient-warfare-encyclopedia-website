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
count.innerHTML = "Structures: " + structureCount;
packageDetail.appendChild(count);

// Add a "Download Package" button
var downloadButton = document.createElement("button");
downloadButton.innerHTML = "Download Package";
downloadButton.onclick = function() {
    console.log("Downloading package: " + packageName);
    var zip_path = "../downloads/" + packageName + ".zip";
    window.open(zip_path);

    // Add the download to the download count
    var downloadCount = localStorage.getItem("download_count");
    downloadCount++;
    localStorage.setItem("download_count", downloadCount);

    // Update the download count on the page
    var downloadCountElement = document.getElementById("downloadCount");
    downloadCountElement.innerHTML = downloadCount;
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
