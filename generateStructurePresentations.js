import { fillStructureList, getStructureList, getTownList, sortStructureList} from "./fillStructures.module.js";
import { Structure } from "./structure.js";

// Get the main container from the HTML
const mainContainer = document.getElementById('structureList');

//Get the main search menu
const mainSearchMenu = document.getElementById('mainMenuSearch');

// Create the search menu
async function createSearchMenu() {
    // Create the search menu
    const searchMenu = document.createElement('div');
    searchMenu.className = 'search-menu';
    mainSearchMenu.appendChild(searchMenu);

    // Create the search bar
    const searchBar = document.createElement('input');
    searchBar.className = 'search-bar';
    searchBar.id = 'searchBar';
    searchBar.type = 'text';
    searchBar.placeholder = 'Search...';
    searchMenu.appendChild(searchBar);

    // Create a DropDown menu for different search options
    const searchOptions = document.createElement('select');
    searchOptions.className = 'search-options';
    searchOptions.id = 'searchOptions';
    searchMenu.appendChild(searchOptions);

    // Create the search options
    const searchOptionName = document.createElement('option');
    searchOptionName.className = 'search-option';
    searchOptionName.innerText = 'Sub String';
    searchOptionName.value = 'subString';
    searchOptions.appendChild(searchOptionName);

    const searchOptionExact = document.createElement('option');
    searchOptionExact.className = 'search-option';
    searchOptionExact.innerText = 'Regex';
    searchOptionExact.value = 'regex';
    searchOptions.appendChild(searchOptionExact);

    // Create a DropDown menu for structure options
    const structureOptions = document.createElement('select');
    structureOptions.className = 'structure-options';
    structureOptions.id = 'structureOptions';
    searchMenu.appendChild(structureOptions);

    // Create the structure options
    const structureOptionAll = document.createElement('option');
    structureOptionAll.className = 'structure-option';
    structureOptionAll.innerText = 'All';
    structureOptionAll.value = 'all';
    structureOptions.appendChild(structureOptionAll);

    const structureOptionStructure = document.createElement('option');
    structureOptionStructure.className = 'structure-option';
    structureOptionStructure.innerText = 'Structure';
    structureOptionStructure.value = 'structure';
    structureOptions.appendChild(structureOptionStructure);

    const structureOptionTown = document.createElement('option');
    structureOptionTown.className = 'structure-option';
    structureOptionTown.innerText = 'Town';
    structureOptionTown.value = 'town';
    structureOptions.appendChild(structureOptionTown);

    const structureOptionSurvival = document.createElement('option');
    structureOptionSurvival.className = 'structure-option';
    structureOptionSurvival.innerText = 'Survival';
    structureOptionSurvival.value = 'survival';
    structureOptions.appendChild(structureOptionSurvival);

    const structureOptionWorldGen = document.createElement('option');
    structureOptionWorldGen.className = 'structure-option';
    structureOptionWorldGen.innerText = 'World Gen';
    structureOptionWorldGen.value = 'worldGen';
    structureOptions.appendChild(structureOptionWorldGen);

    const structureOptionTownContent = document.createElement('option');
    structureOptionTownContent.className = 'structure-option';
    structureOptionTownContent.innerText = 'Town Content';
    structureOptionTownContent.value = 'townContent';
    structureOptions.appendChild(structureOptionTownContent);

    const structureOptionBroken = document.createElement('option');
    structureOptionBroken.className = 'structure-option';
    structureOptionBroken.innerText = 'Broken';
    structureOptionBroken.value = 'broken';
    structureOptions.appendChild(structureOptionBroken);

    // Add the "Apply Filters" button (it should open a "warning, may take a while" popup)
    const applyFiltersButton = document.createElement('button');
    applyFiltersButton.className = 'apply-filters-button';
    applyFiltersButton.innerText = 'Apply Filters';
    applyFiltersButton.onclick = async () => {
        // Call the handleFilterSearch function
        await handleFilterSearch();
    };

    // Create the search button
    const searchButton = document.createElement('button');
    searchButton.className = 'search-button';
    searchButton.innerText = 'Search';
    searchButton.onclick = () => {
        handleCustomSearch();
        handleFilterSearch();
    };
    searchMenu.appendChild(searchButton);

    // If the user presses enter in the search bar, trigger the search button's click event
    searchBar.addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            searchButton.click();
        }
    });
}

// Create the load structures function
async function loadStructures() {
    //await fillStructureList then call createStructureContainer for each structure
    await fillStructureList().then(() => {
        console.log('Structure list:', getStructureList());
        console.log('Town list:', getTownList());

        sortStructureList();
        
        getStructureList().forEach(structure => {
            createStructureContainer(structure);
        });
        getTownList().forEach(town => {
            createStructureContainer(town);
        });
    });
}

// Call the createSearchMenu function
await createSearchMenu();
// Call the loadStructures function
await loadStructures();

// Function to handle custom search logic
function handleCustomSearch() {
    // Get the search bar from the HTML
    const searchBar = document.getElementById('searchBar');
    // Get the search options from the HTML
    const searchOptions = document.getElementById('searchOptions');

    // Get the search term from the search bar
    const searchTerm = searchBar.value.toLowerCase();

    // Clear the existing structures
    mainContainer.innerHTML = '';

    // Filter structures based on the search term
    const filteredStructures = getStructureList().filter(structure => {
        if (searchOptions.value === 'subString') {
            return structure.name.toLowerCase().includes(searchTerm);
        } else if (searchOptions.value === 'regex') {
            return structure.name.toLowerCase().match(searchTerm);
        }
    });
    const filteredTowns = getTownList().filter(town => {
        if (searchOptions.value === 'subString') {
            return town.name.toLowerCase().includes(searchTerm);
        } else if (searchOptions.value === 'regex') {
            return town.name.toLowerCase().match(searchTerm);
        }
    });

    // Loop through each filtered structure
    filteredStructures.forEach(structure => {
        createStructureContainer(structure);
    });
    filteredTowns.forEach(town => {
        createStructureContainer(town);
    });
}

// Function to handle filter search logic
async function handleFilterSearch() {
    return new Promise(async (resolve, reject) => {
        // Get the search bar from the HTML
        const searchBar = document.getElementById('searchBar');
        // Get the search options from the HTML
        const searchOptions = document.getElementById('searchOptions');
        // Get the structure options from the HTML
        const structureOptions = document.getElementById('structureOptions');

        // Get the search term from the search bar
        const searchTerm = searchBar.value.toLowerCase();

        // Clear the existing structures
        mainContainer.innerHTML = '';

        // Filter structures based on the search term
        const filteredStructures = getStructureList().filter(structure => {
            if (searchOptions.value === 'subString') {
                return structure.name.toLowerCase().includes(searchTerm);
            } else if (searchOptions.value === 'regex') {
                return structure.name.toLowerCase().match(searchTerm);
            }
        });

        const filteredTowns = getTownList().filter(town => {
            if (searchOptions.value === 'subString') {
                return town.name.toLowerCase().includes(searchTerm);
            } else if (searchOptions.value === 'regex') {
                return town.name.toLowerCase().match(searchTerm);
            }
        });

        async function processStructure(structure) {
            if (structureOptions.value === 'all') {
                createStructureContainer(structure);
            } else if (structureOptions.value === 'structure' && structure.name.endsWith('.aws')) {
                createStructureContainer(structure);
            } else if (structureOptions.value === 'town' && structure.name.endsWith('.awt')) {
                createStructureContainer(structure);
            } else if (structureOptions.value === 'survival') {
                //alert('This may take a while to load. Please be patient.');
                // Load survival structures
                let survivalStructure = new Structure(structure.path);
                try {
                    await survivalStructure.load();

                    if (survivalStructure.survival) {
                        createStructureContainer(structure);
                    }
                    console.log("Loaded survival structure: ", survivalStructure);

                } catch (error) {
                    console.error("Error loading survival structure:", error);
                }
            } else if (structureOptions.value === 'worldGen') {
                //alert('This may take a while to load. Please be patient.');
                // Load world gen structures
                let worldGenStructures = new Structure(structure.path);
                try {
                    await worldGenStructures.load();

                    if (worldGenStructures.worldGenEnabled) {
                        createStructureContainer(structure);
                    }
                    console.log("Loaded world gen structure: ", worldGenStructures);
                }
                catch (error) {
                    console.error("Error loading world gen structure:", error);
                }
            } else if (structureOptions.value === 'broken') {
                //alert('This may take a while to load. Please be patient.');
                // Load broken structures
                let brokenStructures = new Structure(structure.path);
                try {
                    await brokenStructures.load();

                    let broken = false;

                    // if NoggTownGenGuardTowerSmall in structure name
                    if (structure.name.includes("NoggTownGenGuardTowerSmall")) {
                        console.log("NoggTownGenGuardTowerSmall");

                        console.log("Survival: ", brokenStructures.survival);
                        console.log("World Gen: ", brokenStructures.worldGenEnabled);
                        console.log("Biome Whitelist: ", brokenStructures.biomeWhiteList);
                        console.log("Biome List: ", brokenStructures.biomeList);
                        console.log("Dimension Whitelist: ", brokenStructures.dimensionWhiteList);
                        console.log("Dimension List: ", brokenStructures.dimensionList);
                        console.log("Town Count: ", brokenStructures.townCount);
                    }

                    // if EmpireCityGen2MarketStalls in structure name
                    if (structure.name.includes("EmpireCityGen2MarketStalls")) {
                        console.log("EmpireCityGen2MarketStalls");

                        console.log("Survival: ", brokenStructures.survival);
                        console.log("World Gen: ", brokenStructures.worldGenEnabled);
                        console.log("Biome Whitelist: ", brokenStructures.biomeWhiteList);
                        console.log("Biome List: ", brokenStructures.biomeList);
                        console.log("Dimension Whitelist: ", brokenStructures.dimensionWhiteList);
                        console.log("Dimension List: ", brokenStructures.dimensionList);
                        console.log("Town Count: ", brokenStructures.townCount);
                    }

                    if ( !brokenStructures.survival && brokenStructures.townCount == 0) {
                        // if world gen is disabled, survival is disabled, and the structure is not in any towns:
                        if (!brokenStructures.worldGenEnabled) {
                            broken = true;
                        }
                        // if biome whitelist and list is empty
                        if (brokenStructures.biomeWhiteList && brokenStructures.biomeList.length === 0) {
                            broken = true;
                        }
                        // if dimension whitelist and list is empty
                        if (brokenStructures.dimensionWhiteList && brokenStructures.dimensionWhiteList === "") {
                            broken = true;
                        }
                    }

                    if (broken) {
                            createStructureContainer(structure);
                        }
                } catch (error) {
                    console.error("Error loading broken structure:", error);
                }
            }
        }

        // Process each filtered structure asynchronously
        for (const structure of filteredStructures) {
            await processStructure(structure);
        }

        for (const town of filteredTowns) {
            await processStructure(town);
        }

        resolve();
    });
}

// Function to create a structure container
function createStructureContainer(structure) {
    // Create a container for each structure
    const structureContainer = document.createElement('div');
    structureContainer.className = 'structure-container';

    // Add structure name
    const structureName = document.createElement('h3');
    structureName.innerText = structure.name;
    structureContainer.appendChild(structureName);

    // Add download button
    const downloadButton = document.createElement('button');
    downloadButton.innerText = 'Download AWS File';
    downloadButton.onclick = () => {

        // Create a link element
        const link = document.createElement('a');

        // Set the link's href to the structure path
        link.setAttribute('href', structure.path);

        // Set the link's download attribute to the structure name
        link.setAttribute('download', structure.name);

        // Append the link to the document body
        document.body.appendChild(link);

        // Trigger the link's click event
        link.click();

        // Remove the link from the document body
        document.body.removeChild(link);

    };
    structureContainer.appendChild(downloadButton);

    // Add open detail page button
    const openDetailButton = document.createElement('button');
    openDetailButton.innerText = 'Open Detail Page';
    openDetailButton.onclick = () => {
        if (structure.name.endsWith('.aws')) {
            // Handle opening detail page logic here
            window.location.href = 'structure_page.html?file=' + encodeURIComponent(structure.path);
        } else if (structure.name.endsWith('.awt')) {
            // Handle opening detail page logic here
            window.location.href = 'town_page.html?file=' + encodeURIComponent(structure.path);
        }
    };
    structureContainer.appendChild(openDetailButton);

    // Append the structure container to the main container
    mainContainer.appendChild(structureContainer);
}

// Structures Aside menu
// Get the aside menu from the HTML
const asideMenuStructure = document.getElementById('asideMenuStructure');

// Create the aside menu
const asideMenuStructureList = document.createElement('ul');
asideMenuStructureList.className = 'aside-menu-list';
asideMenuStructure.appendChild(asideMenuStructureList);

// Create the aside menu items (buttons)
const asideMenuStructureHome = document.createElement('li');
asideMenuStructureHome.className = 'aside-menu-item';
asideMenuStructureList.appendChild(asideMenuStructureHome);

const asideMenuStructureHomeButton = document.createElement('a');
asideMenuStructureHomeButton.className = 'aside-menu-button';
asideMenuStructureHomeButton.innerText = 'Home';
asideMenuStructureHomeButton.href = 'index.html';
asideMenuStructureHome.appendChild(asideMenuStructureHomeButton);

const asideMenuStructureStructures = document.createElement('li');
asideMenuStructureStructures.className = 'aside-menu-item';
asideMenuStructureList.appendChild(asideMenuStructureStructures);

const asideMenuStructureStructuresButton = document.createElement('a');
asideMenuStructureStructuresButton.className = 'aside-menu-button';
asideMenuStructureStructuresButton.innerText = 'Structures';
asideMenuStructureStructuresButton.href = 'index.html#structureList';
asideMenuStructureStructures.appendChild(asideMenuStructureStructuresButton);

const asideMenuStructureSearch = document.createElement('li');
asideMenuStructureSearch.className = 'aside-menu-item';
asideMenuStructureList.appendChild(asideMenuStructureSearch);

const asideMenuStructureSearchButton = document.createElement('a');
asideMenuStructureSearchButton.className = 'aside-menu-button';
asideMenuStructureSearchButton.innerText = 'Search';
asideMenuStructureSearchButton.href = 'index.html#searchBar';
asideMenuStructureSearch.appendChild(asideMenuStructureSearchButton);

// Add the aside menu to the HTML
//asideMenuStructure.appendChild(asideMenuStructureList);
