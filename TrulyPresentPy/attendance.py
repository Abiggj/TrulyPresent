from preprocess import Preprocess
from trainmodel import TrainModel
from detection import DetectFaces
import os.path

DATASETS = "./Datasets"

class Attendance:
    def __init__(self, class_name):
        if not ((os.path.isfile("image_pickles"+class_name+".pkl")) and (os.path.isfile("dataframes"+class_name+".csv"))):
            self.preprocessed_images = Preprocess(class_name)
            self.preprocessed_images.addToDF()
            self.preprocessed_images.savePreprocessed()

        self.model = TrainModel(class_name)
        self.model.splitEncode()
        self.model.trainModel()


    def takeAttendance(self, image):
        detector = DetectFaces()
        faces = detector.detectFaces(image)

        labels = []
        for face in faces:
            labels.append(self.model.predictName(face))

        return labels