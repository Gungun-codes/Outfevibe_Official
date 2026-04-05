import json

with open("backend/outfits.json", "r") as f:
    data = json.load(f)

for item in data:
    occasions = [o.lower() for o in item.get("occasions", [])]
    if "college" in occasions:
        item["priority"] = 1
    elif "casual" in occasions and item.get("priority") in [None, "-", ""]:
        item["priority"] = 2
    elif item.get("priority") in [None, "-", ""]:
        item["priority"] = 2
    else:
        # Keep existing priority, just ensure it's an int
        try:
            item["priority"] = int(item["priority"])
        except (ValueError, TypeError):
            item["priority"] = 2

with open("backend/outfits.json", "w") as f:
    json.dump(data, f, indent=2)

college = [i for i in data if "college" in [o.lower() for o in i.get("occasions", [])]]
print(f"Done! Total: {len(data)}, College (priority 1): {len(college)}")