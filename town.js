class RoadBlock {
    constructor(block, meta) {

        block = block.replace("{\"name\":", "").replace("}", "");
        block = block.replace("\"", "").replace("\"", "");

        //If meta exists
        if (meta != undefined) {
            meta = meta.replace("\"properties\":{", "").replace("}}", "");
            meta = meta.replace("\"", "").replace("\"", "");
        }

        //console.log("block: ", block);
        //console.log("meta: ", meta);

        this.block = block;
        this.meta = meta;
    }
}

class WallElement {
    constructor(wall_line) {
        // split using :
        const wall_line_split = wall_line.split(":");
        this.name = wall_line_split[0];
        this.type = wall_line_split[1];
        this.id = wall_line_split[2];
        this.weight = wall_line_split[3];
        //console.log("wall_line_split: ", wall_line_split);
    }
}

class WallPattern {
    constructor(pattern_line) {
        //console.log("pattern in WallPattern constructor: ", pattern_line);
        // split on :
        const pattern_line_split = pattern_line.split(":");
        this.size = pattern_line_split[0];

        // Split the pattern on -
        const pattern_split = pattern_line_split[1].split("-");
        this.pattern = pattern_split[0];
    }
}

class TownStructure {
    constructor(structure_line) {
        //console.log("structure in TownStructure constructor: ", structure_line);
        // split on :
        const structure_line_split = structure_line.split(":");
        this.structure_name = structure_line_split[0];
        this.weight = structure_line_split[1];
    }
}



class Town {
    constructor(file) {
        //console.log('Creating town: ' + file);
        this.file = file;
        this.name = "Unloaded Town";
        this.minSize = 0;
        this.maxSize = 0;
        this.buildingExpansion = 0;
        this.preventNaturalHostileSpawns = false;
        this.selectionWeight = 0;
        this.clusterValue = 0;
        this.townBlockSize = 0;
        this.townPlotSize = 0;
        this.wallStyle = 0;
        this.wallSize = 16;
        this.exteriorSize = 0;
        this.exteriorPlotSize = 0;
        this.interiorEmptyPlotChance = 0;
        this.randomVillagersPerChunk = 0;
        this.roadBlocks = [];
        this.roadMeta = 0;
        this.biomeWhiteList = true;
        this.biomeList = [];
        this.dimensionWhiteList = true;
        this.dimensionList = [];
        this.lamp = "";
        this.territoryName = "";
        this.biomeReplacement = "";

        this.walls = [];
        this.wallPatterns = [];

        this.uniqueStructures = [];
        this.mainStructures = [];
        this.houseStructures = [];
        this.cosmeticStructures = [];
        this.exteriorStructures = [];

        this.description = "Decstiptions are not implemented yet.";
        this.package_name = "";
    }

    async load() {
        return new Promise((resolve, reject) => {
            console.log('Loading town ' + this.file);
            // Load the file content
            try {
                fetch(this.file)
                    .then(response => response.text())
                    .then(text => {

                        // Get the file's content
                        const fileContent = text;

                        // Split the file content by new line
                        const fileLines = fileContent.split("\n");

                        //Booleans to switch between sections
                        let header_scan = false;
                        let walls_scan = false;
                        let wallPatterns_scan = false;
                        let uniqueStructures_scan = false;
                        let mainStructures_scan = false;
                        let houseStructures_scan = false;
                        let cosmeticStructures_scan = false;
                        let exteriorStructures_scan = false;

                        fileLines.forEach(line => {
                            line = line.replace("\r", "");
                            if (line.startsWith("#") || line === "") {
                                return;
                            } else if (line.startsWith("header:")) {
                                //console.log("Started scaning header");
                                header_scan = true;
                                return;
                            } else if (line.startsWith(":endheader")) {
                                header_scan = false;
                                return;
                            } else if (line.startsWith("walls:")) {
                                //console.log("Started scaning walls");
                                walls_scan = true;
                                return;
                            } else if (line.startsWith(":endwalls")) {
                                walls_scan = false;
                                return;
                            } else if (line.startsWith("wallPatterns:")) {
                                wallPatterns_scan = true;
                                //console.log("Started scaning wallPatterns");
                                return;
                            } else if (line.startsWith(":endWallPaterns")) {
                                wallPatterns_scan = false;
                                return;
                            } else if (line.startsWith("uniqueStructures:")) {
                                //console.log("Started scaning uniqueStructures");
                                uniqueStructures_scan = true;
                                return;
                            } else if (line.startsWith(":endUniqueStructures")) {
                                uniqueStructures_scan = false;
                                return;
                            } else if (line.startsWith("mainStructures:")) {
                                //console.log("Started scaning mainStructures");
                                mainStructures_scan = true;
                                return;
                            } else if (line.startsWith(":endMainStructures")) {
                                mainStructures_scan = false;
                                return;
                            } else if (line.startsWith("houseStructures:")) {
                                //console.log("Started scaning houseStructures");
                                houseStructures_scan = true;
                                return;
                            } else if (line.startsWith(":endHouseStructures")) {
                                houseStructures_scan = false;
                                return;
                            } else if (line.startsWith("cosmeticStructures:")) {
                                //console.log("Started scaning cosmeticStructures");
                                cosmeticStructures_scan = true;
                                return;
                            } else if (line.startsWith(":endCosmeticStructures")) {
                                cosmeticStructures_scan = false;
                                return;
                            } else if (line.startsWith("exteriorStructures:")) {
                                //console.log("Started scaning exteriorStructures");
                                exteriorStructures_scan = true;
                                return;
                            } else if (line.startsWith(":endExteriorStructures")) {
                                exteriorStructures_scan = false;
                                return;
                            } else if (header_scan) {
                                switch (line.split("=")[0]) {
                                    case "name":
                                        this.name = line.split("=")[1];
                                        break;
                                    case "minSize":
                                        this.minSize = line.split("=")[1];
                                        break;
                                    case "maxSize":
                                        this.maxSize = line.split("=")[1];
                                        break;
                                    case "buildingExpansion":
                                        this.buildingExpansion = line.split("=")[1];
                                        break;
                                    case "preventNaturalHostileSpawns":
                                        if (line.split("=")[1] === "true") {
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
                                    case "townBlockSize":
                                        this.townBlockSize = line.split("=")[1];
                                        break;
                                    case "townPlotSize":
                                        this.townPlotSize = line.split("=")[1];
                                        break;
                                    case "wallStyle":
                                        this.wallStyle = line.split("=")[1];
                                        break;
                                    case "wallSize":
                                        this.wallSize = line.split("=")[1];
                                        break;
                                    case "exteriorSize":
                                        this.exteriorSize = line.split("=")[1];
                                        break;
                                    case "exteriorPlotSize":
                                        this.exteriorPlotSize = line.split("=")[1];
                                        break;
                                    case "interiorEmptyPlotChance":
                                        this.interiorEmptyPlotChance = line.split("=")[1];
                                        break;
                                    case "randomVillagersPerChunk":
                                        this.randomVillagersPerChunk = line.split("=")[1];
                                        break;
                                    case "roadBlocks":
                                        // Each block is seperated by |
                                        const roadBlocks = line.split("=")[1].split("|");
                                        //console.log("roadBlocks: ", roadBlocks);

                                        // Loop through each block
                                        roadBlocks.forEach(block => {
                                            // Each block is seperated from its meta by ,
                                            const blockData = block.split(",");

                                            // Create a new RoadBlock
                                            const roadBlock = new RoadBlock(blockData[0], blockData[1]);

                                            // Add the RoadBlock to the roadBlocks array
                                            this.roadBlocks.push(roadBlock);
                                        });
                                        //console.log("this.roadBlocks: ", this.roadBlocks);
                                        break;
                                    case "roadMeta":
                                        this.roadMeta = line.split("=")[1];
                                        break;
                                    case "biomeWhiteList":
                                        if (line.split("=")[1] === "true") {
                                            this.biomeWhiteList = true;
                                        } else {
                                            this.biomeWhiteList = false;
                                        }
                                        break;
                                    case "biomeList":
                                        // Each biome is seperated by ,
                                        const biomes = line.split("=")[1].split(",");

                                        // Loop through each biome
                                        biomes.forEach(biome => {
                                            // Add the biome to the biomeList array
                                            this.biomeList.push(biome);
                                        });
                                        break;
                                    case "dimensionWhiteList":
                                        if (line.split("=")[1] === "true") {
                                            this.dimensionWhiteList = true;
                                        } else {
                                            this.dimensionWhiteList = false;
                                        }
                                        break;
                                    case "dimensionList":
                                        // Each dimension is seperated by ,
                                        const dimensions = line.split("=")[1].split(",");

                                        // Loop through each dimension
                                        dimensions.forEach(dimension => {
                                            // Add the dimension to the dimensionList array
                                            this.dimensionList.push(dimension);
                                        });
                                        break;
                                    case "lamp":
                                        this.lamp = line.split("=")[1];
                                        break;
                                    case "territoryName":
                                        this.territoryName = line.split("=")[1];
                                        break;
                                    case "biomeReplacement":
                                        this.biomeReplacement = line.split("=")[1];
                                        break;
                                    default:
                                        //console.error("Unknown line: " + line);
                                        break;
                                }
                            } else if (walls_scan) {
                                let element = new WallElement(line);
                                //console.log("walls_scan element: ", element);
                                this.walls.push(element);
                            } else if (wallPatterns_scan) {
                                this.wallPatterns.push(new WallPattern(line));
                            } else if (uniqueStructures_scan) {
                                this.uniqueStructures.push(line);
                            } else if (mainStructures_scan) {
                                this.mainStructures.push(line);
                            } else if (houseStructures_scan) {
                                let element = new TownStructure(line);
                                //console.log("houseStructures_scan element: ", element);
                                this.houseStructures.push(element);
                            } else if (cosmeticStructures_scan) {
                                this.cosmeticStructures.push(new TownStructure(line));
                            } else if (exteriorStructures_scan) {
                                let element = new TownStructure(line);
                                this.exteriorStructures.push(element);
                            } else {
                                console.error("Unknown line: " + line);
                            }
                        });

                        // Get the pack name (folder name)
                        this.package_name = this.file.split("/")[2];

                        // Async
                        resolve(); // Resolve the promise when loading is complete
                    });
            } catch (error) {
                console.error('Error loading file:', error);
                reject(error);
            }
        });
    }

    //NorskaTownGenFillerWarehouseOpen2  for structure  NorskaTownGenFillerWarehouseOpen2
    isStructureInTown(structure_name) {

        structure_name = structure_name.replace("\n", "").replace(" ", "");

        let structure_found = false;

        // Check if the structure is in the mainStructures array
        if (this.mainStructures.includes(structure_name)) {
            structure_found = true;
        }

        // Check if the structure is in the houseStructures array (name only)
        this.houseStructures.forEach(houseStructure => {
            if (houseStructure.structure_name === structure_name) {
                structure_found = true;
            }
        });

        // Check if the structure is in the cosmeticStructures array (name only)
        this.cosmeticStructures.forEach(cosmeticStructure => {
            if (cosmeticStructure.structure_name === structure_name) {
                structure_found = true;
            }
        });

        // Check if the structure is in the exteriorStructures array (name only)
        this.exteriorStructures.forEach(exteriorStructure => {
            if (exteriorStructure.structure_name === structure_name) {
                structure_found = true;
            }
        });

        // Check if the structure is in the WallElement array (name only)
        this.walls.forEach(cur_wall => {
            if (cur_wall[0] === structure_name) {
                structure_found = true;
            }
        });

        // Check if the structure is in this.lamp
        if (this.lamp == structure_name) {
            structure_found = true;
        }

        // Return false if the structure is not in any of the arrays
        return structure_found;
    }
}

export {Town};