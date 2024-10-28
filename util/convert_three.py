import csv
import sys
import datetime
import json
import zoneinfo

MEMBER_IDS = [
    4,
    1,
    2,
    3,
    5,
    6
]
COMPANY_ID = 1

EASTERN_TIME = zoneinfo.ZoneInfo('America/Toronto')

def split_bullets(str):
    lines = str.split('\n')
    # Remove the bullet (or hyphen in some cases?) that starts each line
    trimmed = [l.replace('• ', '').strip() for l in lines]
    return list(filter(lambda l: l != '', trimmed))

def convert(csv):
    # Skip header row
    next(csv)
    next(csv)

    for l in csv:
        number = l[1]
        created = datetime.datetime.strptime(l[2], '%Y-%m-%d %H:%M:%S').replace(tzinfo=EASTERN_TIME)

        name = l[21]

        members = []

        for idx, id in enumerate(MEMBER_IDS):
            # Each per-member block is 3 columns long, starting at index 2.
            # Dids are the second item of each block, and todos, and todos are the third.
            dids_string = l[2 + (idx * 3) + 2]
            todos_string = l[2 + (idx * 3) + 3]

            members.append({
                'id': id,
                'dids': split_bullets(dids_string),
                'todos': split_bullets(todos_string),
            })


        scrum_obj = {
            'name': name,
            'number': int(number),
            'createdAt': created.isoformat(),
            'companyId': COMPANY_ID,
            'members': members,
        }

        print(json.dumps(scrum_obj))
        

if __name__ == '__main__':
    filename = sys.argv[1]

    with open(filename, 'r') as f:
        reader = csv.reader(f)
        convert(reader)