
//include the classes
import {Structure} from "./structure.js";
import {Town} from "./town.js";
import {fillStructureList, getStructureList, getTownList, getTownClassList} from "./fillStructures.module.js";

// Get the path to the structure file from the URL
const urlParams = new URLSearchParams(window.location.search);
const file = urlParams.get('file');

//Make file into a string:
file.toString();

//############################################################################################################
// Structrure Header
//############################################################################################################

//Get the "structure" section from the html
const structure_div = document.getElementById('structure');
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
let structure_class = new Structure(file);
try {
    await structure_class.load();

    // Add the structure's name as a title
    const structureName = document.createElement('h1');
    structureName.innerText = structure_class.name.replace(/_/g, " ");

    structure_div.appendChild(structureName);

    //---------------------------------------------

    // Have a brown line to seperate elements
    const brownLine1 = document.createElement('div');
    brownLine1.className = "brown-line";
    structure_div.appendChild(brownLine1);

    //---------------------------------------------

    //Add a row to display the structure's builder
    const structureBuilderRow = document.createElement('div');
    structureBuilderRow.className = "structure-header-row";

    // Add "builder:" to the left
    const structureBuilderLabel = document.createElement('h1');
    structureBuilderLabel.className = "structure-header-row-label";
    structureBuilderLabel.innerText = "Builder:";
    structureBuilderRow.appendChild(structureBuilderLabel);

    // Add the builder's name in the center
    const structureBuilderName = document.createElement('h2');
    structureBuilderName.className = "structure-header-row-value";
    structureBuilderName.innerText = structure_class.structureAuthor;
    structureBuilderRow.appendChild(structureBuilderName);

    // Add a "see more" button to the right
    const structureBuilderButton = document.createElement('button');
    structureBuilderButton.className = "structure-header-row-button";
    structureBuilderButton.innerText = "See more";
    structureBuilderButton.onclick = () => {
        window.location.href = "builder.html?builder=" + structure_class.structureAuthor;
    }
    structureBuilderRow.appendChild(structureBuilderButton);

    structure_div.appendChild(structureBuilderRow);

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
    structurePackageName.innerText = structure_class.package_name;
    structurePackageRow.appendChild(structurePackageName);

    // Add a "see more" button to the right
    const structurePackageButton = document.createElement('button');
    structurePackageButton.className = "structure-header-row-button";
    structurePackageButton.innerText = "See more";
    structurePackageButton.onclick = () => {
        window.location.href = "package.html?package=" + structure_class.package_name;
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

// Add the "layers, entities, and blocks" button
const layersEntitiesBlocksButton = document.createElement('button');
layersEntitiesBlocksButton.className = "structure-navigation-button";
layersEntitiesBlocksButton.innerText = "Layers, Entities, and Blocks";
layersEntitiesBlocksButton.onclick = () => {
    //Move to the "content3" div
    structureLayers.scrollIntoView();
}
contentButtonRow.appendChild(layersEntitiesBlocksButton);


structure_div.appendChild(contentButtonRow);

//############################################################################################################
// Content
//############################################################################################################


//############################################################################################################

// structure general
const structureGeneral = document.createElement('div');
structureGeneral.id = "structureGeneral";
structureGeneral.className = "structure-content";

// ADd title
const title2 = document.createElement('h2');
title2.innerText = "General";

structureGeneral.appendChild(title2);

// Create a content row
const contentRow = document.createElement('div');
contentRow.className = "structure-content-row";

//---------------------------------------------

// Create a sub-content row
const subContentRow = document.createElement('div');
subContentRow.className = "structure-content-row-elemnt";

// Add the "Territory" label
const territoryLabel = document.createElement('p');
territoryLabel.className = "structure-content-label";
territoryLabel.innerText = "Territory: ";
subContentRow.appendChild(territoryLabel);

// Add the territory value
const territoryValue = document.createElement('p');
territoryValue.className = "structure-content-value";
territoryValue.innerText = structure_class.territoryName;
subContentRow.appendChild(territoryValue);

// Add the content sub-row to the content row
contentRow.appendChild(subContentRow);

//---------------------------------------------

// Create a sub-content row
const subContentRow2 = document.createElement('div');
subContentRow2.className = "structure-content-row-elemnt";

// Add the "Type" label
const typeLabel = document.createElement('p');
typeLabel.className = "structure-content-label";
typeLabel.innerText = "Type: ";
subContentRow2.appendChild(typeLabel);

// Add the type value
const typeValue = document.createElement('p');
typeValue.className = "structure-content-value";
typeValue.innerText = structure_class.type;
subContentRow2.appendChild(typeValue);

// Add the content sub-row to the content row
contentRow.appendChild(subContentRow2);

//---------------------------------------------

// Create a sub-content row
const subContentRow3 = document.createElement('div');
subContentRow3.className = "structure-content-row-elemnt";

// Add the "Size" label
const sizeLabel = document.createElement('p');
sizeLabel.className = "structure-content-label";
sizeLabel.innerText = "Size: ";
subContentRow3.appendChild(sizeLabel);

// Add the size value
const sizeValue = document.createElement('p');
sizeValue.className = "structure-content-value";
sizeValue.innerText = "x: " + structure_class.size.x + ", y: " + structure_class.size.y + ", z: " + structure_class.size.z;
subContentRow3.appendChild(sizeValue);

// Add the content sub-row to the content row
contentRow.appendChild(subContentRow3);

//---------------------------------------------

// Add the content row to the content
structureGeneral.appendChild(contentRow);

//---------------------------------------------

//Draw a line to seperate elements
const line = document.createElement('div');
line.className = "brown-line";
structureGeneral.appendChild(line);

//---------------------------------------------

// Create a content row
const contentRow2 = document.createElement('div');
contentRow2.className = "structure-content-info-row";

//---------------------------------------------

// In that row, make 2 columns, one for the left side, one for the right side

//Left row for info
const contentRow2Left = document.createElement('div');

//---------------------------------------------

console.log(structure_class);

// Add "Survival build" if the structure is a survival build
if (structure_class.survival == true) {
    const survivalBuild = document.createElement('p');
    survivalBuild.innerText = "⇨ Survival build";
    contentRow2Left.appendChild(survivalBuild);
} else {
    const survivalBuild = document.createElement('p');
    survivalBuild.innerText = "⇨ Not a survival build";
    contentRow2Left.appendChild(survivalBuild);
}

//---------------------------------------------

//Add "World gen" if the structure is a world gen
if (structure_class.worldGenEnabled == true) {
    const worldGen = document.createElement('p');
    worldGen.className = "structure-content-value";
    // Add "Unique" in front of the world gen if it is unique
    if (structure_class.unique == true) {
        worldGen.innerText = "⇨ Unique world gen";
    } else {
        worldGen.innerText = "⇨ World gen, not unique";
    }
    contentRow2Left.appendChild(worldGen);
} else {
    const worldGen = document.createElement('p');
    worldGen.className = "structure-content-value";
    worldGen.innerText = "⇨ Not a world gen";
    contentRow2Left.appendChild(worldGen);
}

//---------------------------------------------

// Create a variable to store the number of towns where the structure is present
let townCount = 0;
// Function to count the number of towns where the structure is present, if fillStructureList has finished loading
async function countTowns() {
    // await fillStructureList then call createStructureContainer for each structure
    await fillStructureList().then(async () => {

        // Loop through each town
        for (const town of getTownList()) {
            
            // Create the Town object
            let town_class = new Town(town.path);

            // Load the town
            await town_class.load().then(async () => {

                //console.log("Town loaded:", town_class);

                if (town_class.isStructureInTown(structure_class.name)) {
                    console.log("Structure is in town: ", town_class.name);
                    townCount++;
                } else {
                    console.log("Structure is not in town ", town_class.name);
                }
            }
            ).catch(error => {
                console.error("Error loading town:", error);
            });
        }

        // Return the number of towns where the structure is present
        return townCount;
    });
}

/*async function countTowns() {
    // await fillStructureList then call createStructureContainer for each structure
    await fillStructureList().then(async () => {

        // Loop through each town
        for (const town_class of getTownClassList()) {

            if (town_class.isStructureInTown(structure_class.name)) {
                console.log("Structure is in town: ", town_class.name);
                townCount++;
            } else {
                console.log("Structure is not in town ", town_class.name);
            }
        }

        // Return the number of towns where the structure is present
        return townCount;
    });
}*/


// Call the async function
await countTowns();
console.log("Number of towns where the structure is present:", townCount);
// Add the number of towns where the structure is present
if (townCount == 1) {
    const inTowns = document.createElement('p');
    inTowns.className = "structure-content-value";
    inTowns.innerText = "⇨ In " + townCount + " town";
    contentRow2Left.appendChild(inTowns);
}
if (townCount > 1) {
    const inTowns = document.createElement('p');
    inTowns.className = "structure-content-value";
    inTowns.innerText = "⇨ In " + townCount + " towns";
    contentRow2Left.appendChild(inTowns);
}
if (townCount == 0) {
    const inTowns = document.createElement('p');
    inTowns.className = "structure-content-value";
    inTowns.innerText = "⇨ Not in any towns";
    contentRow2Left.appendChild(inTowns);
}

//---------------------------------------------

//Add "Mod dependancy" if the structure has a Mod dependancy
if (structure_class.mods == []) {
    const modDependancy = document.createElement('p');
    modDependancy.className = "structure-content-value";
    modDependancy.innerText = "⇨ No mod dependancy";
    contentRow2Left.appendChild(modDependancy);
} else {
    const modDependancy = document.createElement('p');
    modDependancy.className = "structure-content-value";
    modDependancy.innerText = "⇨ Mod dependancy: "
    // Create a scrollable list of the mods
    let modDependancyList = document.createElement('ul');
    modDependancyList.className = "structure-content-list-2";
    for (let mod of structure_class.mods) {
        let modListItem = document.createElement('li');
        modListItem.innerText = mod;
        modDependancyList.appendChild(modListItem);
    }
    modDependancy.appendChild(modDependancyList);
    contentRow2Left.appendChild(modDependancy);
}

//---------------------------------------------

contentRow2.appendChild(contentRow2Left);

//---------------------------------------------

// Have a brown line to seperate elements
const brownLine1 = document.createElement('p');
brownLine1.className = "brown-line-vert";
contentRow2.appendChild(brownLine1);

//---------------------------------------------

//Left row for info
const contentRow2Right = document.createElement('div');

//---------------------------------------------

// Add the description
const description = document.createElement('p');
description.innerText = structure_class.description;
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

// Preserve Blocks
let preserveBlocks = document.createElement('li');
preserveBlocks.textContent = "Preserve Blocks: " + structure_class.preserveBlocks;
worldGenOptionsList.appendChild(preserveBlocks);

//----------------------
//preventNaturalHostileSpawns
let preventNaturalHostileSpawns = document.createElement('li');
preventNaturalHostileSpawns.textContent = "Prevent Natural Hostile Spawns: " + structure_class.preventNaturalHostileSpawns;
worldGenOptionsList.appendChild(preventNaturalHostileSpawns);

//----------------------
//selectionWeight
let selectionWeight = document.createElement('li');
selectionWeight.textContent = "Selection Weight: " + structure_class.selectionWeight;
worldGenOptionsList.appendChild(selectionWeight);

//----------------------
//clusterValue
let clusterValue = document.createElement('li');
clusterValue.textContent = "Cluster Value: " + structure_class.clusterValue;
worldGenOptionsList.appendChild(clusterValue);

//----------------------
//minDuplicateDistance
let minDuplicateDistance = document.createElement('li');
minDuplicateDistance.textContent = "Min Duplicate Distance: " + structure_class.minDuplicateDistance;
worldGenOptionsList.appendChild(minDuplicateDistance);

//----------------------
//dimensionWhiteList
let dimensionWhiteList = document.createElement('li');
dimensionWhiteList.textContent = "Dimension White List: " + structure_class.dimensionWhiteList;
worldGenOptionsList.appendChild(dimensionWhiteList);

//----------------------
//dimensionList
let dimensionList = document.createElement('li');
dimensionList.textContent = "Dimension List: " + structure_class.dimensionList;
worldGenOptionsList.appendChild(dimensionList);

//----------------------
//biomeGroupList
let biomeGroupList = document.createElement('li');
biomeGroupList.textContent = "Biome Group List: " + structure_class.biomeGroupList;
worldGenOptionsList.appendChild(biomeGroupList);

//----------------------
//biomeWhiteList
let biomeWhiteList = document.createElement('li');
biomeWhiteList.textContent = "Biome White List: " + structure_class.biomeWhiteList;
worldGenOptionsList.appendChild(biomeWhiteList);

//----------------------
//biomeList
let biomeList = document.createElement('li');
biomeList.textContent = "Biome List: ";

worldGenOptionsList.appendChild(biomeList);

let biomeList2 = document.createElement('ul');
biomeList2.className = "structure-content-list";

for (let biome of structure_class.biomeList) {
    let biomeListItem = document.createElement('li');
    biomeListItem.innerText = biome;
    biomeList2.appendChild(biomeListItem);
}
biomeList.appendChild(biomeList2);

//----------------------
//leveling
let leveling = document.createElement('li');
leveling.textContent = "Leveling: " + structure_class.leveling;
worldGenOptionsList.appendChild(leveling);

//----------------------
//fill
let fill = document.createElement('li');
fill.textContent = "Fill: " + structure_class.fill;
worldGenOptionsList.appendChild(fill);

//----------------------
//border
let border = document.createElement('li');
border.textContent = "Border: " + structure_class.border;
worldGenOptionsList.appendChild(border);

//----------------------
//blockSwap
let blockSwap = document.createElement('li');
blockSwap.textContent = "Block Swap: " + structure_class.blockSwap;
worldGenOptionsList.appendChild(blockSwap);

//----------------------
//biomeReplacement
let biomeReplacement = document.createElement('li');
biomeReplacement.textContent = "Biome Replacement: " + structure_class.biomeReplacement;
worldGenOptionsList.appendChild(biomeReplacement);

//----------------------
//minGenerationHeight
let minGenerationHeight = document.createElement('li');
minGenerationHeight.textContent = "Min Generation Height: " + structure_class.minGenerationHeight;
worldGenOptionsList.appendChild(minGenerationHeight);

//----------------------
//maxGenerationHeight
let maxGenerationHeight = document.createElement('li');
maxGenerationHeight.textContent = "Max Generation Height: " + structure_class.maxGenerationHeight;
worldGenOptionsList.appendChild(maxGenerationHeight);

//----------------------

// Assemble the content
structureWorldGenOptions.appendChild(worldGenOptionsList);

//############################################################################################################

// Structure layers, entities, and blocks
const structureLayers = document.createElement('div');
structureLayers.id = "structureLayers";
structureLayers.className = "structure-content";

// Add title
const title3 = document.createElement('h2');
title3.innerText = "Layers, Entities, and Blocks";

structureLayers.appendChild(title3);

//---------------------------------------------
// Create a list of the layers
let layersList = document.createElement('ul');
layersList.className = "structure-content";

for (let layer of structure_class.layers) {
    let layerListItem = document.createElement('li');
    layerListItem.innerText = layer;
    layersList.appendChild(layerListItem);
}

// Assemble the content
structureLayers.appendChild(layersList);

//---------------------------------------------

//Draw a line to seperate elements
const line2 = document.createElement('div');
line2.className = "brown-line";
structureLayers.appendChild(line2);

//---------------------------------------------
// Create a list of the entities
let entitiesList = document.createElement('ul');
entitiesList.className = "structure-content";

for (let entity of structure_class.entities) {
    let entityListItem = document.createElement('li');
    entityListItem.innerText = entity;
    entitiesList.appendChild(entityListItem);
}

// Assemble the content
structureLayers.appendChild(entitiesList);

//---------------------------------------------

//Draw a line to seperate elements
const line3 = document.createElement('div');
line3.className = "brown-line";
structureLayers.appendChild(line3);

//---------------------------------------------
// Create a list of the blocks
let blocksList = document.createElement('ul');
blocksList.className = "structure-content";

for (let block of structure_class.rules) {
    let blockListItem = document.createElement('li');
    blockListItem.innerText = block;
    blocksList.appendChild(blockListItem);
}

// Assemble the content
structureLayers.appendChild(blocksList);

//############################################################################################################

// Add a download button
const downloadButton = document.createElement('button');
downloadButton.className = "structure-download-button";
downloadButton.innerText = "Download AWS File";
downloadButton.onclick = () => {

    // Create a link element
    const link = document.createElement('a');

    // Set the link's href to the structure path
    link.setAttribute('href', structure_class.file);

    // Set the link's download attribute to the structure name
    link.setAttribute('download', structure_class.name);

    // Append the link to the document body
    document.body.appendChild(link);

    // Trigger the link's click event
    link.click();

    // Remove the link from the document body
    document.body.removeChild(link);
}

//############################################################################################################

// Add the content to the structure div
structure_div.appendChild(structureGeneral);
structure_div.appendChild(structureWorldGenOptions);
structure_div.appendChild(structureLayers);
structure_div.appendChild(downloadButton);

//############################################################################################################
