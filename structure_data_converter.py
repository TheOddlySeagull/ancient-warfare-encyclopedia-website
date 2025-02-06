import os
import json
import time
import argparse

def read_layer(layer_str):

    # Create a list
    layer_content = []

    #print(f"Layer To Parse: \n{layer_str}\n")

    # Split on line break if there is one
    if '\n' in layer_str:
        layer_lines = layer_str.strip().split('\n')
    else:
        layer_lines = layer_str

    #print(f"Layer Lines: \n{layer_lines}\n")

    for layer_line in layer_lines:

        # Check if the line is repeated several times (starts by nx..., with n a number)
        if 'x' in layer_line:
            #print(f"Layer Line is repeated: {layer_line}")
            # Split on x
            layer_line_tmp = layer_line.split('x')
            # Get the number of times to repeat
            repeat = int(layer_line_tmp[0])
            line = layer_line_tmp[1]

            processed_line = read_layer_line(line)

            for i in range(repeat):
                layer_content.append(processed_line)
        
        else:
            processed_line = read_layer_line(layer_line)
            layer_content.append(processed_line)
        
    return layer_content

def read_layer_line(layer_line_str):

    processed_line = []

    # Split on ,
    layer_line = layer_line_str.split(',')
    # Remove spaces
    layer_line = [value.strip() for value in layer_line]

    for value in layer_line:
            
        # If a | is present, split on it
        if '|' in value:
            subline = []
            # Split on |
            splitted_value = value.split('|')

            repeat = int(splitted_value[1])
            id = int(splitted_value[0])

            for i in range(repeat):
                subline.append(id)

            processed_line += subline

        else:
            processed_line.append(int(value))

    return processed_line

def parse_header(header_str):

    # print(f"Header To Parse: \n{header_str}\n")

    # Create empty dictionnary
    dictionnary = {}

    # loop through each line
    for line in header_str.strip().split('\n'):
        # If line has no "=", skip it
        if '=' not in line:
            continue
        # Split line to get key and value
        key, value = line.split('=')
        # Remove spaces
        key = key.strip()
        value = value.strip()
        # print(f"dictionnary: {key} : {value}")

        # If key is size or offset, split value to get x, y and z
        if key in ['size', 'offset']:
            value = value.split(',')
            value = [int(v) for v in value]
        # If key is mods, split value to get mods
        elif key == 'mods':
            value = value.split(',')
            # If mods is empty, set it to an empty list
            if value == ['']:
                value = []

        # Add key and value to dictionnary
        dictionnary[key] = value

    return dictionnary

def parse_validation(validation_str):
    # print(f"Validation To Parse: \n{validation_str}\n")

    # Create empty dictionnary
    dictionnary = {}

    # loop through each line
    for line in validation_str.strip().split('\n'):
        # If line has no "=", skip it
        if '=' not in line:
            continue
        # Split line to get key and value
        key, value = line.split('=')
        # Remove spaces
        key = key.strip()
        value = value.strip()
        # print(f"dictionnary: {key} : {value}")

        # if value is "true" or "false", convert it to a boolean
        if value == 'true':
            value = True
        elif value == 'false':
            value = False

        # If key is biomeList or dimensionList, split value to get a list
        if key in ['biomeList', 'dimensionList']:
            value = value.split(',')
            # If biomeList or dimensionList is empty, set it to an empty list
            if value == ['']:
                value = []
        
        # if value is a string and a number, convert it to an int
        if isinstance(value, str) and value.isnumeric():
            value = int(value)

        # Add key and value to dictionnary
        dictionnary[key] = value

    return dictionnary

def parse_layers(layers_str):

    # print(f"Layers To Parse: \n{layers_str}\n")

    # Create empty list
    layers = []

    # Split layers
    layers_list = layers_str.strip().split('layer:')

    for layer in layers_list[1:]: # the [1:] is to skip the first element, which is empty
        
        # Get the number of the layer
        layer_number = layer.split('\n')[0].strip()

        #print(f"Layer Number: {layer_number}")

        # Remove the first line
        layer = layer.split('\n')[1:]

        # remove empty lines
        layer = [line for line in layer if line != '']

        # Remove the last line
        layer = layer[:-1]
        

        #print(f"Layer Content: \n{layer}\n")

        # Process the layer
        layer_content = read_layer(layer)

        # If - inside the layer number
        if '-' in layer_number:
            #print(f"Layer number contains -: {layer_number}")
            numbers = layer_number.split('-')
            # Split on -
            layer_number_start = int(numbers[0])
            layer_number_end = int(numbers[1])
            # Add layers to layers
            for i in range(layer_number_start, layer_number_end + 1):
                layers.append({
                    'number': i,
                    'content': layer_content
                })
        else:
            # Add layer to layers
            layers.append({
                'number': int(layer_number),
                'content': layer_content
            })

    return layers

def parse_rules(rules_str):
    rules = []
    rule_list = rules_str.strip().split('rule:')
    for rule_element in rule_list[1:]:

        # Create empty dict
        rule = {}

        # print(f"Rule Element To Parse: \n{rule_element.strip()}\n")

        # Split to get several sections
        rule_element = rule_element.strip().split('data:')
        # print(f"Rule Element After Split: \n{rule_element}\n")

        # Get plugin and number
        base_rule_element = rule_element[0].strip().split('\n')
        plugin = base_rule_element[0].split('=')[1]
        number = base_rule_element[1].split('=')[1]
        # print(f"Plugin: {plugin}")
        # print(f"Number: {number}")
        # Add plugin and number to rule
        rule['plugin'] = plugin
        number = int(number)
        rule['number'] = number

        # Get data
        data = rule_element[1]
        data = data.split(':enddata')[0]
        data = data.split('JSON:')[1]
        data = data.strip()
        # print(f"Data: \n{data}")
        # print(f"JSON Data: \n{data}")
        # Add data to rule
        rule['data'] = data

        # Add rule to rules
        rules.append(rule)

    return rules

def parse_entities(entities_str):

    entities = []

    entity_list = entities_str.strip().split('entity:')

    for entity_element in entity_list[1:]:

        # Create empty dict
        entity = {}

        # print(f"Entity Element To Parse: \n{entity_element.strip()}\n")

        # Split to get several sections
        entity_element = entity_element.strip().split('data:')
        # print(f"Entity Element After Split: \n{entity_element}\n")

        # Get plugin and number
        base_entity_element = entity_element[0].strip().split('\n')
        plugin = base_entity_element[0].split('=')[1]
        number = base_entity_element[1].split('=')[1]
        # print(f"Plugin: {plugin}")
        # print(f"Number: {number}")
        # Add plugin and number to entity
        entity['plugin'] = plugin
        number = int(number)
        entity['number'] = number

        # Get data
        data = entity_element[1]
        data = data.split(':enddata')[0]
        try:
            data = data.split('JSON:')[1]
        except:
            print(f"Error with data: \n{data} in entity: \n  {entity_element}")
            continue
        data = data.strip()
        # print(f"Data: \n{data}")
        # print(f"JSON Data: \n{data}")
        # Add data to entity
        entity['data'] = data

        # Add entity to entities
        entities.append(entity)

    return entities

# Function to open descriptions.json to return old descriptions
def get_descriptions():
    # Open the old descriptions.json file to get some existing descriptions
    with open("descriptions.json", "r") as f:
        description_dict_json = json.load(f)
        structure_descriptions = description_dict_json['descriptions']

    # print the descriptions
    #print(structure_descriptions)
    # print the length of the descriptions
    #print(len(structure_descriptions))
        
    return structure_descriptions

# Function to open and read the file
def open_structure_file(file, descriptions, version):

    with open(file, "r", encoding='latin-1') as f:
        content = f.read()
    
    sections = content.split('####')

    #print("dividing sections...")

    #print("HEADER")
    #print(f"{sections[0].strip()}") # header content
    #print(f"{sections[1].strip()}")
    #print(f"{sections[2].strip()}") # validation content
    #print(f"{sections[3].strip()}")
    #print(f"{sections[4].strip()}") # layers content
    #print(f"{sections[5].strip()}")
    #print(f"{sections[6].strip()}") # rules content
    #print(f"{sections[7].strip()}")
    #print(f"{sections[8].strip()}") # entities content
    

    header_section = sections[0].strip()
    validation_section = sections[2].strip()
    layers_section = sections[4].strip()
    rules_section = sections[6].strip()
    entities_section = sections[8].strip()

    #print("parsing sections...")

    header = {}
    validation = {}
    layers = []
    rules = []
    entities = []

    if args.header:
        header = parse_header(header_section)
    if args.validation:
        validation = parse_validation(validation_section)
    if args.layers:
        layers = parse_layers(layers_section)
    if args.rules:
        rules = parse_rules(rules_section)
    if args.entities:
        entities = parse_entities(entities_section)
    
    # Get current date
    from datetime import date
    today = date.today()
    date = today.strftime("%d/%m/%Y") + " " + time.strftime("%H:%M:%S")

    # Create the icon url
    #icon = "http://ancient-warfare.legends-of-gramdatis.com/img/AW2_512.png"
    structure_name = os.path.splitext(os.path.basename(file))[0]
    # Check if the icon file exists
    if os.path.isfile(f"img/structures/{structure_name}.png"):
        icon = f"http://ancient-warfare.legends-of-gramdatis.com/img/structures/{structure_name}.png"
        #print(f"Icon found and exists : {icon}")
    else:
        icon = "http://ancient-warfare.legends-of-gramdatis.com/img/AW2_512.png"
    #print(f"Icon: {icon}")
        
    # Calculate the size of the structure
    block_count = header['size'][0] * header['size'][1] * header['size'][2]
    size = "Unknown"
    # small, medium, large, huge, gigantic
    if block_count < 5000:
        size = "Small"
    elif block_count < 15000:
        size = "Medium"
    elif block_count < 100000:
        size = "Large"
    elif block_count < 500000:
        size = "Huge"
    else:
        size = "Gigantic"

    # Rarity values: Widespread, Common, Uncommon, Rare, Legendary, (unique, irrelevant)
    # Calculate the rarity of the structure
    rarity = "Irrelevant"
    if validation['unique']:
        rarity = "unique"
    else:
        wheight_factor = 0
        distance_factor = 0
        if validation['selectionWeight'] > 1:
            if validation['selectionWeight'] <= 10: # 2 to 10
                wheight_factor = 1
            elif validation['selectionWeight'] <= 20: # 11 to 20
                wheight_factor = 2
            elif validation['selectionWeight'] < 40: # 21 to 39
                wheight_factor = 3
            elif validation['selectionWeight'] <= 50: # 40 to 50
                wheight_factor = 4
            else: # 51 or more
                wheight_factor = 5
        if validation['minDuplicateDistance'] > 1:
            if validation['minDuplicateDistance'] <= 500:
                distance_factor = 5
            elif validation['minDuplicateDistance'] <= 1000:
                distance_factor = 4
            elif validation['minDuplicateDistance'] <= 5000:
                distance_factor = 3
            elif validation['minDuplicateDistance'] <= 10000:
                distance_factor = 2
            else:
                distance_factor = 1
        
        # if none of the 2 factors are 0, we can calculate the rarity
        if wheight_factor > 0 and distance_factor > 0:
            # Average of the two factors
            #average = (wheight_factor + (distance_factor * 2)) / 3
            # Lowest of the two factors
            average = min(wheight_factor, distance_factor)
            #print(f"Average: {average}")
            if average <= 1:
                rarity = "Legendary"
            elif average <= 2:
                rarity = "Rare"
            elif average <= 3:
                rarity = "Uncommon"
            elif average <= 4:
                rarity = "Common"
            else:
                rarity = "Widespread"
            

    # If the structure name is in the description keys, use the description, else use "No description available"
    description = "No description available"
    if header['name'] in descriptions:
        description = descriptions[header['name']]
        

    # Create a disclamer
    disclamer = {
        'disclamer': 'This data was automatically generated by the Ancient Warfare Structure Pack AWS to JSON converter.',
        'version': version,
        'date': date,
        'author': 'TheOddlySeagull'
    }

    data = {
        'icon': icon,
        'description': description,
        'pack': os.path.split(file)[0].split(os.path.sep)[2],
        'name': header['name'],
        'path': file,
        'size': size,
        'rarity': rarity,
        'header': header,
        'validation': validation,
        'layers': layers,
        'rules': rules,
        'entities': entities
    }

    #print(data)

    return data, disclamer

# Function to create a single json for all the data
def create_single_json(data, file, disclamer):
    # check if file exists
    if os.path.isfile(file):
        #print(f"File {file} already exists, modifying...")
        # open the file
        with open(file, "r") as f:
            # load the data
            old_data = json.load(f)
            # replace the disclamer
            old_data['disclamer'] = disclamer
            old_data['data'] = data
        # open the file
        with open(file, "w") as f:
            # write the data
            json.dump(old_data, f, indent=4)
    else:
        print(f"File {file} does not exist, creating...")
        # open the file
        with open(file, "w") as f:
            # write the data
            json.dump({'disclamer': disclamer, 'data': data}, f, indent=4)

def update_single_json(data, file, disclamer):
    # check if file exists
    if os.path.isfile(file):
        #print(f"File {file} already exists, modifying...")
        # open the file
        with open(file, "r") as f:
            # load the data
            old_data = json.load(f)
            # replace the disclamer
            old_data['disclamer'] = disclamer
            # if the structure already exist as an entry, replace it
            for key, value in data.items():
                #print(f"Checking {key}...")
                if key in old_data['data']:
                    #print(f"{key} exists, modifying...")
                    old_data['data'][key] = value
                else:
                    print(f"{key} does not exist, creating...")
                    # add the data
                    old_data['data'][key] = value
        # open the file
        with open(file, "w") as f:
            # write the data
            json.dump(old_data, f, indent=4)
    else:
        print(f"File {file} does not exist, creating...")
        # open the file
        with open(file, "w") as f:
            # write the data
            json.dump({'disclamer': disclamer, 'data': data}, f, indent=4)


# Function to loop through all the files in a directory
def loop_through_files(directory):
    # Empty dictionary to store the data
    data = {}
    structure_count = 0
    town_count = 0
    stored_data_version = 0

    # if custom path is given, change the directory
    directory = "./"
    if args.path:
        directory = args.path
        print(f"Custom path: {directory}")


    # Create or update the structures_version.json file with the current date, and version + 1
    with open("./json/structures_version.json", "r") as f:
        # If using split argument
        if args.split:
            version = json.load(f)
            version['splitVersion'] += 1
            stored_data_version = version['splitVersion']
            version['date'] = time.strftime("%d/%m/%Y %H:%M:%S")
            print(f"New split version: {version['splitVersion']}")
        else:
            version = json.load(f)
            version['version'] += 1
            stored_data_version = version['version']
            version['date'] = time.strftime("%d/%m/%Y %H:%M:%S")
            print(f"New version: {version['version']}")
    with open("./json/structures_version.json", "w") as f:
        json.dump(version, f, indent=4)


    # Get the descriptions
    descriptions = get_descriptions()
    print(f"Descriptions: {len(descriptions)}")

    # If user specified a file, only convert that file
    if args.file:
        file_path = args.file
        structure_name = os.path.splitext(os.path.basename(file_path))[0]
        pack_name = file_path.split(os.path.sep)[2]
        structure_name = pack_name + os.path.sep + structure_name
        data[structure_name], disclamer = open_structure_file(file_path, descriptions, stored_data_version)
        structure_count += 1
        # If split is true, create a json for each structure
        if args.split:
            directory = "./json/structures_jsons/"
            if args.path:
                directory = args.path
                print(f"Custom path: {directory}")
            else:
                print(f"Default path: {directory}")
            # Create the file name
            file_name = os.path.splitext(os.path.basename(file_path))[0] + ".json"
            # Keep the folder structure after the pack name (including the pack name)
            path = data[structure_name]['path'].split(os.path.sep)[2:]
            # remove file from path
            path = path[:-1]
            # Create the path
            file_name = os.path.join(directory, *path, file_name)

            #Create path if it doesn't exits
            if not os.path.exists(os.path.dirname(file_name)):
                os.makedirs(os.path.dirname(file_name))

            print(f"Creating {file_name}...")

            # Create the file
            with open(file_name, "w") as f:
                # Write the data
                json.dump(data[structure_name], f, indent=4)
        else:
            # Create a single json for all the data
            update_single_json(data, directory + "json/structures.json", disclamer)
        return

    # Loop through all the files in the directory recursively
    for root, dirs, files in os.walk(f"{directory}structures/"):
        #print(f"Scanning {root}...")
        for file in files:
            if file.endswith(".aws"):
                file_path = os.path.join(root, file)
                #print(file_path)
                # The name of the structure is the file name
                structure_name = os.path.splitext(file)[0]
                # split the path to its folder names
                pack_name = os.path.split(root)[0].split(os.path.sep)[2]
                structure_name = pack_name + os.path.sep + structure_name
                data[structure_name], disclamer = open_structure_file(file_path, descriptions, stored_data_version)
                structure_count += 1
                #print(f"Structure count: {structure_count}")
                #print(f"Town count: {town_count}")
                #print(f"Structure data: {data[structure_name]}")
            # if town is true, include the towns
            if file.endswith(".awt") and args.towns:
                file_path = os.path.join(root, file)
                print(file_path)
                #data[file_path], disclamer = open_town_file(file_path)
                town_count += 1
    print("Found", structure_count, "structures and", town_count, "towns")

    # If split is true, create a json for each structure
    if args.split:
        directory = "./json/structures_jsons/"
        if args.path:
            directory = args.path
            print(f"Custom path: {directory}")
        else:
            print(f"Default path: {directory}")


        # Empty structures_jsons folder
        for root, dirs, files in os.walk(directory):
            for file in files:
                os.remove(os.path.join(root, file))
        # Loop through the data and create a json for each structure
        for file, content in data.items():
            # Get the name of the file
            file_name = os.path.basename(file)
            # Get the name of the file without the extension
            file_name = os.path.splitext(file_name)[0]
            # Create the file name
            file_name = file_name + ".json"
            # Keep the folder structure after the pack name (including the pack name)
            path = content['path'].split(os.path.sep)[2:]
            # remove file from path
            path = path[:-1]
            # Create the path
            file_name = os.path.join(directory, *path, file_name)

            #Create path if it doesn't exits
            if not os.path.exists(os.path.dirname(file_name)):
                os.makedirs(os.path.dirname(file_name))

            print(f"Creating {file_name}...")

            # Create the file
            with open(file_name, "w") as f:
                # Write the data
                json.dump(content, f, indent=4)
    else:
        # Create a single json for all the data
        create_single_json(data, directory + "json/structures.json", disclamer)

       

if __name__ == "__main__":
    # Setup a timer
    start_time = time.time()

    # Create the parser
    parser = argparse.ArgumentParser(description='Scan and read AWS & AWT files.')

    # Add arguments
    parser.add_argument('-hd', '--header', action='store_true', help="Save the header's data")
    parser.add_argument('-vd', '--validation', action='store_true', help="Save the validation's data")
    parser.add_argument('-ly', '--layers', action='store_true', help="Save the layers of the structure")
    parser.add_argument('-rl', '--rules', action='store_true', help="Save the block ID dictionnary of the structure")
    parser.add_argument('-et', '--entities', action='store_true', help="Save the entities of the structure")
    parser.add_argument('-s','--split', action='store_true', help='Save every structure in its own json file')
    parser.add_argument('-t','--towns', action='store_true', help='Include towns in the conversion')
    parser.add_argument('-p','--path', type=str, help='Custom path to the structures folder')
    parser.add_argument('-f','--file', type=str, help='Specify aws file to convert')
    parser.add_argument('-z','--zip', action='store_true', help='Create a zip of the packages')
    parser.add_argument('-j', '--json', action='store_true', help='Create json file(s)')

    # Parse the arguments
    args = parser.parse_args()

    # check if any arguments are given
    if not args.json and not args.zip:
        print("No arguments given, nothing to do. Please use the -j or --json argument to convert the files to json, or the -z or --zip argument to create a zip of the packages.")
        exit()

    # Run the functions
    if args.json:
        loop_through_files("./structures")
        # If no arguments are given, warn the user
        if not args.header and not args.validation and not args.layers and not args.rules and not args.split:
            print("No arguments given, nothing to do.")
    elif args.header or args.validation or args.layers or args.rules or args.split:
        # tell the user that the parameters are useless
        print("Please use the -j or --json argument to convert the files to json.")
        print("The -hd, -vd, -ly, -rl and -s arguments are useless without the -j argument.")


    # If zip is true, create a zip of the packages
    if args.zip:
        import shutil
        import zipfile

        print("Creating zip of the packages...")

        # Create 1 zip per folder of ./structures, in ./downloads
        for folder in os.listdir("./structures"):
            print(f"Creating zip of {folder}...")
            # Create the zip file
            zip_file = zipfile.ZipFile(f"./downloads/{folder}.zip", 'w')
            # Loop through the files and folders in the folder
            for root, dirs, files in os.walk(f"./structures/{folder}"):
                for file in files:
                    # Add the file to the zip
                    zip_file.write(os.path.join(root, file), os.path.relpath(os.path.join(root, file), f"./structures/{folder}"))
            # Open the ./json/structures_version.json file to get the version
            with open("./json/structures_version.json", "r") as f:
                version = json.load(f)
            # Add a MD file with the date and saying the zip was downloaded on the Ancient Warfare Encyclopedia website, created by theOddlySeagull
            with open(f"./downloads/{folder}.md", "w") as f:
                f.write(f"# {folder}\n\n")
                f.write(f"Download generated on {time.strftime('%d/%m/%Y %H:%M:%S')} for the [Ancient Warfare Encyclopedia](http://ancient-warfare.legends-of-gramdatis.com/)\n\n")
                f.write(f"Structure scan version: {version['version']}\n\n")
                f.write(f"Website created by [TheOddlySeagull](https://github.com/TheOddlySeagull/ancient-warfare-encyclopedia-website)\n")
            # Add the MD file to the zip
            zip_file.write(f"./downloads/{folder}.md", f"{folder}.md")
            # Close the zip file
            zip_file.close()


    # Print the time it took to run
    print("--- %s seconds ---" % (time.time() - start_time))

