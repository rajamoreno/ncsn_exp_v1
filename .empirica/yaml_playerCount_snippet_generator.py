# Generating a YAML snippet for playerCount values from 1 to 100
yaml_snippet = "- name: playerCount\n  desc: playerCount determines the number of Players in a Game.\n  values:\n"
for i in range(1, 101):
    yaml_snippet += f"    - value: {i}\n"

print(yaml_snippet)