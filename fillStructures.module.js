import { Town } from './town.js';

// Load the lists from local storage if they exist, or create them if they don't
const structure_list = JSON.parse(localStorage.getItem('structure_list')) || [];
const town_json_list = JSON.parse(localStorage.getItem('town_json_list')) || [];
var town_class_list = [];

// Function to fill the structure list, and wait for it to finish loading using async/await
export async function fillStructureList() {
    return new Promise((resolve, reject) => {
        // If the structure list is empty, load it from the structures.json file
        if (structure_list.length === 0) {
            console.log('Structure list is empty, loading from structures.json');
            // Read the structures.json file and populate the structures array
            fetch('./structures.json')
                .then(response => response.json())
                .then(config => {
                    // Get the "structures" section from the config and store it in the structures array
                    const structures = config.structures;

                    // Loop through each structure in the config and add it to the structure list
                    structures.forEach(structure => {
                        structure_list.push(structure);
                    });
                    //console.log('Structure list loaded successfully');
                    //console.log(structure_list);

                    const towns = config.towns;

                    towns.forEach(town => {
                        town_json_list.push(town);
                    });
                    //console.log('Town list loaded successfully');
                    //console.log(town_list);

                    //Store structure_list in local storage
                    localStorage.setItem('structure_list', JSON.stringify(structure_list));
                    //store town_json_list in local storage
                    localStorage.setItem('town_json_list', JSON.stringify(town_json_list));

                    resolve();


                })
                .catch(error => {
                    console.error('Error loading structures.json:', error);
                });

        } else {
            console.log('Structure list already loaded');
            resolve();
        }
    });
}

// Function to get the structure list
export function getStructureList() {
    //console.log('Structure list requested:', structure_list);
    return structure_list;
}

export function getTownList() {
    //console.log('Town list requested:', town_list);
    return town_json_list;
}

export async function getTownClassList() {
    //console.log('Town class list requested:', town_class_list);

    // If town list is empty, or if elements of the town list are not classes, load the towns
    if (town_class_list.length === 0 || !(town_class_list[0] instanceof Town)) {
        await loadTowns();
    }

    return town_class_list;
}

export function sortStructureList() {
    console.log('Sorting structure list');
    structure_list.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
    town_json_list.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
}

// getStructureDescriptionFromJSON
export function getStructureDescriptionFromJSON(structure_file) {
    return new Promise((resolve, reject) => {
        // Open ./structures.json
        fetch('./structures.json')
            .then(response => response.json())
            .then(config => {
                //console.log('Config loaded successfully:', config);
                // Get the "structures" section from the config and store it in the structures array
                const structures = config.structures;

                //console.log('Structures loaded successfully:', structures);

                // Loop through each structure in the config and add it to the structure list
                structures.forEach(structure => {
                    if (structure.path === structure_file) {
                        //console.log('Structure found:', structure.description);
                        if (structure.description === undefined) {
                            resolve('No description found');
                        } else {
                            resolve(structure.description);
                        }
                    }
                });
                resolve('No description found');
            })
            .catch(error => {
                console.error('Error loading structures.json:', error);
                reject(error);
            });
    });
}

async function loadTowns() {
    return new Promise((resolve, reject) => {
        town_class_list = [];
        console.log("Loading towns");

        // Loop through each town
        for (const town of getTownList()) {
            
            // Create the Town object
            let town_class = new Town(town.path);

            // Load the town
            town_class.load().then(async () => {

                // Add the town to the town list
                town_class_list.push(town_class);
            }
            ).catch(error => {
                console.error("Error loading town:", error);
            });
        }
        console.log("Finished loading towns");
        resolve();

    });
}

export async function getTownCountForStructure(structure_name) {
    console.log("Getting town count for structure: ", structure_name);

    // If town list is empty, or if elements of the town list are not classes, load the towns
    if (town_class_list.length === 0 || !(town_class_list[0] instanceof Town)) {
        console.log("Town list is empty, or elements of the town list are not classes, loading towns");
        await loadTowns();
    }

    let townCount = 0;

    // Loop through each town using a for...of loop
    for (const town of town_class_list) {
        // Use asynchronous functions inside the loop, await if necessary
        if (await town.isStructureInTown(structure_name)) {
            console.log("Structure is in town: ", town.name);
            townCount++;
        } else {
            //console.log("Structure is not in town ", town.name);
        }
    }

    console.log("Town count for structure ", structure_name, " is ", townCount);
    return townCount;
}

/*
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
}*/