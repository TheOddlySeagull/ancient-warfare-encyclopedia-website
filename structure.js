import {getStructureDescriptionFromJSON, getTownCountForStructure} from "./fillStructures.module.js";
import {Town} from "./town.js";

class vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Structure {
    constructor(file) {
        this.file = file;
        this.name = "";
        this.version = "";
        this.mods = [];
        this.size = new vec3(0, 0, 0);
        this.offset = new vec3(0, 0, 0);

        this.type = "";
        this.structureAuthor = "";
        this.survival = false;
        this.worldGenEnabled = false;
        this.unique = false;
        this.preserveBlocks = false;
        this.preventNaturalHostileSpawns = false;
        this.selectionWeight = 0;
        this.clusterValue = 0;
        this.minDuplicateDistance = 0;
        this.dimensionWhiteList = false;
        this.dimensionList = [];
        this.biomeGroupList = "";
        this.biomeWhiteList = false;
        this.biomeList = [];
        this.leveling = 0;
        this.fill = 0;
        this.border = 0;
        this.blockSwap = false;
        this.territoryName = "";
        this.biomeReplacement = "";
        this.minGenerationHeight = 0;
        this.maxGenerationHeight = 255;

        this.layers = [];
        this.rules = [];
        this.entities = [];

        this.description = "Decstiptions are not implemented yet.";
        this.package_name = "";
        this.townCount = 0;
        
    }

    async load() {
        return new Promise(async (resolve, reject) => {
            // console.log("Loading structure: " + this.file);

            // From ./config.json get the structure description, and await for it to finish loading
            this.description = await getStructureDescriptionFromJSON(this.file);

            // Load the file content
            try {
                fetch(this.file)
                    .then(response => response.text())
                    .then(text => {

                        // Get the file's content
                        const fileContent = text;

                        // Split the file content by new line
                        const fileLines = fileContent.split("\n");

                        //console.log("headerLines:", fileLines, "from headerContent:", fileContent);

                        fileLines.forEach(line => {
                            line = line.replace("\r", "");
                            if (line.startsWith("#") || line.startsWith(":") || line === "" || line === "header:" || line === "validation:") {
                                return;
                            } else {
                                //console.log("line:", line, line.split("=")[0], line.split("=")[1]);
                                switch (line.split("=")[0]) {
                                    case "version":
                                        //console.log("version:", line.split("=")[1]);
                                        this.version = line.split("=")[1];
                                        //console.log("this.version:", this.version);
                                        break;
                                    case "name":
                                        this.name = line.split("=")[1];
                                        break;
                                    case "mods":
                                        //console.log("mods:", line.split("=")[1]);
                                        let tmp_line = line.split("=")[1];
                                        let mod_list = tmp_line.split(",");
                                        mod_list.forEach(mod => {
                                            this.mods.push(mod);
                                        });
                                    case "size":
                                        const size_string = line.split("=")[1];
                                        this.size.x = size_string.split(",")[0];
                                        this.size.y = size_string.split(",")[1];
                                        this.size.z = size_string.split(",")[2];
                                        break;
                                    case "offset":
                                        const foffset = line.split("=")[1];
                                        this.offset.x = foffset.split(",")[0];
                                        this.offset.y = foffset.split(",")[1];
                                        this.offset.z = foffset.split(",")[2];
                                        break;
                                    case "type":
                                        this.type = line.split("=")[1];
                                        break;
                                    case "structureAuthor":
                                        this.structureAuthor = line.split("=")[1];
                                        break;
                                    case "survival":
                                        //console.log("survival:", line.split("=")[1]);
                                        this.survival = line.split("=")[1];
                                        if (this.survival === "true") {
                                            this.survival = true;
                                        } else {
                                            this.survival = false;
                                        }
                                        break;
                                    case "worldGenEnabled":
                                        //console.log("worldGenEnabled:", line.split("=")[1]);
                                        this.worldGenEnabled = line.split("=")[1];
                                        if (this.worldGenEnabled === "true") {
                                            this.worldGenEnabled = true;
                                        } else {
                                            this.worldGenEnabled = false;
                                        }
                                        break;
                                    case "unique":
                                        this.unique = line.split("=")[1];
                                        if (this.unique === "true") {
                                            this.unique = true;
                                        } else {
                                            this.unique = false;
                                        }
                                        break;
                                    case "preserveBlocks":
                                        this.preserveBlocks = line.split("=")[1];
                                        if (this.preserveBlocks === "true") {
                                            this.preserveBlocks = true;
                                        } else {
                                            this.preserveBlocks = false;
                                        }
                                        break;
                                    case "preventNaturalHostileSpawns":
                                        this.preventNaturalHostileSpawns = line.split("=")[1];
                                        if (this.preventNaturalHostileSpawns === "true") {
                                            this.preventNaturalHostileSpawns = true;
                                        } else {
                                            this.preventNaturalHostileSpawns = false;
                                        }
                                        break;
                                    case "selectionWeight":
                                        this.selectionWeight = line.split("=")[1];
                                        break;
                                    case "clusterValue":
                                        this.clusterValue = line.split("=")[1];
                                        break;
                                    case "minDuplicateDistance":
                                        this.minDuplicateDistance = line.split("=")[1];
                                        break;
                                    case "dimensionWhiteList":
                                        const fdimensionWhiteList = line.split("=")[1];
                                        if (fdimensionWhiteList === "true") {
                                            this.dimensionWhiteList = true;
                                        } else {
                                            this.dimensionWhiteList = false;
                                        }
                                        break;
                                    case "dimensionList":
                                        const fdimensionList = line.split("=")[1];
                                        this.dimensionList = fdimensionList.split(",");
                                        break;
                                    case "biomeGroupList":
                                        this.biomeGroupList = line.split("=")[1];
                                        break;
                                    case "biomeWhiteList":
                                        const fbiomeWhiteList = line.split("=")[1];
                                        if (fbiomeWhiteList === "true") {
                                            this.biomeWhiteList = true;
                                        } else {
                                            this.biomeWhiteList = false;
                                        }
                                        break;
                                    case "biomeList":
                                        const fbiomeList = line.split("=")[1];
                                        this.biomeList = fbiomeList.split(",");
                                        break;
                                    case "leveling":
                                        this.leveling = line.split("=")[1];
                                        break;
                                    case "fill":
                                        this.fill = line.split("=")[1];
                                        break;
                                    case "border":
                                        this.border = line.split("=")[1];
                                        break;
                                    case "blockSwap":
                                        this.blockSwap = line.split("=")[1];
                                        break;
                                    case "territoryName":
                                        this.territoryName = line.split("=")[1];
                                        break;
                                    case "biomeReplacement":
                                        this.biomeReplacement = line.split("=")[1];
                                        break;
                                    case "minGenerationHeight":
                                        this.minGenerationHeight = line.split("=")[1];
                                        break;
                                    case "maxGenerationHeight":
                                        this.maxGenerationHeight = line.split("=")[1];
                                        break;
                                    
                                    default:
                                        //console.log("Unknown header line: " + line);
                                        break;
                                }
                            }
                        });

                        // Get the town count for this structure
                        this.townCount = getTownCountForStructure(this.name);

                        // Get the layers content

                        // Get the rules content

                        // Get the entities content

                        // Get the pack name (folder name)
                        this.package_name = this.file.split("/")[2];

                        // Async
                        resolve(); // Resolve the promise when loading is complete
                    });
                
                } catch (error) {
                    console.error("Error loading structure:", error);
                    reject(error);

                }
            });


        }
}

export {Structure};