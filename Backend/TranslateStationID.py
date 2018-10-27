class TranslateStationID:
    def __init__(self):
        self.id_to_name = dict()
        self.name_to_id = dict()
        file = open("../DB/D_Bahnhof_2017_09.csv", encoding='utf-8')

        for i in file:
            fields = i.split(";")
            #print(fields)
            self.id_to_name[fields[0]] = fields[3]
            self.name_to_id[fields[3]] = fields[0]

    def nameToid(self, name):
        return self.name_to_id[name]

    def idToname(self, num):
        return self.id_to_name[num]


if __name__ == '__main__':
    #Test
    translator = TranslateStationID()
    print(translator.nameToid("Oppendorf Bahnhof"))
    print(translator.idToname("8079607"))

