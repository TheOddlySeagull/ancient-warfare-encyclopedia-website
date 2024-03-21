// JSON data
const filterData = {
    "filter_groups": [
      { // Structure Category
        "group_name": "Structure Category",
        "filter_subgroups": [
          {
            "subgroup_name": "Category",
            "filters": {
              "Structure": true,
              "Town": true
            }
          }
        ]
      },
      { // Structure Generation
        "group_name": "Structure Generation",
        "filter_subgroups": [
          {
            "subgroup_name": "Generated",
            "filters": {
              "World Gen": true,
              "Survival Build": true
            }
          }
        ]
      },
      { // Structure Type
        "group_name": "Structure Type",
        "filter_subgroups": [
          {
            "subgroup_name": "Type",
            "filters": {
                "Ground": true,
                "Underground": true,
                "Sky": true,
                "Water": true,
                "Lava": true,
                "Underwater": true,
                "Island": true,
                "Harbor": true
            }
          }
        ]
      },
      { // Structure Size
        "group_name": "Structure Size",
        "filter_subgroups": [
          {
            "subgroup_name": "Size",
            "filters": {
              "Small": true,
              "Medium": true,
              "Large": true,
              "Huge": true,
              "Gigantic": true
            }
          }
        ]
      },
      { // Structure Rarity
        "group_name": "Structure Rarity",
        "filter_subgroups": [
          {
            "subgroup_name": "Rarity",
            "filters": {
                "Widespread": true,
                "Common": true,
                "Uncommon": true,
                "Rare": true,
                "Legendary": true,
                "Unique": true,
                "Irrevelevant": true
            }
          }
        ]
      },
      { // Structure Biome
        "group_name": "Structure Biome",
        "filter_subgroups": [
            {
                "subgroup_name": "Biome Type",
                "filters": {
                    "Desert": true,
                    "Forest": true,
                    "Jungle": true,
                    "Mountain": true,
                    "Plains": true,
                    "Snow": true,
                    "Swamp": true,
                    "Tundra": true,
                    "None": true
                }
            }
        ]
      },
      { // Structure Dimension
        "group_name": "Structure Dimension",
        "filter_subgroups": [
            {
                "subgroup_name": "Dimension",
                "filters": {
                    "Overworld": true,
                    "Nether": true,
                    "End": true,
                    "None": true
                }
            }
        ]
      },
      { // Structure Civilization
        "group_name": "Structure Civilization",
        "filter_subgroups": [
            { // Nations
                "subgroup_name": "Nation",
                "filters": {
                    "Empire": true,
                    "Empire Witchbane": true,
                    "Empire Crusaders": true,
                    "Norska": true,
                    "Sarkonid": true,
                    "Xoltec": true,
                    "Nogg": true,
                    "Guild": true,
                    "Shakayana": true,
                    "Reiksgard": true,
                    "Zamurai": true
                }
            },
            { // Tribal
                "subgroup_name": "Tribal",
                "filters": {
                    "Amazon": true,
                    "Barbarian": true,
                    "Brigand": true,
                    "Buffloka": true,
                    "Kong": true,
                    "Pirate": true,
                    "Smingol": true,
                    "Sealsker": true,
                    "Vyncan": true,
                    "Zimba": true
                }
            },
            { // Non-Human
                "subgroup_name": "Non-Human",
                "filters": {
                    "Elf": true,
                    "Dwarf": true,
                    "Hobbit": true,
                    "Ent": true,
                    "Gnome": true,
                    "Orc": true,
                    "Lizardmen": true
                }
            },
            { // Monsters
                "subgroup_name": "Monsters",
                "filters": {
                    "Beast": true,
                    "Gremlin": true,
                    "Giant": true,
                    "Minossian": true,
                    "Monster": true,
                    "Klown": true,
                    "Rakshasa": true,
                    "Mindflayers": true
                }
            },
            { // Undead
                "subgroup_name": "Undead",
                "filters": {
                    "Icelord": true,
                    "Ishtari": true,
                    "Undead": true,
                    "Vampire": true
                }
            },
            { // Powers
                "subgroup_name": "Powers",
                "filters": {
                    "Coven": true,
                    "Demon": true,
                    "Guardians": true,
                    "Malice": true,
                    "Wizardly": true
                }
            },
            { // Other
                "subgroup_name": "Other",
                "filters": {
                    "No Territory": true,
                }
            }
        ]
      }
    ]
};
// keyword JSON data
const keywordData = {
    "keywords": {
        // Boat
        "boat": ["-island", "-worship", "-airship", "-towngen", "sloop", "schooner", "galleon", "brigantine", "dinghy", "rowboat", "longship", "caravel", "carrack", "ship", "boat", "leviathan", "manofwar"],
        // Noble 
        "noble": ["-parking", "-icelord", "-citywall", "-sinking", "lord", "emperor", "king", "queen", "prince", "princess", "duke", "baron", "count", "earl", "viscount", "viscountess", "noble", "nobility"],
    }
};

// Get the filter menu
const filterDiv = document.getElementById("filter-menu");
// Get the structure list element
const structureList = document.getElementById("structure-list");
// Get the search bar element
const searchBarElement = document.getElementById("search-bar-div");
// Get the structure per page element
const pageSizeConfigurator = document.getElementById("page-size-configurator");

// pagination variables
let structure_index = 0; // index of first structure to display
let structure_per_page = 20; // number of structures to display per page

// Create filter groups
function createFilterGroups() {
    // Create a "clear filters" button
    let clearFiltersButton = document.createElement("button");
    clearFiltersButton.id = "clear-filters-button";
    clearFiltersButton.innerHTML = "Clear Filters";
    filterDiv.appendChild(clearFiltersButton);

    // Create an "apply filters" button
    let applyFiltersButton = document.createElement("button");
    applyFiltersButton.id = "apply-filters-button";
    applyFiltersButton.innerHTML = "Select all Filters";
    filterDiv.appendChild(applyFiltersButton);
    
  for (let i = 0; i < filterData.filter_groups.length; i++) {
      let filterGroup = filterData.filter_groups[i];
      let filterGroupDiv = document.createElement("div");
      filterGroupDiv.classList.add("filter-group");
      filterGroupDiv.innerHTML = `<h3>${filterGroup.group_name}</h3>`;
      // Create filter subgroups
      for (let j = 0; j < filterGroup.filter_subgroups.length; j++) {
          let filterSubgroup = filterGroup.filter_subgroups[j];
          let filterSubgroupDiv = document.createElement("div");
          filterSubgroupDiv.classList.add("filter-subgroup");
          filterSubgroupDiv.innerHTML = `<h4>${filterSubgroup.subgroup_name}</h4>`;
          // Create filters
          for (let filter in filterSubgroup.filters) {
              let filterLabel = document.createElement("label");
              let filterCheckbox = document.createElement("input");
              filterCheckbox.type = "checkbox";
              filterCheckbox.classList.add("filter-checkbox");
              filterCheckbox.value = filter;
              filterCheckbox.checked = filterSubgroup.filters[filter];
              filterLabel.appendChild(filterCheckbox);
              filterLabel.appendChild(document.createTextNode(filter));
              filterSubgroupDiv.appendChild(filterLabel);
          }
          filterGroupDiv.appendChild(filterSubgroupDiv);
      }

      // At the end of each filter group, add a button to clear all filters
      let clearFiltersButton = document.createElement("button");
      clearFiltersButton.classList.add("filters-button");
      clearFiltersButton.innerHTML = "Select None";
      clearFiltersButton.addEventListener("click", function() {
          let filterCheckboxes = filterGroupDiv.getElementsByClassName("filter-checkbox");
          for (let i = 0; i < filterCheckboxes.length; i++) {
              filterCheckboxes[i].checked = false;
          }
      });
      filterGroupDiv.appendChild(clearFiltersButton);

      // At the end of each filter group, add a button to apply all filters
      let applyFiltersButton = document.createElement("button");
      applyFiltersButton.classList.add("filters-button");
      applyFiltersButton.innerHTML = "Select All";
      applyFiltersButton.addEventListener("click", function() {
          let filterCheckboxes = filterGroupDiv.getElementsByClassName("filter-checkbox");
          for (let i = 0; i < filterCheckboxes.length; i++) {
              filterCheckboxes[i].checked = true;
          }
      });
      filterGroupDiv.appendChild(applyFiltersButton);


      filterDiv.appendChild(filterGroupDiv);
  }
}

// Function that returns the saved data called structure_list
function getSavedData() {
    console.log("Loading data from local storage...");
    // If the structure list or disclamer is not in local storage, create it from the structures.JSON file
    if (localStorage.getItem("structure_list") === null || localStorage.getItem("disclamer") === null ) {
        console.log("Creating structure list and data from structures.json...");

        // test if user is under safari
        let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (isSafari) {
            // Let the user know that the browser is not supported by a pop-up message
            let error_div = document.createElement("div");
            error_div.classList.add("error");
            error_div.innerHTML = "<h1>Error</h1>";
            error_div.innerHTML += "<p>Your browser is not supported. Please use a different browser.</p>";

            structureList.appendChild(error_div);
            return;

        }

        // Add a loading message to let the user know the disclamer version is being fetched
        let disclamer_div = document.createElement("div");
        disclamer_div.classList.add("disclamer");
        disclamer_div.innerHTML = "<h1>Loading...</h1>";
        disclamer_div.innerHTML += "<p>This may take a few seconds...</p>";
        disclamer_div.innerHTML += "<p>Currenly fetching data from structures.json...</p>";

        // Replace the structure list with the loading message
        structureList.innerHTML = "";
        structureList.appendChild(disclamer_div);


        // Fetch the structures.json file
        fetch('structures.json')
            .then(response => response.json())
            .then(data => {
                console.log(data);

                // As "disclamer", save the data[0] to local storage
                localStorage.setItem("disclamer", JSON.stringify(data['disclamer']));

                // As "structure_list", save the data[1] to local storage (try)
                localStorage.setItem("structure_list", JSON.stringify(data['data']));

                // reload the page
                location.reload();

                // Check if data was saved to local storage
                if (localStorage.getItem("structure_list") === null || localStorage.getItem("disclamer") === null ) {
                    console.log("Error saving data to local storage");
                    // Let the user know the error by a pop-up message
                    let error_div = document.createElement("div");
                    error_div.classList.add("error");
                    error_div.innerHTML = "<h1>Error</h1>";
                    error_div.innerHTML += "<p>There was an error saving the data to local storage. Please try again later.</p>";
                    error_div.innerHTML += "<p>If the problem persists, please contact the server administrator.</p>";
                    structureList.appendChild(error_div);
                }
            });

    } else {

        // Read the disclamer from local storage
        let disclamer = JSON.parse(localStorage.getItem("disclamer"));
        console.log(disclamer['disclamer']);
        console.log("Data date: " + disclamer['date']);
        console.log("Data version: " + disclamer['version']);

        console.log("Checking for new version of structures.json...");

        // Open structures_version.json and compare the version with the one in local storage
        fetch('structures_version.json')
            .then(response => response.json())
            .then(data => {
                console.log(data);

                // If the version is different, fetch the structures.json file
                if (data['version'] != disclamer['version']) {
                    console.log("New version of structures.json detected. Fetching new data...");

                    // Let the user know that the data is being fetched, with a loading message
                    let disclamer_div = document.createElement("div");
                    disclamer_div.classList.add("disclamer");
                    disclamer_div.innerHTML = "<h1>Loading...</h1>";
                    disclamer_div.innerHTML += "<p>This may take a few seconds...</p>";
                    disclamer_div.innerHTML += "<p>Currenly fetching data: User has version " + disclamer['version'] + " and the latest version is " + data['version'] + "...</p>";

                    // Replace the structure list with the loading message
                    structureList.innerHTML = "";
                    structureList.appendChild(disclamer_div);

                    



                    // Fetch the structures.json file
                    fetch('structures.json')
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);

                            // As "disclamer", save the data[0] to local storage
                            localStorage.setItem("disclamer", JSON.stringify(data['disclamer']));

                            // As "structure_list", save the data[1] to local storage
                            localStorage.setItem("structure_list", JSON.stringify(data['data']));

                            // reload the page
                            location.reload();
                        });

                    console.log("You have the latest version of structures.json");
                } else {
                    console.log("No new version of structures.json detected. Using local data...");
                }
            });
    }
    let structure_list = JSON.parse(localStorage.getItem("structure_list"));
    //Alphabetize the data. The data is a dictionary, so we need to convert it to a list, sort it on the "name", and then convert it back to a dictionary
    let structure_list_list = [];
    for (let key in structure_list) {
        structure_list_list.push(structure_list[key]);
    }
    structure_list_list.sort((a, b) => (a.name > b.name) ? 1 : -1);
    let sorted_structure_list = {};
    for (let i = 0; i < structure_list_list.length; i++) {
        sorted_structure_list[structure_list_list[i].name] = structure_list_list[i];
    }
    return sorted_structure_list;
}

// Function to create a mini menu to show a random structure
function createRandomStructureMenu() {
    // Create a random structure mini menu (an image and the structure name)
    let randomStructureMenu = document.createElement("div");
    randomStructureMenu.classList.add("random-structure-menu");
    randomStructureMenu.innerHTML = `<h3>Random Structure</h3>`;
    //Get a random index
    let randomIndex = Math.floor(Math.random() * Object.keys(structure_list).length);
    let randomStructure = structure_list[Object.keys(structure_list)[randomIndex]];
    // Create the structure div
    let randomStructureDiv = document.createElement("div");
    randomStructureDiv.classList.add("random-structure-div");
    // Create the structure image
    let randomStructureImage = document.createElement("img");
    randomStructureImage.src = randomStructure.icon;
    // Create the structure name
    let randomStructureName = document.createElement("p");
    //Get the name, replace _ by space
    let name = randomStructure.name.replace(/_/g, " ");
    // Add spaces in front of caps
    name = name.replace(/([A-Z])/g, ' $1').trim();
    //Replace "S B " by "Survival Build "
    name = name.replace("S B ", "Survival Build ");
    name = name.replace("R U S T I C", "Rustic");
    name = name.replace("Q U A R K", "Quark ");
    name = name.replace(" Col ", " Collection ");
    randomStructureName.innerHTML = name;
    // Add a view button
    let viewButton = document.createElement("button");
    viewButton.innerHTML = "View";
    viewButton.addEventListener("click", function() {
        window.location.href = 'structure_page.html?structureName=' + randomStructure.pack + '/' + randomStructure.name;
    }
    );
    randomStructureDiv.appendChild(viewButton);
    // Append the structure div to the random structure menu
    randomStructureDiv.appendChild(randomStructureImage);
    randomStructureDiv.appendChild(randomStructureName);
    randomStructureMenu.appendChild(randomStructureDiv);
    // Append the random structure menu to the filter div
    pageSizeConfigurator.appendChild(randomStructureMenu);
}

// Function to create a mini menu to let the user choose how many structures to display per page
function createStructurePerPageMenu() {
    // Create the menu
    let structurePerPageMenu = document.createElement("div");
    structurePerPageMenu.classList.add("structure-per-page-menu");
    structurePerPageMenu.innerHTML = `<h3>Structures Per Page</h3>`;
    // Create the options
    let structurePerPageOptions = [2, 5, 10, 20, 50, 100];
    for (let i = 0; i < structurePerPageOptions.length; i++) {
        let structurePerPageOption = document.createElement("button");
        structurePerPageOption.classList.add("structure-per-page-option");
        structurePerPageOption.innerHTML = structurePerPageOptions[i];
        structurePerPageOption.addEventListener("click", function() {
            structure_per_page = structurePerPageOptions[i];
            structure_index = 0;
            structureList.innerHTML = "";
            createStructureDivs(structure_list, structure_index);
            createPaginationButtons(structure_list);
        });
        structurePerPageMenu.appendChild(structurePerPageOption);
    }
    // Append the menu to the filter div
    pageSizeConfigurator.appendChild(structurePerPageMenu);
}

// Function that create a single structure presentation
function createStructureDiv(structure) {

    // Container blueprint:
    /*

    <div class="structure-container">
        <div class="container-main-info">
            <img src="path/to/icon.png" alt="Structure Icon">
            <div class="container-info-grid">
                <div class="container-structure-name">
                    <h3>Structure Name | Pack</h3>
                </div>
                <div class="container-structure-author">
                    <p>by Structure Author</p>
                </div>
                <div class="container-structure-nation-category-generation">
                    <p>Territory: Nation Name</p>
                    <p>Category: Structure</p>
                    <p>Survival Build</p>
                </div>
            </div>
        </div>
        <div class="container-button-panel">
            <button>Download</button>
            <button>Open Detail Page</button>
        </div>
        <div class="container-extra-info">
            <p>Size: size</p>
            <p>Rarity: rarity</p>
        </div>
    </div>

    */



    // Create a container for each structure
    const structureContainer = document.createElement('div');
    structureContainer.id = 'structure-container';
    structureContainer.className = 'structure-container';

    // Create the "Main Info" div
    const mainInfoDiv = document.createElement('div');
    mainInfoDiv.id = 'container-main-info';
    mainInfoDiv.className = 'container-main-info';

    // In the main info div, add the icon (image)
    const icon = document.createElement('img');
    icon.src = structure.icon;
    icon.alt = 'Structure Icon';

    // In the main info div, add the info grid div
    const infoGridDiv = document.createElement('div');
    infoGridDiv.id = 'container-info-grid';
    infoGridDiv.className = 'container-info-grid';

    // In the info grid div, add the structure name div
    const structureNameDiv = document.createElement('div');
    structureNameDiv.id = 'container-structure-name';
    structureNameDiv.className = 'container-structure-name';
    const structureName = document.createElement('h3');
    structureName.innerText = structure.name + " | " + structure.pack;

    // In the info grid div, add the structure author div
    const structureAuthorDiv = document.createElement('div');
    structureAuthorDiv.id = 'container-structure-author';
    structureAuthorDiv.className = 'container-structure-author';
    const structureAuthor = document.createElement('p');
    if (structure.validation.structureAuthor === "" || structure.validation.structureAuthor === undefined) {
        structureAuthor.innerText = `Unknown Author`;
    } else {
        structureAuthor.innerText = `by : ${structure.validation.structureAuthor}`;
    }

    // In the info grid div, add the structure nation, category, generation if they exist
    const structureNationCategoryGenerationDiv = document.createElement('div');
    structureNationCategoryGenerationDiv.id = 'container-structure-nation-category-generation';
    structureNationCategoryGenerationDiv.className = 'container-structure-nation-category-generation';
    const structureNation = document.createElement('p');
    if (structure.validation.territoryName !== "") {
        structureNation.innerText = `Territory : ${structure.validation.territoryName}`;
    } else {
        structureNation.innerText = `No Territory`;
    }
    structureNationCategoryGenerationDiv.appendChild(structureNation);
    const structureCategory = document.createElement('p');
    structureCategory.innerText = `Category : Structure`;
    structureNationCategoryGenerationDiv.appendChild(structureCategory);
    const structureGeneration = document.createElement('p');
    if (structure.validation.survival) {
        structureGeneration.innerText = `Generation : Survival Build`;
    } else {
        structureGeneration.innerText = `Generation : World Gen`;
    }
    structureNationCategoryGenerationDiv.appendChild(structureGeneration);

    // In the main info div, add the download and open detail page buttons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.id = 'container-button-panel';
    buttonsDiv.className = 'container-button-panel';
    const downloadButton = document.createElement('button');
    downloadButton.innerText = 'Download';
    downloadButton.onclick = () => {
        // Create a link to the file
        const link = document.createElement('a');
        link.setAttribute('href', structure.path);
        link.setAttribute('download', structure.name + '.aws');
        link.click();
    };
    const openDetailButton = document.createElement('button');
    openDetailButton.innerText = 'Open Detail Page';
    openDetailButton.onclick = () => {
        if (structure.path.endsWith('.aws')) {
            // Handle opening detail page logic here
            window.location.href = 'structure_page.html?structureName=' + structure.pack + '/' + structure.name;
        }
    };

    // Create the "Extra Info" div
    const extraInfoDiv = document.createElement('div');
    extraInfoDiv.id = 'container-extra-info';
    extraInfoDiv.className = 'container-extra-info';
    const size = document.createElement('p');
    size.innerText = `Size: ${structure.size}`;
    const rarity = document.createElement('p');
    rarity.innerText = `Rarity: ${structure.rarity}`;
    extraInfoDiv.appendChild(size);
    extraInfoDiv.appendChild(rarity);

    // Assemble the Info Grid Div
    structureNameDiv.appendChild(structureName);
    structureAuthorDiv.appendChild(structureAuthor);
    infoGridDiv.appendChild(structureNameDiv);
    infoGridDiv.appendChild(structureAuthorDiv);
    infoGridDiv.appendChild(structureNationCategoryGenerationDiv);
    mainInfoDiv.appendChild(icon);
    mainInfoDiv.appendChild(infoGridDiv);
    structureContainer.appendChild(mainInfoDiv);
    
    // Assemble the Buttons Div
    buttonsDiv.appendChild(downloadButton);
    buttonsDiv.appendChild(openDetailButton);
    structureContainer.appendChild(buttonsDiv);

    // Assemble the Extra Info Div
    structureContainer.appendChild(extraInfoDiv);

    // Append the structure container to the structure list
    structureList.appendChild(structureContainer);
}


// Function to get all the filter checkboxes
function getFilterCheckboxes() {
    let filterCheckboxes = document.getElementsByClassName("filter-checkbox");
    return filterCheckboxes;
}

// Function to test if a structure passes the filters
function passesFilters(structure, filterCheckboxes) {
    // Get the filter groups
    let filterGroups = filterData.filter_groups;

    // For each filter group
    for (let i = 0; i < filterGroups.length; i++) {
        let filterGroup = filterGroups[i];
        let filterSubgroups = filterGroup.filter_subgroups;

        // For each filter subgroup
        for (let j = 0; j < filterSubgroups.length; j++) {
            let filterSubgroup = filterSubgroups[j];
            let filters = filterSubgroup.filters;

            // For each filter
            for (let filter in filters) {
                // If the filter is checked
                if (filters[filter]) {
                    // If the structure does not pass the filter
                    if (!structure.validation[filter]) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}



// Function that creates divs for the structures of the list from index x, to y index later (within the range of the list)
function createStructureDivs(structure_list, first_structure_index) {
    // Create a structure div for each structure in the list
    for (let i = first_structure_index; i < first_structure_index + structure_per_page; i++) {
      // If the index is out of range, break out of the loop
      if (i >= Object.keys(structure_list).length) {
        break;
      } else {
        // Create a structure div
        createStructureDiv(structure_list[Object.keys(structure_list)[i]]);
      }
    }
}

// Function to create the pagination buttons
function createPaginationButtons(structure_list) {

  // Remove all pagination buttons
  let paginationButtons = document.getElementsByClassName("pagination-button");
  while (paginationButtons.length > 0) {
      paginationButtons[0].parentNode.removeChild(paginationButtons[0]);
  }

  // Create the pagination buttons
  let num_pages = Math.ceil(Object.keys(structure_list).length / structure_per_page);

  // Get the current page
  let current_page = Math.floor(structure_index / structure_per_page);

  // Get the start and end page
  let start_page = Math.max(current_page - 2, 0);
  let end_page = Math.min(start_page + 5, num_pages);

  // Create the first page button
  if (start_page > 0) {
    let firstPageButton = document.createElement("button");
    firstPageButton.classList.add("pagination-button");
    firstPageButton.innerHTML = "◀◀";
    firstPageButton.addEventListener("click", function() {
        structure_index = 0;
        structureList.innerHTML = "";
        createStructureDivs(structure_list, structure_index);
        createPaginationButtons(structure_list);
    });
    structureList.appendChild(firstPageButton);
  } else {
    // Create a disabled first page button
    let firstPageButton = document.createElement("button");
    firstPageButton.classList.add("pagination-button");
    firstPageButton.innerHTML = "◀◀";
    firstPageButton.disabled = true;
    structureList.appendChild(firstPageButton);
  }

  // Create the previous page button
  if (current_page > 0) {
      let previousPageButton = document.createElement("button");
      previousPageButton.classList.add("pagination-button");
      previousPageButton.innerHTML = "◀";
      previousPageButton.addEventListener("click", function() {
          structure_index -= structure_per_page;
          structureList.innerHTML = "";
          createStructureDivs(structure_list, structure_index);
          createPaginationButtons(structure_list);
      });
      structureList.appendChild(previousPageButton);
  } else {
      // Create a disabled previous page button
      let previousPageButton = document.createElement("button");
      previousPageButton.classList.add("pagination-button");
      previousPageButton.innerHTML = "◀";
      previousPageButton.disabled = true;
      structureList.appendChild(previousPageButton);
  }

  // Create the page buttons between the previous and next page buttons (only show 5 page buttons at a time)
  for (let i = start_page; i < end_page; i++) {
      let pageButton = document.createElement("button");
      pageButton.classList.add("pagination-page-button");
      pageButton.innerHTML = i + 1;
      pageButton.addEventListener("click", function() {
          structure_index = i * structure_per_page;
          structureList.innerHTML = "";
          createStructureDivs(structure_list, structure_index);
          createPaginationButtons(structure_list);
      });
      structureList.appendChild(pageButton);
  }

  // Create the next page button
  if (current_page < num_pages - 1) {
      let nextPageButton = document.createElement("button");
      nextPageButton.classList.add("pagination-button");
      nextPageButton.innerHTML = "▶";
      nextPageButton.addEventListener("click", function() {
          structure_index += structure_per_page;
          structureList.innerHTML = "";
          createStructureDivs(structure_list, structure_index);
          createPaginationButtons(structure_list);
      });
      structureList.appendChild(nextPageButton);
  } else { 
      // Create a disabled next page button
      let nextPageButton = document.createElement("button");
      nextPageButton.classList.add("pagination-button");
      nextPageButton.innerHTML = "▶";
      nextPageButton.disabled = true;
      structureList.appendChild(nextPageButton);
  }

  // Create the last page button
  if (end_page < num_pages) {
      let lastPageButton = document.createElement("button");
      lastPageButton.classList.add("pagination-button");
      lastPageButton.innerHTML = "▶▶";
      lastPageButton.addEventListener("click", function() {
          structure_index = (num_pages - 1) * structure_per_page;
          structureList.innerHTML = "";
          createStructureDivs(structure_list, structure_index);
          createPaginationButtons(structure_list);
      });
      structureList.appendChild(lastPageButton);
  } else {
      // Create a disabled last page button
      let lastPageButton = document.createElement("button");
      lastPageButton.classList.add("pagination-button");
      lastPageButton.innerHTML = "▶▶";
      lastPageButton.disabled = true;
      structureList.appendChild(lastPageButton);
  }

  // Add a "x/y" page number indicator
  let pageIndicator = document.createElement("div");
  pageIndicator.classList.add("page-indicator");
  pageIndicator.innerHTML = `Page ${current_page + 1}/${num_pages}`;
  structureList.appendChild(pageIndicator);
}

// Function to create the search bar
function createSearchBar() {
    // Create the search bar
    let searchBar = document.createElement("input");
    searchBar.type = "text";
    searchBar.id = "search-bar";
    searchBar.className = "search-bar";
    searchBar.placeholder = "Search...";
    searchBarElement.appendChild(searchBar);
    
    // Create the clear search button
    let clearSearchButton = document.createElement("button");
    clearSearchButton.id = "clear-search-button";
    clearSearchButton.innerHTML = "Clear Search";
    clearSearchButton.className = "search-button";
    searchBarElement.appendChild(clearSearchButton);

    // Add a "see keywords" button that will display a list of keywords when pressed
    let seeKeywordsButton = document.createElement("button");
    seeKeywordsButton.id = "see-keywords-button";
    seeKeywordsButton.innerHTML = "See Keywords";
    seeKeywordsButton.className = "search-button";
    searchBarElement.appendChild(seeKeywordsButton);

    // Add an event listener to the "see keywords" button
    seeKeywordsButton.addEventListener("click", function() {
        // Get the keyword list
        let keywordList = document.getElementById("keyword-list");
        // If the keyword list is already displayed, remove it
        if (keywordList) {
            keywordList.remove();
        } else {
            // If the keyword list is not displayed, create it
            createKeywordList();
        }
    });
}

// Function to create the keyword list
function createKeywordList() {
    // Create the keyword list
    let keywordList = document.createElement("div");
    keywordList.id = "keyword-list";
    keywordList.classList.add("keyword-list");
    // Add a title "Keywords"
    let keywordTitle = document.createElement("h2");
    keywordTitle.innerHTML = "Keywords";
    keywordList.appendChild(keywordTitle);
    // Add the keywords
    for (let keyword in keywordData.keywords) {
        let keywordDiv = document.createElement("div");
        keywordDiv.innerHTML = `<h3>${keyword}</h3>`;
        let keywordArray = keywordData.keywords[keyword];
        for (let i = 0; i < keywordArray.length; i++) {
            let keywordSpan = document.createElement("span");
            keywordSpan.innerHTML = keywordArray[i];
            // Add a comma and space after each keyword, except for the last one
            if (i < keywordArray.length - 1) {
                keywordSpan.innerHTML += ", ";
            }
            keywordDiv.appendChild(keywordSpan);
        }
        keywordList.appendChild(keywordDiv);
    }

    // Add a new category to explain the custom regex available
    let customRegex = document.createElement("div");
    customRegex.innerHTML = "<h3>Custom Regex</h3>";
    customRegex.innerHTML += "<p>Use : </p>";
    customRegex.innerHTML += "<p>- to blacklist the word</p>";
    customRegex.innerHTML += "<p>% to use the word as an 'or' statement</p>";
    customRegex.innerHTML += "<p>/ to disable the keyword filter</p>";
    customRegex.innerHTML += "<p>No character to use the word as a normal search element</p>";
    keywordList.appendChild(customRegex);
    // Add the keyword list to the search bar element
    searchBarElement.appendChild(keywordList);

    // Add an event listener to the keyword list to remove it when clicked outside of it
    document.addEventListener("click", function(event) {
        if (!keywordList.contains(event.target) && event.target.id !== "see-keywords-button") {
            keywordList.remove();
        }
    });
}




// Create the search bar
createSearchBar();

// Create the filter menu
createFilterGroups();

// Get the saved data
let structure_list = getSavedData();

// Create the structure per page menu
createStructurePerPageMenu();

// Create the random structure menu
createRandomStructureMenu();

// Create the structure divs
createStructureDivs(structure_list, structure_index);

// Create the pagination buttons
createPaginationButtons(structure_list);

// Add event listener to the search bar
let searchBar = document.getElementById("search-bar");
/*
    Reminder on the serach characters:
    - : blacklists the word
    % : or (if several search element start with %, it means that the name must contain at least one of them)
    / : disables the keyword filter (treated above. In other case, treat is as a normal search element)
    No character: the name must contain the search element
*/

searchBar.addEventListener("keyup", function() {
    // Get the search string
    let searchString = searchBar.value.toLowerCase();

    // Filter the structure dictionary
    structure_list = getSavedData();

    // Navigate all the keys, then check if the name contains the search string
    let filtered_structure_list = {};

    // If the search string is empty, set the filtered structure list to the structure list
    if (searchString === "") {

        filtered_structure_list = structure_list;

    } else {

        // split the search string into search elements
        let searchElements = searchString.toLowerCase().split(" ");

        // remove empty elements
        searchElements = searchElements.filter((value) => value !== "");

        console.log(searchElements);

        // To avoid looping through the same elements, we will create a new list of search elements
        let newSearchElements = searchElements;

        // Add keyword listings to the search elements if keyword is part of the search string
        for (let i = 0; i < searchElements.length; i++) {
            if (keywordData.keywords[searchElements[i]]) {
                // Add the word list with a % in front of each one to the new search elements
                for (let j = 0; j < keywordData.keywords[searchElements[i]].length; j++) {
                    // if element does not start with / or -
                    if (!keywordData.keywords[searchElements[i]][j].startsWith("/") && !keywordData.keywords[searchElements[i]][j].startsWith("-")) {
                        newSearchElements.push("%" + keywordData.keywords[searchElements[i]][j]);
                    } else {
                        newSearchElements.push(keywordData.keywords[searchElements[i]][j]);
                    }
                }
                // Remove the keyword from the new search elements
                newSearchElements = newSearchElements.filter((value) => value !== searchElements[i]);
            }
        }

        // Remove the "/" from the new search elements
        newSearchElements = newSearchElements.map((value) => value.replace("/", ""));

        //console.log("New search elements: " + newSearchElements);

        // Remove double elements
        newSearchElements = newSearchElements.filter((value, index) => newSearchElements.indexOf(value) === index);

        //console.log("New search elements (no doubles): " + newSearchElements);

        // Get the "or" statements in a separate list, and get the blacklisted elements in a separate list
        let orStatements = newSearchElements.filter((value) => value.startsWith("%"));
        let blacklistedElements = newSearchElements.filter((value) => value.startsWith("-"));

        // Remove the or statements and blacklisted elements from the new search elements
        newSearchElements = newSearchElements.filter((value) => !value.startsWith("%"));
        newSearchElements = newSearchElements.filter((value) => !value.startsWith("-"));

        // Replace the search elements with the new search elements
        searchElements = newSearchElements;

        //console.log("'And' elements: " + searchElements);
        //console.log("'Or' elements: " + orStatements);
        //console.log("'Blacklisted' elements: " + blacklistedElements);

        // The search will be done in 3 stapes:
        // 1. Check if the structure contains the search elements
        // 2. Check if the structure contains the blacklisted elements
        // 3. Check if the structure contains the or statements

        let andStructures = {};
        let blacklistedStructures = {};
        let orStructures = {};

        // AND statements
        if (searchElements.length > 0) {
            for (let key in structure_list) {
                let passesSearch = false;

                for (let i = 0; i < searchElements.length; i++) {
                    let searchElement = searchElements[i];

                    if (structure_list[key].name.toLowerCase().includes(searchElement)) {
                        passesSearch = true;
                    } else {
                        passesSearch = false;
                        break;
                    }
                }

                // If the structure passes the search, add it to the filtered structure list
                if (passesSearch) {
                    andStructures[key] = structure_list[key];
                }
            }
        } else {
            andStructures = structure_list;
        }

        // Blacklisted statements
        if (blacklistedElements.length > 0) {
            for (let key in andStructures) {
                let passesSearch = true;

                for (let i = 0; i < blacklistedElements.length; i++) {
                    let blacklistedElement = blacklistedElements[i];

                    if (andStructures[key].name.toLowerCase().includes(blacklistedElement.substring(1))) {
                        passesSearch = false;
                        break;
                    }
                }

                // If the structure passes the search, add it to the filtered structure list
                if (passesSearch) {
                    blacklistedStructures[key] = andStructures[key];
                }
            }
        } else {
            blacklistedStructures = andStructures;
        }
        
        // OR statements
        if (orStatements.length > 0) {
            for (let key in blacklistedStructures) {

                // check the or statements using the orStatements list
                for (let j = 0; j < orStatements.length; j++) {
                    if (blacklistedStructures[key].name.toLowerCase().includes(orStatements[j].substring(1))) {
                        //console.log("Structure " + blacklistedStructures[key].name + " contains " + orStatements[j]);
                        orStructures[key] = blacklistedStructures[key];
                        break;
                    }
                }
            }
        } else {
            orStructures = blacklistedStructures;
        }

        // Add the or structures to the filtered structure list
        filtered_structure_list = orStructures;
    }



    structure_list = filtered_structure_list;

    // Update the structure list
    structure_index = 0;
    structureList.innerHTML = "";
    createStructureDivs(structure_list, structure_index);
    createPaginationButtons(structure_list);
});

// Add event listener to the clear search button
let clearSearchButton = document.getElementById("clear-search-button");
clearSearchButton.addEventListener("click", function() {
    searchBar.value = "";
    structure_list = getSavedData();
    structure_index = 0;
    structureList.innerHTML = "";
    createStructureDivs(structure_list, structure_index);
    createPaginationButtons(structure_list);
});

// Add event listener to the clear filters button
let clearFiltersButton = document.getElementById("clear-filters-button");
clearFiltersButton.addEventListener("click", 
    function() 
    {
        for (let i = 0; i < filterCheckboxes.length; i++) {
            filterCheckboxes[i].checked = false;
        }
        structure_list = getSavedData();
        structure_index = 0;
        structureList.innerHTML = "";
        createStructureDivs(structure_list, structure_index);
        createPaginationButtons(structure_list);
    }
);

// Add event listener to the apply filters button
let applyFiltersButton = document.getElementById("apply-filters-button");
applyFiltersButton.addEventListener("click", function() {
    for (let i = 0; i < filterCheckboxes.length; i++) {
        filterCheckboxes[i].checked = true;
    }
    structure_list = getSavedData();
    structure_index = 0;
    structureList.innerHTML = "";
    createStructureDivs(structure_list, structure_index);
    createPaginationButtons(structure_list);
});

