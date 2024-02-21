//include the classes
import {Structure} from "./structure.js";
import {Town} from "./town.js";
import {fillStructureList, getStructureList, getTownList} from "./fillStructures.module.js";

// Get the path to the structure file from the URL
const urlParams = new URLSearchParams(window.location.search);
const file = urlParams.get('file');

//Make file into a string:
file.toString();

//############################################################################################################
// Structrure Header
//############################################################################################################

//Get the "structure" section from the html
const structure_div = document.getElementById('town');
structure_div.className = "structure-showcase-container";

// Add the "back" button
const backButton = document.createElement('button');
backButton.innerText = "Back";
backButton.onclick = () => {
    window.location.href = "http://ancient-warfare.legends-of-gramdatis.com/";
}

structure_div.appendChild(backButton);

//############################################################################################################
// Structure builder and package
//############################################################################################################

// Call structure constructor, and wait for it to finish loading using async/await
let town_class = new Town(file);
try {
    await town_class.load();

    // Add the structure's name as a title
    const structureName = document.createElement('h1');
    structureName.innerText = town_class.name.replace(/_/g, " ");

    structure_div.appendChild(structureName);

    //---------------------------------------------

    // Have a brown line to seperate elements
    const brownLine1 = document.createElement('div');
    brownLine1.className = "brown-line";
    structure_div.appendChild(brownLine1);

    //---------------------------------------------

    //Add a row to display the structure's package
    const structurePackageRow = document.createElement('div');
    structurePackageRow.className = "structure-header-row";

    // Add "package:" to the left
    const structurePackageLabel = document.createElement('h1');
    structurePackageLabel.className = "structure-header-row-label";
    structurePackageLabel.innerText = "Package:";
    structurePackageRow.appendChild(structurePackageLabel);

    // Add the package's name in the center
    const structurePackageName = document.createElement('h2');
    structurePackageName.className = "structure-header-row-value";
    structurePackageName.innerText = town_class.package_name;
    structurePackageRow.appendChild(structurePackageName);

    // Add a "see more" button to the right
    const structurePackageButton = document.createElement('button');
    structurePackageButton.className = "structure-header-row-button";
    structurePackageButton.innerText = "See more";
    structurePackageButton.onclick = () => {
        window.location.href = "package.html?package=" + town_class.package_name;
    }
    structurePackageRow.appendChild(structurePackageButton);

    structure_div.appendChild(structurePackageRow);


    //---------------------------------------------

    // Have a brown line to seperate elements
    const brownLine2 = document.createElement('div');
    brownLine2.className = "brown-line";
    structure_div.appendChild(brownLine2);

    //---------------------------------------------

} catch (error) {
    console.error("Error loading structure:", error);
    // Handle the error as needed
}

//############################################################################################################
// Navigation buttons
//############################################################################################################

// Dynamically generate the content buttons in a row
const contentButtonRow = document.createElement('div');
contentButtonRow.className = "structure-navigation-button-container";

// Add the "structure general" button
const structureGeneralButton = document.createElement('button');
structureGeneralButton.className = "structure-navigation-button";
structureGeneralButton.innerText = "General";
structureGeneralButton.onclick = () => {
    //Move to the "structureGeneral" div
    structureGeneral.scrollIntoView();
}
contentButtonRow.appendChild(structureGeneralButton);

// Add the "world gen options" button
const worldGenOptionsButton = document.createElement('button');
worldGenOptionsButton.className = "structure-navigation-button";
worldGenOptionsButton.innerText = "World Gen Options";
worldGenOptionsButton.onclick = () => {
    //Move to the "content2" div
    structureWorldGenOptions.scrollIntoView();
}
contentButtonRow.appendChild(worldGenOptionsButton);

// Add the "Structures" button
const structuresButton = document.createElement('button');
structuresButton.className = "structure-navigation-button";
structuresButton.innerText = "Structures";
structuresButton.onclick = () => {
    structureStructures.scrollIntoView();
}
contentButtonRow.appendChild(structuresButton);

structure_div.appendChild(contentButtonRow);

//############################################################################################################
// Content
//############################################################################################################

//############################################################################################################

// Add the "structure general" div
const structureGeneral = document.createElement('div');
structureGeneral.className = "structure-content";
structureGeneral.id = "structureGeneral";
structure_div.appendChild(structureGeneral);

// Add the "structure general" title
const structureGeneralTitle = document.createElement('h1');
structureGeneralTitle.innerText = "Structure General";

structureGeneral.appendChild(structureGeneralTitle);

// Create the base info content row
const structureGeneralContentRow = document.createElement('div');
structureGeneralContentRow.className = "structure-content-row";

//---------------------------------------------

// Add the "Territory" label
const territoryLabel = document.createElement('p');
if (town_class.territoryName === "") {
    territoryLabel.innerText = "Territory: none";
} else {
    territoryLabel.innerText = "Territory: " + town_class.territoryName;
}
structureGeneralContentRow.appendChild(territoryLabel);

// Add the "Type" label
const typeLabel = document.createElement('p');
typeLabel.innerText = "Type: Town";
structureGeneralContentRow.appendChild(typeLabel);

// Add the "size" label
const sizeLabel = document.createElement('p');
sizeLabel.innerText = "Size: from " + town_class.minSize + " to " + town_class.maxSize + " chunks";
structureGeneralContentRow.appendChild(sizeLabel);

//---------------------------------------------

// Add "structureGeneralContentRow" to "structureGeneral"
structureGeneral.appendChild(structureGeneralContentRow);

//---------------------------------------------

//Draw a line to seperate elements
const line = document.createElement('div');
line.className = "brown-line";
structureGeneral.appendChild(line);

//---------------------------------------------

//Create teh content row with more main info and structure description
const contentRow2 = document.createElement('div');
contentRow2.className = "structure-content-info-row";

//---------------------------------------------

//Left row for main info
const contentRow2Left = document.createElement('div');

//---------------------------------------------

//Add the uniqueStructures count
const uniqueStructuresLabel = document.createElement('p');
if (town_class.uniqueStructures.length === 0) {
    uniqueStructuresLabel.innerText = "⇨ Has no unique structures";
} else if (town_class.uniqueStructures.length === 1) {
    uniqueStructuresLabel.innerText = "⇨ Has 1 unique structure";
} else {
    uniqueStructuresLabel.innerText = "⇨ Has " + town_class.uniqueStructures.length + " unique structures";
}
contentRow2Left.appendChild(uniqueStructuresLabel);

//Add the mainStructures count
const mainStructuresLabel = document.createElement('p');
if (town_class.mainStructures.length === 0) {
    mainStructuresLabel.innerText = "⇨ Has no main structures";
} else if (town_class.mainStructures.length === 1) {
    mainStructuresLabel.innerText = "⇨ Has 1 main structure";
} else {
    mainStructuresLabel.innerText = "⇨ Has " + town_class.mainStructures.length + " main structures";
}
contentRow2Left.appendChild(mainStructuresLabel);

//Add the houseStructures count
const houseStructuresLabel = document.createElement('p');
if (town_class.houseStructures.length === 0) {
    houseStructuresLabel.innerText = "⇨ Has no house structures";
} else if (town_class.houseStructures.length === 1) {
    houseStructuresLabel.innerText = "⇨ Has 1 house structure";
} else {
    houseStructuresLabel.innerText = "⇨ Has " + town_class.houseStructures.length + " house structures";
}
contentRow2Left.appendChild(houseStructuresLabel);

//Add the cosmeticStructures count
const cosmeticStructuresLabel = document.createElement('p');
if (town_class.cosmeticStructures.length === 0) {
    cosmeticStructuresLabel.innerText = "⇨ Has no cosmetic structures";
} else if (town_class.cosmeticStructures.length === 1) {
    cosmeticStructuresLabel.innerText = "⇨ Has 1 cosmetic structure";
} else {
    cosmeticStructuresLabel.innerText = "⇨ Has " + town_class.cosmeticStructures.length + " cosmetic structures";
}
contentRow2Left.appendChild(cosmeticStructuresLabel);

//Add the exteriorStructures count
const exteriorStructuresLabel = document.createElement('p');
if (town_class.exteriorStructures.length === 0) {
    exteriorStructuresLabel.innerText = "⇨ Has no exterior structures";
} else if (town_class.exteriorStructures.length === 1) {
    exteriorStructuresLabel.innerText = "⇨ Has 1 exterior structure";
} else {
    exteriorStructuresLabel.innerText = "⇨ Has " + town_class.exteriorStructures.length + " exterior structures";
}
contentRow2Left.appendChild(exteriorStructuresLabel);

//---------------------------------------------

contentRow2.appendChild(contentRow2Left);

//---------------------------------------------

// Have a brown line to seperate elements
const brownLine1 = document.createElement('p');
brownLine1.className = "brown-line-vert";
contentRow2.appendChild(brownLine1);

//---------------------------------------------

//Right row for description
const contentRow2Right = document.createElement('div');

//---------------------------------------------

// Add the description
const description = document.createElement('p');
description.innerText = town_class.description;
contentRow2Right.appendChild(description);

//---------------------------------------------

contentRow2.appendChild(contentRow2Right);

//---------------------------------------------

// Add the content row to the content
structureGeneral.appendChild(contentRow2);

//############################################################################################################

// World Gen Options
const structureWorldGenOptions = document.createElement('div');
structureWorldGenOptions.id = "structureWorldGenOptions";
structureWorldGenOptions.className = "structure-content";

// Add title
const title = document.createElement('h2');
title.innerText = "World Gen Options";

structureWorldGenOptions.appendChild(title);

//---------------------------------------------

// Create a list of the world gen options
let worldGenOptionsList = document.createElement('ul');
worldGenOptionsList.className = "structure-content";

//----------------------
//buildingExpansion
let buildingExpansion = document.createElement('li');
buildingExpansion.textContent = "Building Expansion: " + town_class.buildingExpansion;
worldGenOptionsList.appendChild(buildingExpansion);

//----------------------
//preventNaturalHostileSpawns
let preventNaturalHostileSpawns = document.createElement('li');
preventNaturalHostileSpawns.textContent = "Prevent Natural Hostile Spawns: " + town_class.preventNaturalHostileSpawns;
worldGenOptionsList.appendChild(preventNaturalHostileSpawns);

//----------------------
//selectionWeight
let selectionWeight = document.createElement('li');
selectionWeight.textContent = "Selection Weight: " + town_class.selectionWeight;
worldGenOptionsList.appendChild(selectionWeight);

//----------------------
//clusterValue
let clusterValue = document.createElement('li');
clusterValue.textContent = "Cluster Value: " + town_class.clusterValue;
worldGenOptionsList.appendChild(clusterValue);

//----------------------
//townBlockSize
let townBlockSize = document.createElement('li');
townBlockSize.textContent = "Town Block Size: " + town_class.townBlockSize;
worldGenOptionsList.appendChild(townBlockSize);

//----------------------
//townPlotSize
let townPlotSize = document.createElement('li');
townPlotSize.textContent = "Town Plot Size: " + town_class.townPlotSize;
worldGenOptionsList.appendChild(townPlotSize);

//----------------------
//wallStyle
let wallStyle = document.createElement('li');
wallStyle.textContent = "Wall Style: " + town_class.wallStyle;
worldGenOptionsList.appendChild(wallStyle);

//----------------------
//wallSize
let wallSize = document.createElement('li');
wallSize.textContent = "Wall Size: " + town_class.wallSize;
worldGenOptionsList.appendChild(wallSize);

//----------------------
//exteriorSize
let exteriorSize = document.createElement('li');
exteriorSize.textContent = "Exterior Size: " + town_class.exteriorSize;
worldGenOptionsList.appendChild(exteriorSize);

//----------------------
//exteriorPlotSize
let exteriorPlotSize = document.createElement('li');
exteriorPlotSize.textContent = "Exterior Plot Size: " + town_class.exteriorPlotSize;
worldGenOptionsList.appendChild(exteriorPlotSize);

//----------------------
//interiorEmptyPlotChance
let interiorEmptyPlotChance = document.createElement('li');
interiorEmptyPlotChance.textContent = "Interior Empty Plot Chance: " + town_class.interiorEmptyPlotChance;
worldGenOptionsList.appendChild(interiorEmptyPlotChance);

//----------------------
//randomVillagersPerChunk
let randomVillagersPerChunk = document.createElement('li');
randomVillagersPerChunk.textContent = "Random Villagers Per Chunk: " + town_class.randomVillagersPerChunk;
worldGenOptionsList.appendChild(randomVillagersPerChunk);

//----------------------
//roadBlock
let roadBlock = document.createElement('li');
roadBlock.textContent = "Road Blocks:";

console.log(town_class.roadBlocks);

let roadBlock2 = document.createElement('ul');
roadBlock2.className = "structure-content-list";

for (let block of town_class.roadBlocks) {
    console.log(block);
    let blockListItem = document.createElement('li');
    if (block.meta != undefined && block.meta != "") {
        blockListItem.textContent = block.block + " - " + block.meta;
    } else {
        blockListItem.textContent = block.block;
    }
    roadBlock2.appendChild(blockListItem);
}
roadBlock.appendChild(roadBlock2);

worldGenOptionsList.appendChild(roadBlock);

//----------------------
//roadMeta
let roadMeta = document.createElement('li');
roadMeta.textContent = "Road Meta: " + town_class.roadMeta;
worldGenOptionsList.appendChild(roadMeta);

//----------------------
//dimensionWhiteList
let dimensionWhiteList = document.createElement('li');
dimensionWhiteList.textContent = "Dimension White List: " + town_class.dimensionWhiteList;
worldGenOptionsList.appendChild(dimensionWhiteList);

//----------------------
//dimensionList
let dimensionList = document.createElement('li');
dimensionList.textContent = "Dimension List: " + town_class.dimensionList;
worldGenOptionsList.appendChild(dimensionList);

//----------------------
//biomeWhiteList
let biomeWhiteList = document.createElement('li');
biomeWhiteList.textContent = "Biome White List: " + town_class.biomeWhiteList;
worldGenOptionsList.appendChild(biomeWhiteList);

//----------------------
//biomeList
let biomeList = document.createElement('li');
biomeList.textContent = "Biome List: ";

worldGenOptionsList.appendChild(biomeList);

let biomeList2 = document.createElement('ul');
biomeList2.className = "structure-content-list";

for (let biome of town_class.biomeList) {
    let biomeListItem = document.createElement('li');
    biomeListItem.innerText = biome;
    biomeList2.appendChild(biomeListItem);
}
biomeList.appendChild(biomeList2);

//----------------------
//lamp
let lamp = document.createElement('li');
lamp.textContent = "Lamp: " + town_class.lamp;
worldGenOptionsList.appendChild(lamp);

//----------------------
//biomeReplacement
let biomeReplacement = document.createElement('li');
biomeReplacement.textContent = "Biome Replacement: " + town_class.biomeReplacement;
worldGenOptionsList.appendChild(biomeReplacement);

//----------------------

// Assemble the content
structureWorldGenOptions.appendChild(worldGenOptionsList);

// Add the content to the structure div
structure_div.appendChild(structureWorldGenOptions);

//############################################################################################################

