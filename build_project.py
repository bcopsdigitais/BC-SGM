import os
import re

with open("PROJECT_FILES.txt","r",encoding="utf-8") as f:
    data=f.read()

files=re.findall(r'=== FILE: (.*?) ===(.*?)=== END FILE ===',data,flags=re.S)

for path,content in files:
    path=path.strip()
    content=content.strip()

    folder=os.path.dirname(path)
    if folder and not os.path.exists(folder):
        os.makedirs(folder)

    with open(path,"w",encoding="utf-8") as out:
        out.write(content)

print("Projeto BC-SGM criado com sucesso.")