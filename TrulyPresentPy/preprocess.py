import os
import pandas
import cv2
from tqdm import tqdm
import pickle
import numpy


class Preprocess:
    def __init__(self, file_name):
        self.fileName = file_name
        self.df = None
        self.dir = file_name
        self.sub_dirs = [d for d in os.listdir(self.dir) if os.path.isdir(os.path.join(self.dir, d))]

    def addToDF(self):
        data = {
            'name': [],
            'dest': []
        }
        for name in self.sub_dirs:
            files = [f for f in os.listdir(self.dir + '/' + name) if os.path.isfile(os.path.join(self.dir + '/' + name, f))]
            for file_ in files:
                data['name'].append(name)
                data['dest'].append(name + '/' + file_)
        self.df = pandas.DataFrame(data)
        self.df.to_csv("dataframes/"+self.fileName+'.csv', index=False)

    def savePreprocessed(self):
        images = []

        for image_filename in tqdm(list(self.df['dest'])):
            image_path = os.path.join(self.dir, image_filename)
            image = cv2.imread(image_path)
            image = cv2.resize(image, (160, 160))
            images.append(image)

        images = numpy.array(images)

        with open("image_pickles/"+self.fileName+".pkl", 'wb') as handle:
            pickle.dump(images, handle, protocol=pickle.HIGHEST_PROTOCOL)