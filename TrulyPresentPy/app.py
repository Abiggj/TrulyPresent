from flask import Flask, request, jsonify, Response, make_response
from flask_restful import Api, Resource
import json  # Import json module
import cv2
import numpy
from attendance import Attendance

app = Flask(__name__)
api = Api(app)


class AttendanceResource(Resource):
    def post(self):
        try:
            image = request.files['image'].read()
            class_name = request.form.get('class_name')
            nparr = numpy.frombuffer(image, numpy.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            attendance_system = Attendance(class_name=class_name)
            labels = list(set(attendance_system.takeAttendance(img)))
            return json.dumps(labels), 200
        except Exception as e:
            print(e)
            error_response = {'error': str(e)}
            return make_response(jsonify(error_response), 500)


api.add_resource(AttendanceResource, '/attendance')

if __name__ == '__main__':
    app.run(debug=True)
