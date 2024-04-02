import cv2

PATH = "haarcascade_frontalface_default.xml"


class DetectFaces:
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(PATH)

    def detectFaces(self, image):
        faces = self.face_cascade.detectMultiScale(image, scaleFactor=1.1, minNeighbors=4)

        face_list = []

        for (x, y, w, h) in faces:
            face_roi = image[y:y + h, x:x + w]
            face_list.append(cv2.resize(face_roi, (160, 160)))
            cv2.rectangle(image, (x, y), (x + w, y + h), (255, 0, 0), 2)

        return face_list
