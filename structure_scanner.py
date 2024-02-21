import os
import json
import aws_to_json_converter as ajc
import time
import argparse


def create_config_json():

    # open the json file if it exists, otherwise create a new one
    if not os.path.exists('config.json'):
        data = {"structures": []}
    else:
        with open('config.json') as json_file:
            data = json.load(json_file)

    # scan the structures directory
    for root, dirs, files in os.walk("./structures"):
        for file in files:
            if file.endswith(".aws"):
                print(os.path.join(root, file))
                # check if the file is already in the json
                found = False
                for structure in data["structures"]:
                    if structure["path"] == os.path.join(root, file):
                        found = True
                        break
                if not found:
                    # add it to the json
                    data["structures"].append({"path": os.path.join(root, file), "name": file, "description": ""})
            elif file.endswith(".awt"):
                print(os.path.join(root, file))
                # check if the file is already in the json
                found = False
                for structure in data["towns"]:
                    if structure["path"] == os.path.join(root, file):
                        found = True
                        break
                if not found:
                    # add it to the json
                    data["towns"].append({"path": os.path.join(root, file), "name": file, "description": ""})

    # write the json back to the file
    with open('config.json', 'w') as outfile:
        json.dump(data, outfile, indent=4)

    # remove any structures from the json that no longer exist
    for structure in data["structures"]:
        if not os.path.exists(structure["path"]):
            data["structures"].remove(structure)

    # remove any towns from the json that no longer exist
    for structure in data["towns"]:
        if not os.path.exists(structure["path"]):
            data["towns"].remove(structure)

    # write the json back to the file
    with open('config.json', 'w') as outfile:
        json.dump(data, outfile, indent=4)

    # done
    print("Done")

def create_each_structure_json():

    parsed_structure = 0

    # Open config.json
    with open('config.json') as json_file:
        data = json.load(json_file)

    # For each structure in config.json
    for structure in data["structures"]:
        ajc.aws_to_json(structure["path"])
        parsed_structure += 1

    print("Converted " + str(parsed_structure) + " structures")
        

if __name__ == "__main__":
    # Setup a timer
    start_time = time.time()

    # Create the parser
    parser = argparse.ArgumentParser(description='Scan and read AWS & AWT files.')

    # Add arguments
    parser.add_argument('-c', '--config', action='store_true', help='Create a config.json file')
    parser.add_argument('-s', '--structures', action='store_true', help='Convert all structures to json')

    # Parse the arguments
    args = parser.parse_args()

    # Run the functions
    if args.config:
        create_config_json()
    if args.structures:
        create_each_structure_json()
    
    # If no arguments are given, warn the user
    if not args.config and not args.structures:
        print("No arguments given. Use -h or --help for help.")

    # Print the time it took to run
    print("--- %s seconds ---" % (time.time() - start_time))

