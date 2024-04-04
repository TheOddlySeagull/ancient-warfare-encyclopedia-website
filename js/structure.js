// this script will generate a structure specific page.

// Get the path to the structure structureName from the URL
const urlParams = new URLSearchParams(window.location.search);
const structurePackAndName = urlParams.get('structureName');

// From local storage, get the structure data
const structureData = JSON.parse(localStorage.getItem("structure_list"));

// Get the structure data from the structureName
//make structureName only the name (after the /)
let structureName = structurePackAndName.split("/")[1];
let structurePack = structurePackAndName.split("/")[0];
//console.log("Opening structure " + structureName + " from pack " + structurePack);
const structure = structureData[structurePackAndName];
//console.log(structure);

function GetJsonPath() {
    // Get the path to the structure
    const awsPath = structure['path'];
    // Replace the first folder name with "structures_jsons"
    const awsPathSplit = awsPath.split('/');
    awsPathSplit[1] = "../json/structures_jsons/";
    //Replace tha ".aws" with ".json"
    awsPathSplit[awsPathSplit.length - 1] = awsPathSplit[awsPathSplit.length - 1].replace(".aws", ".json");
    // Join the array back into a string
    const awsPathJson = awsPathSplit.join('/');
    //console.log(awsPathJson);
    return awsPathJson;
}


// Generate the path to the json file
const awsPathJson = GetJsonPath();

// check if the structure has a json file
// if it does, then fetch the json file
// if it doesn't, then fetch the .aws file
fetch(awsPathJson)
    .then(response => response.json())
    .then(data => {
        //console.log(data);

        // Generate the structure page
        GenerateStructurePage(data);
        // Generate the aside general info
        GenerateAsideGeneralInfo(data);
    })
    .catch((error) => {
        console.error('Error:', error);
        // Fetch the .aws file
        fetch(awsPath)
            .then(response => response.text())
            .then(data => {
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });


function GenerateStructurePage(data) {
    // Get the "structureDetail" div
    const structureDetail = document.getElementById("structureDetail");
    // Empty the div
    structureDetail.innerHTML = "";
    structureDetail.className = "structure-detail";
    structureDetail.id = "structureDetail";

    // Create the "structureDetailHeader" div
    const structureDetailHeader = document.createElement("div");
    structureDetailHeader.className = "structure-detail-header";
    structureDetailHeader.id = "structureDetailHeader";

    // in that div, add an img tag with the structure icon
    const structureIcon = document.createElement("img");
    structureIcon.src = structure['icon'];
    structureIcon.alt = structurePackAndName;

    //in that div, add a div of id structureDetailHeaderInfo and class structure-detail-header-info
    const structureDetailHeaderInfo = document.createElement("div");
    structureDetailHeaderInfo.className = "structure-detail-header-info";
    structureDetailHeaderInfo.id = "structureDetailHeaderInfo";

    //In structureDetailHeaderInfo, add the structure name as H2 and package as H3
    const structureNameH2 = document.createElement("h2");
    let structureName = structure['name'];
    // In the name, add a space in front of each capital letter
    structureName = structureName.replace(/([A-Z])/g, ' $1').trim();
    // In the name, replace "_" with " "
    structureName = structureName.replace(/_/g, ' ');
    // In the name, replace "S B " with "Survival Build "
    structureName = structureName.replace("S B ", "Survival Build ");
    structureName = structureName.replace("R U S T I C", "Rustic");
    structureName = structureName.replace("Q U A R K", "Quark ");
    structureName = structureName.replace(" Col ", " Collection ");
    structureNameH2.textContent = structureName;
    const structurePackageH3 = document.createElement("h3");
    structurePackageH3.textContent = structure['pack'];

    // Add the H2 and H3 to structureDetailHeaderInfo
    structureDetailHeaderInfo.appendChild(structureNameH2);
    structureDetailHeaderInfo.appendChild(structurePackageH3);

    // Add the structureIcon and structureDetailHeaderInfo to structureDetailHeader
    structureDetailHeader.appendChild(structureIcon);
    structureDetailHeader.appendChild(structureDetailHeaderInfo);

    // Add the structureDetailHeader to structureDetail
    structureDetail.appendChild(structureDetailHeader);

    // Create the nav bar
    const structureNavBar = document.createElement("nav");

    // Create the "description" button that links to "structureDetailDescription" id div
    const descriptionButton = document.createElement("button");
    descriptionButton.textContent = "Description";
    descriptionButton.className = "structure-detail-nav-button";
    descriptionButton.id = "descriptionButton";
    descriptionButton.onclick = function () {
        document.getElementById("structureDetailDescription").scrollIntoView({ behavior: "smooth" });
    };

    // Create the "validation" button that links to "structureDetailValidation" id div
    const validationButton = document.createElement("button");
    validationButton.textContent = "Validation";
    validationButton.className = "structure-detail-nav-button";
    validationButton.id = "validationButton";
    validationButton.onclick = function () {
        document.getElementById("structureDetailValidation").scrollIntoView({ behavior: "smooth" });
    };

    // Create the "Structure" button that links to "structureDetailStructure" id div
    const structureButton = document.createElement("button");
    structureButton.textContent = "Structure";
    structureButton.className = "structure-detail-nav-button";
    structureButton.id = "structureButton";
    structureButton.onclick = function () {
        document.getElementById("structureDetailStructure").scrollIntoView({ behavior: "smooth" });
    };

    // Create the "Entities" button that links to "structureDetailEntities" id div
    const entitiesButton = document.createElement("button");
    entitiesButton.textContent = "Entities";
    entitiesButton.className = "structure-detail-nav-button";
    entitiesButton.id = "entitiesButton";
    entitiesButton.onclick = function () {
        document.getElementById("structureDetailEntities").scrollIntoView({ behavior: "smooth" });
    };

    // Create the "Gallery" button that links to "structureDetailGallery" id div
    const galleryButton = document.createElement("button");
    galleryButton.textContent = "Gallery";
    galleryButton.className = "structure-detail-nav-button";
    galleryButton.id = "galleryButton";
    galleryButton.onclick = function () {
        document.getElementById("structureDetailGallery").scrollIntoView({ behavior: "smooth" });
    };

    // Add the buttons to the nav bar
    structureNavBar.appendChild(descriptionButton);
    structureNavBar.appendChild(validationButton);
    structureNavBar.appendChild(structureButton);
    structureNavBar.appendChild(entitiesButton);
    structureNavBar.appendChild(galleryButton);

    // Add the nav bar to the structureDetail
    structureDetail.appendChild(structureNavBar);

    // Create the "structureDetailDescription" div of class "structure-detail-segment"
    const structureDetailDescription = document.createElement("div");
    structureDetailDescription.className = "structure-detail-segment";
    structureDetailDescription.id = "structureDetailDescription";

    // Add "Description" as H2
    const descriptionH2 = document.createElement("h2");
    descriptionH2.textContent = "Description";

    // Add the description as a paragraph, and be sure to skip the line on each \n
    const descriptionP = document.createElement("p");
    descriptionP.textContent = structure['description'];
    descriptionP.innerHTML = descriptionP.innerHTML.replace(/\n/g, '<br><br>');

    // Add the H2 and P to structureDetailDescription
    structureDetailDescription.appendChild(descriptionH2);
    structureDetailDescription.appendChild(descriptionP);

    // Add the structureDetailDescription to structureDetail
    structureDetail.appendChild(structureDetailDescription);

    // Create the "structureDetailValidation" div of class "structure-detail-segment"
    const structureDetailValidation = document.createElement("div");
    structureDetailValidation.className = "structure-detail-segment";
    structureDetailValidation.id = "structureDetailValidation";

    // Add "Validation" as H2
    const validationH2 = document.createElement("h2");
    validationH2.textContent = "Validation";

    // Add an ul with the validation data
    const validationUl = document.createElement("ul");
    for (const [key, value] of Object.entries(data['validation'])) {
        const validationLi = document.createElement("li");
        // If the key is biomeList or dimensionList, then add the value as a list
        if (key == "biomeList" || key == "dimensionList") {
            // Create li with the key
            validationLi.textContent = key + ":";
            // Create a ul with the values
            const validationUlList = document.createElement("ul");
            for (const [listKey, listValue] of Object.entries(value)) {
                const validationLiList = document.createElement("li");
                validationLiList.textContent = listValue;
                validationUlList.appendChild(validationLiList);
            }
            validationLi.appendChild(validationUlList);
            validationUl.appendChild(validationLi);
        } else {
            validationLi.textContent = key + ": " + value;
            validationUl.appendChild(validationLi);
        }
    }

    // Create a mini-nav bar to see structure author's page adn pack's page
    const validationMiniNavBar = document.createElement("nav");

    // Create the "Author" button that links to the author's page
    const authorButton = document.createElement("button");
    authorButton.textContent = "Author";
    authorButton.className = "structure-detail-nav-button";
    authorButton.id = "authorButton";
    authorButton.onclick = function () {
        window.location.href = "author.html?author=" + structure['validation']['structureAuthor'];
    };

    // Create the "Pack" button that links to the pack's page
    const packButton = document.createElement("button");
    packButton.textContent = "Pack";
    packButton.className = "structure-detail-nav-button";
    packButton.id = "packButton";
    packButton.onclick = function () {
        window.location.href = "package.html?packName=" + structure['pack'];
    };

    // Add the buttons to the mini-nav bar
    validationMiniNavBar.appendChild(authorButton);
    validationMiniNavBar.appendChild(packButton);

    // Add the H2 and ul to structureDetailValidation
    structureDetailValidation.appendChild(validationH2);
    structureDetailValidation.appendChild(validationUl);
    structureDetailValidation.appendChild(validationMiniNavBar);

    // Add the structureDetailValidation to structureDetail
    structureDetail.appendChild(structureDetailValidation);

    // Create the "structureDetailStructure" div of class "structure-detail-segment"
    const structureDetailStructure = document.createElement("div");
    structureDetailStructure.className = "structure-detail-segment";
    structureDetailStructure.id = "structureDetailStructure";

    // Add "Structure" as H2
    const structureH2 = document.createElement("h2");
    structureH2.textContent = "Structure";

    // Create an ul
    const structureUl = document.createElement("ul");
    // Create mods li (if there are any)
    if (data['header']['mods'].length > 0) {
        const modsLi = document.createElement("li");
        modsLi.textContent = "Mods: "
        // Create a ul for the mods
        const modsUl = document.createElement("ul");
        for (const mod of data['header']['mods']) {
            const modLi = document.createElement("li");
            modLi.textContent = mod;
            modsUl.appendChild(modLi);
        }
        modsLi.appendChild(modsUl);
        structureUl.appendChild(modsLi);
    }
    // Create Size li
    const sizeLi = document.createElement("li");
    sizeLi.textContent = "Size: " + data['header']['size']
    // Create Offset li
    const offsetLi = document.createElement("li");
    offsetLi.textContent = "Offset: " + data['header']['offset']

    // Add the ul to structureDetailStructure
    structureUl.appendChild(sizeLi);
    structureUl.appendChild(offsetLi);
    structureDetailStructure.appendChild(structureH2);
    structureDetailStructure.appendChild(structureUl);

    // Add the structureDetailStructure to structureDetail
    structureDetail.appendChild(structureDetailStructure);

    // Create the "structureDetailEntities" div of class "structure-detail-segment"
    const structureDetailEntities = document.createElement("div");
    structureDetailEntities.className = "structure-detail-segment";
    structureDetailEntities.id = "structureDetailEntities";

    // Add "Entities" as H2
    const entitiesH2 = document.createElement("h2");
    entitiesH2.textContent = "Entities";

    // Add "Not implemented yet" as P
    const entitiesP = document.createElement("p");
    entitiesP.textContent = "Not implemented yet";

    // Add the H2 and P to structureDetailEntities
    structureDetailEntities.appendChild(entitiesH2);
    structureDetailEntities.appendChild(entitiesP);

    // Add the structureDetailEntities to structureDetail
    structureDetail.appendChild(structureDetailEntities);

    // Create the "structureDetailGallery" div of class "structure-detail-segment"
    const structureDetailGallery = document.createElement("div");
    structureDetailGallery.className = "structure-detail-segment";
    structureDetailGallery.id = "structureDetailGallery";

    // Add "Gallery" as H2
    const galleryH2 = document.createElement("h2");
    galleryH2.textContent = "Gallery";

    // Add "Not implemented yet" as P
    const galleryP = document.createElement("p");
    galleryP.textContent = "Not implemented yet";

    // Add the H2 and P to structureDetailGallery
    structureDetailGallery.appendChild(galleryH2);
    structureDetailGallery.appendChild(galleryP);

    // Add the structureDetailGallery to structureDetail
    structureDetail.appendChild(structureDetailGallery);


}

function GenerateAsideGeneralInfo(data) {
    // Get the "asideGeneralMenu" div
    const asideGeneralMenu = document.getElementById("asideGeneralMenu");
    asideGeneralMenu.className = "aside-container";

    // Create the "General Information" h3
    let generalInfo = document.createElement("div");
    generalInfo.classList.add("structure-per-page-menu");
    const generalInfoH2 = document.createElement("h3");
    generalInfoH2.textContent = "General Information";
    generalInfo.appendChild(generalInfoH2);


    // Create an ul
    const generalInfoUl = document.createElement("ul");
    // Create a li with the structure category
    const categoryLi = document.createElement("li");
    categoryLi.textContent = "Category: Structure";
    // Create a li with the generation type
    const generationTypeLi = document.createElement("li");
    let liContent = "Generation Type: ";
    //if worldGenEnabled, then add "World Generation" to the li
    if (data['validation']['worldGenEnabled'] && data['validation']['survival']) {
        liContent += "World Generation and Survival";
    } else if (data['validation']['worldGenEnabled']) {
        liContent += "World Generation";
    } else if (data['validation']['survival']) {
        liContent += "Survival";
    }
    generationTypeLi.textContent = liContent;
    // Create a li with the size
    const sizeLi = document.createElement("li");
    sizeLi.textContent = "Size: " + data['size'];
    // Create a li with the rarity
    const rarityLi = document.createElement("li");
    rarityLi.textContent = "Rarity: " + data['rarity'];

    // Add the li to the ul
    generalInfoUl.appendChild(categoryLi);
    generalInfoUl.appendChild(generationTypeLi);
    generalInfoUl.appendChild(sizeLi);
    generalInfoUl.appendChild(rarityLi);

    // Add the h2 and ul to asideGeneralMenu
    asideGeneralMenu.appendChild(generalInfo);
    asideGeneralMenu.appendChild(generalInfoUl);

    // Create a "download" button
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download";
    downloadButton.className = "aside-button";
    downloadButton.id = "downloadButton";
    downloadButton.onclick = () => {
        // Create a link to the file
        const link = document.createElement('a');
        link.setAttribute('href', data['path']);
        let download_url = data['path'];
        download_url = download_url.split("/");
        download_url[0] = "http://ancient-warfare.legends-of-gramdatis.com";
        download_url = download_url.join("/");
        link.setAttribute('href', download_url);
        link.setAttribute('download', data['name'] + ".aws");
        link.click();
    };

    // Add the button to asideGeneralMenu
    asideGeneralMenu.appendChild(downloadButton);

}