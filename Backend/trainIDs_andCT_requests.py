import xml.etree.ElementTree as ET
import requests

stations = open("../DB/D_Bahnhof_2017_09.csv", "r")
lines = stations.readlines()
stations.close()

evaNo = []
for i in lines[1:]:
    try:
        eva = int(i.split(";")[0])
        evaNo.append(eva)
    except Exception as e:
        print("[-] Error: {}".format(e))

header = {"Authorization": "Bearer XXX"}
outfile = open("timetable.xml", "w")
r = requests.get("https://api.deutschebahn.com/timetables/v1/rchg/8000082", headers=header)
r.encoding = 'utf-8'
outfile.write(r.content)

outfile.close()

tree = ET.parse('timetable.xml')
root = tree.getroot()


def getTrainIDs(root):
    trainIDs = []
    try:
        for tID in root.findall("./s"):
            for key in tID.attrib:
                if key == "id" and len(tID.attrib[key].split("-")[0]) > 0:
                    trainIDs.append(tID.attrib[key].split("-")[0])
                elif key == "id" and len(tID.attrib[key].split("-")[0]) == 0:
                    trainIDs.append("-" + tID.attrib[key].split("-")[1])


    except Exception as e:
        print("[-] Error: {}".format(e))
        return 1

    return trainIDs


def analyseCTs(root, trainIDs):
    delayedTrains = {}

    try:
        for tID, arInf, dpInf in zip(trainIDs, root.findall("./s/ar"), root.findall("./s/dp")):
            if "l" in arInf.attrib and "l" in dpInf.attrib and arInf.attrib["l"] == dpInf.attrib["l"]:
                try:
                    arrival_time = arInf.attrib["ct"][6:]
                    departure_time = dpInf.attrib["ct"][6:]
                    time_at_station = int(departure_time) - int(arrival_time)
                    print("[+] Found Train: " + arInf.attrib[
                        "l"] + " Arrival time: " + arrival_time + " Departure time: " + departure_time)

                    delayedTrains[tID] = [arInf.attrib["l"], arrival_time, departure_time, time_at_station]
                    # print(tID,arInf.attrib,dpInf.attrib)
                except Exception as e:
                    # exclude extra trains
                    print("[-] Error: {}".format(e))
    except Exception as e:
        print("[-] Error: {}".format(e))
        return 1

    return delayedTrains


# main


trains = getTrainIDs(root)
analyseCTs(root, trains)
