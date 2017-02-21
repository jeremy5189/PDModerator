"""
A great test script for a great project
"""
import json
import sys
import requests # `pip install requests` if failed

def post_attendee(attendee_name="Great Again",
                  summary="This is tremendous!",
                  host="http://localhost:3000"):
    """
    A function to test if the attendee POST API is working.
    """
    test = requests.post(host+"/api/attendee", {"attendee_name": attendee_name,
                                                "summary": summary})
    assert test
    assert test.status_code == 200
    response = json.loads(test.text)
    assert response['status']

def get_attendee(host="http://localhost:3000"):
    """
    A function to test if the attendee GET API is working.
    """
    test = requests.get(host+"/api/attendee")
    assert test
    assert test.status_code == 200
    response = json.loads(test.text)
    assert isinstance(response, list)
    return response

def put_attendee(_id="",
                 op=None,
                 host="http://localhost:3000"):
    """
    A function to test if the attendee PUT API is working.
    """
    if not op:
        op = {"removed": True}
    test = requests.put(host+"/api/attendee", {"_id": _id,
                                               "payload": json.dumps(op)})
    assert test
    assert test.status_code == 200
    response = json.loads(test.text)
    assert response['status']

if __name__ == '__main__':
    try:
        _host = sys.argv[1]
    except IndexError:
        _host = "http://localhost:3000"

    print("Testing if everything is great...")
    post_attendee(host=_host)
    print("attendee POST success!")
    object_id = get_attendee(host=_host)[0]['_id']
    print("attendee GET success!")
    put_attendee(object_id, host=_host)
    print("attendee PUT success!")
    print("Wow! Terrific!")
