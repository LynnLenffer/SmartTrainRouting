import requests
import time

headers = {'Authorization': 'Bearer XXXXXX'}

outfile = open("planned_time_table.xml", "w")
for i in range(0,25):
    outfile.write("------------------------------------------------------\n")
    r = requests.get('https://api.deutschebahn.com/timetables/v1/plan/8000082/181027/' + str(i).zfill(2), headers=headers)
    r.encoding = 'utf-8'
    outfile.write(r.text)

    text = r.text.replace(">",">\n")
    print(text)
    time.sleep(0.5)
    #for j in text:
    #    if "pt" in j:
    #        print(j)

outfile.flush()
outfile.close()