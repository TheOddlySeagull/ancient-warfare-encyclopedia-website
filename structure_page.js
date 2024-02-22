// this script will generate a structure specific page.

// Get the path to the structure structureName from the URL
const urlParams = new URLSearchParams(window.location.search);
const structureName = urlParams.get('structureName');

// From local storage, get the structure data
const structureData = JSON.parse(localStorage.getItem("structure_list"));

console.log(structureData);

// Get the structure data from the structureName
const structure = structureData[structureName];