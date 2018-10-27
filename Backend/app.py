from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from twilio.rest import Client
#from taskDB import getPlannedTime, getTrainIDs, analyseCTs

#from TranslateStationID import TranslateStationID


def sendToPhone(number, travel_data):
    # Your Account Sid and Auth Token from twilio.com/console
    account_sid = 'XXX'
    auth_token = 'XXX'
    client = Client(account_sid, auth_token)

    text_message = "Signed up for notifications on "+ travel_data["start"] + " - " + travel_data["end"] + " at " + travel_data["time"]

    message = client.messages.create(
        body=text_message,
        from_='whatsapp:+XXX',
        to='whatsapp:'+number,
    )

    print(message.sid)


app = Flask(__name__)
api = Api(app)


class Send(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        #print(json_data)
        travel_data = json_data['travel_data']
        start_bf = travel_data["start"]
        end_bf = travel_data["end"]
        start_time = travel_data["time"]
        delay = "XXXX"
        stops = [1,2,3,4,5]

        sendToPhone("+XXX", travel_data)
        #translator = TranslateStationID()

        #trains = getTrainIDs(translator.nameToid(start_bf))
        #trainDict = analyseCTs(trains)
        #getPlannedTime(trainDict, evaStart, evaEnd, 15, 21)




        alt_start_bf = "YZYZ"
        alt_end_bf = "ZXZX"
        alt_start_time = "YXYX"
        alt_delay = "YYYY"
        alt_stops = [1,3,4,5]

        plan = [
            start_bf,
            end_bf,
            start_time,
            delay,
            stops
        ]

        alternative = [
            alt_start_bf,
            alt_end_bf,
            alt_start_time,
            alt_delay,
            alt_stops
        ]
        return jsonify(plan=plan, alternative=alternative)

api.add_resource(Send, "/")
































































if __name__ == '__main__':
    app.run(debug=True)