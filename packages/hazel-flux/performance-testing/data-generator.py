import os
import json
from faker import Faker

fake = Faker()

def generate_data(fake):
    # Generate a more complex JSON structure
    return {
        'name': fake.name(),
        'address': fake.address(),
        'email': fake.email(),
        'job': fake.job(),
        'company': fake.company(),
        'details': {
            'description': fake.text(),
            'profile': {
                'birth_date': str(fake.date_of_birth()),
                'ssn': fake.ssn(),
                'residence': fake.address(),
                'current_location': [float(fake.latitude()), float(fake.longitude())],
                'website': fake.url(),
            }
        },
        'history': [fake.text() for _ in range(100)],  # 100 random history texts
    }

def create_json_file(filename, size_kb):
    data = []
    
    while len(json.dumps(data)) < size_kb * 1024:  # Calculate size in bytes
        data.append(generate_data(fake))

    with open('data/' + filename, 'w') as f:
        json.dump(data, f)

# # Create files of various sizes up to 1MB
# for i in range(16):  # This will create 32 files
#     size_kb = (i % 16 + 1) * (1024 / 16)  # This will cycle between sizes 1KB to 1MB
#     create_json_file(f"json_file_{size_kb}_KB.json", size_kb)

# # Create files of various sizes 1MB to 25MB
# for i in range(16):  # This will create 32 files
#     size_kb = (i % 16 + 1) * 1024  # This will cycle between sizes 1KB to 25MB
#     create_json_file(f"json_file_{size_kb//1024}_MB.json", size_kb)

import requests

def download_file(url, local_filename):
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open('data/' + local_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)
    return local_filename

repo_path = "https://raw.githubusercontent.com/ozlerhakan/mongodb-json-files/master/datasets/"

file_list = [
    "books.json",
    "city_inspections.json",
    "companies.json",
    "countries-small.json",
    "countries-big.json",
    "covers.json",
    "grades.json",
    "products.json",
    "profiles.json",
    "restaurant.json",
    "students.json"
]

for file_name in file_list:
    url = os.path.join(repo_path, file_name)
    download_file(url, file_name)

# Format the files by adding a comma at the end of each line and wrapping the whole file in an array
for file_name in file_list:
    lines = []
    file = open('data/' + file_name, 'r')
    for line in file:
        lines.append(line.rstrip())
    file.close()

    file = open('data/' + file_name, 'w')
    file.write("[\n")
    file.write(",\n".join(lines))
    file.write("\n]")
    file.close()

    