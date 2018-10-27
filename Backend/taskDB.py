
import xml.etree.ElementTree as ET
import requests
import os



class TranslateStationID:
    def __init__(self):
        self.id_to_name = dict()
        self.name_to_id = dict()
        file = open("D_Bahnhof_2017_09.csv", encoding='utf-8')

        for i in file:
            fields = i.split(";")
            #print(fields)
            self.id_to_name[fields[0]] = fields[3]
            self.name_to_id[fields[3]] = fields[0]

    def nameToid(self, name):
        return self.name_to_id[name]

    def idToname(self, num):
        return self.id_to_name[num]


def getTrainIDs(evaStart):
    header = {"Authorization": "Bearer XXXX"}
    outfile = open("timetable.xml", "w")
    r = requests.get("https://api.deutschebahn.com/timetables/v1/rchg/"+evaStart, headers=header)
    r.encoding = 'utf-8'
    outfile.write(r.text)

    outfile.close()

    tree = ET.parse('timetable.xml')
    root = tree.getroot()

    trainIDs = []
    try:
        for tID in root.findall("./s"):
            for key in tID.attrib:
                if key == "id":
                    trainIDs.append(tID.attrib[key])


    except Exception as e:
        print("[-] Error: {}".format(e))

    return trainIDs


def analyseCTs(trainIDs):
    tree = ET.parse("timetable.xml")
    root = tree.getroot()

    delayedTrains = {}

    try:
        for tID, arInf, dpInf in zip(trainIDs, root.findall("./s/ar"), root.findall("./s/dp")):
            #if "l" in arInf.attrib and "l" in dpInf.attrib and arInf.attrib["l"] == dpInf.attrib["l"]:
            try:
                arrival_time = arInf.attrib["ct"][6:]
                departure_time = dpInf.attrib["ct"][6:]
                time_at_station = int(departure_time) - int(arrival_time)
                print("[+] Found Train: " + arInf.attrib["l"] + " Arrival time: " + arrival_time + " Departure time: " + departure_time)

                delayedTrains[tID] = [arInf.attrib["l"], arrival_time, departure_time, time_at_station]
                # print(tID,arInf.attrib,dpInf.attrib)
            except Exception as e:
                # exclude extra trains
                pass
                #print("[-] Error: {}".format(e))
    except Exception as e:
        pass
        #print("[-] Error: {}".format(e))

    return delayedTrains


def getPlannedTime(trainDict,evaStart,evaEnd,timeStart, timeEnd):
    headers = {'Authorization': 'Bearer XXXX'}
    stationID = TranslateStationID()
    stopsDict={}
    
    for t in range(timeStart,timeEnd+1):
        xmlfile = "planned_time_table.xml"
        outfile = open(xmlfile, "w")
        r = requests.get('https://api.deutschebahn.com/timetables/v1/plan/'+ evaStart+ '/181027/' + str(t).zfill(2), headers=headers)
        r.encoding = 'utf-8'
        outfile.write(r.text)
        outfile.flush()
        outfile.close()

        try:
            xmlfile = "planned_time_table.xml"
            tree = ET.parse(xmlfile)
            root = tree.getroot()
    
            for tID in root.findall("./s"):

                if tID.attrib["id"] in trainDict.keys():
                    stopsDict[tID.attrib["id"]] = []
                    for arrivals in root.findall("./s[@id='{}']/ar".format(tID.attrib["id"])):
            
                    
                        for station in arrivals.attrib["ppth"].split("|"):
                        
                            if evaEnd == stationID.nameToid(station):
                                

                                #print("train: "+arrivals.attrib["l"])
                                stopsDict[tID.attrib["id"]].append(arrivals.attrib["l"])
                                for i,j in zip(arrivals.attrib["ppth"].split("|")[::-1],range(1,len(arrivals.attrib["ppth"].split("|")[::-1])+1)):
                                    #print("Station {}: {}".format(j,i))
                                    stopsDict[tID.attrib["id"]].append(i)
                                    if stationID.nameToid(i) == evaEnd:
                                        break
                                        
                                #print("ptime: "+arrivals.attrib["pt"][6:8]+":"+arrivals.attrib["pt"][8:])
                                ptime = "ptime: "+arrivals.attrib["pt"][6:8]+":"+arrivals.attrib["pt"][8:]
                                #print("possible delay: "+" arrival: "+trainDict[tID.attrib["id"]][1][:2]+":"+trainDict[tID.attrib["id"]][1][2:]+" - departure: "+trainDict[tID.attrib["id"]][2][:2]+":"+trainDict[tID.attrib["id"]][2][2:]+"\n")
                                stopsDict[tID.attrib["id"]].append(ptime)
                                delay = trainDict[tID.attrib["id"]][1][:2]+":"+trainDict[tID.attrib["id"]][1][2:]+"-"+trainDict[tID.attrib["id"]][2][:2]+":"+trainDict[tID.attrib["id"]][2][2:]
                                stopsDict[tID.attrib["id"]].append(delay)
        except Exception as e:
            #print("[-] Error: {}".format(e))
            pass
        
        cleaned_stops={}
        for key in stopsDict.keys():
            if len(stopsDict[key]) > 1:
                cleaned_stops[key]=stopsDict[key]

        return cleaned_stops

StationID = TranslateStationID()
evaStart  = StationID.nameToid("Duisburg Hbf")
evaEnd    = StationID.nameToid("Köln Hbf")


trains = getTrainIDs(evaStart)



trainDict = analyseCTs(trains)



trainDict



getPlannedTime(trainDict,evaStart,evaEnd,17,20)





