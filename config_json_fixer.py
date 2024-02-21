import os
import json
import aws_to_json_converter as ajc
import time
import argparse

# {
#     "path": "./structures/Seagull's WorldG Structure Pack/normal/ships/norska/norska_cns_trade_iron-tools.aws",
#     "name": "norska_cns_trade_iron-tools.aws",
#     "description": "description text here"
# },


# Open config.json
with open('config.json') as json_file:
    data = json.load(json_file)

# For each structure in config.json
for structure in data["structures"]:
    # if folder name doesn't exist
    if not os.path.exists(structure["path"]):
        print(structure["path"] + " does not exist!")
        # print description if there is one
        if structure["description"] != "":
            print(structure["description"])
        # remove all this structure's info from config.json
        data["structures"].remove(structure)

# For each town in config.json
for structure in data["towns"]:
    # if folder name doesn't exist
    if not os.path.exists(structure["path"]):
        print(structure["path"] + " does not exist!")
        # print description if there is one
        if structure["description"] != "":
            print(structure["description"])
        # remove it from config.json
        data["towns"].remove(structure)

# export the updated config.json
with open('config.json', 'w') as outfile:
    json.dump(data, outfile, indent=4)

print("Done!")