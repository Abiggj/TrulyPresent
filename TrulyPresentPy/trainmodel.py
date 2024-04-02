import numpy
from keras_facenet import FaceNet
from tensorflow.keras.applications.imagenet_utils import preprocess_input
import pickle
import pandas
from sklearn.preprocessing import LabelEncoder
from keras.utils import to_categorical
from sklearn.linear_model import LogisticRegression


class TrainModel:
    def __init__(self, file_name):
        file = open("image_pickles/"+file_name+".pkl", 'rb')
        self.images = numpy.array(pickle.load(file))
        self.images = preprocess_input(self.images)
        df = pandas.read_csv("dataframes/"+file_name+".csv")
        self.names = numpy.array(list(df['name']))
        self.embedder = FaceNet()
        self.labelEncoder = LabelEncoder()

    def splitEncode(self):
        self.y_train = self.labelEncoder.fit_transform(self.names)
        num_classes = len(self.labelEncoder.classes_)
        self.y_train = to_categorical(self.y_train, num_classes)

        if self.images.shape[-1] == 1:
            self.images = numpy.concatenate([self.images] * 3, axis=-1)
        self.X_train = self.embedder.embeddings(self.images)

    def trainModel(self):
        self.model = LogisticRegression()
        self.y_train = numpy.argmax(self.y_train, axis=1)
        self.model.fit(self.X_train, self.y_train)

    def predictName(self, image):
        if image.shape[2] == 1:
            image = numpy.concatenate([image] * 3, axis=-1)
        image = preprocess_input(image)
        embedding = self.embedder.embeddings(numpy.expand_dims(image, axis=0))
        predicted_label = self.model.predict(embedding)[0]

        predicted_name = self.labelEncoder.inverse_transform([predicted_label])[0]

        return predicted_name
