import requests
import json
import sys

# Test Attendee API
def post_attendee(attendee_name="Great Again",
                  summary="This is tremendous!",
                  host="http://localhost:3000"):
    test = requests.post(host+"/api/attendee", {"attendee_name": attendee_name,
                                                "summary": summary})
    assert(test)
    assert(test.status_code==200)
    response = json.loads(test.text)
    assert(response['status'])

def get_attendee(host="http://localhost:3000"):
    test = requests.get(host+"/api/attendee")
    assert(test)
    assert(test.status_code==200)
    response = json.loads(test.text)
    assert(type(response) == type([]))
    return response

def put_attendee(_id="", op={"removed": True}, host="http://localhost:3000"):
    test = requests.put(host+"/api/attendee", {"_id": _id,
                                               "payload": json.dumps(op)})
    assert(test)
    assert(test.status_code==200)
    response = json.loads(test.text)
    assert(response['status'])

if __name__ == '__main__':
    try:
        host = sys.argv[1]
    except:
        host = "http://localhost:3000"
    print("Testing if everything is great...")
    post_attendee()
    _id = get_attendee()[0]['_id']
    put_attendee(_id)
    print("Wow! Terrific!")
