import cv2
import numpy as np
import face_recognition as face_rec
import os
from datetime import datetime

def resize(img,size):
    width=int(img.shape[1]*size)
    height=int(img.shape[0]*size)
    dimension=(width,height)
    return cv2.resize(img,dimension,interpolation=cv2.INTER_AREA)

path='student_images'
studentImg=[]
studentName=[]
myList=os.listdir(path)
#print(myList)
for cl in myList:
    curImg=cv2.imread(os.path.join(path,cl))
    studentImg.append(curImg)
    studentName.append(os.path.splitext(cl)[0])
#print(studentName)

def findEncoding(images):
    encodingList=[]
    for img in images:
        img = cv2.cvtColor(img,cv2.COLOR_BGR2RGB)
        encodeImg=face_rec.face_encodings(img)[0]
        encodingList.append(encodeImg)
    return encodingList

def markAttendance(name):
    with open('marked_attendance.csv','r+')as f:
        myDataList=f.readlines()
        nameList=[]
        for line in myDataList:
            entry=line.split(',')
            nameList.append(entry[0])
        if name not in nameList:
            now=datetime.now()
            timestr=now.strftime('%H:%M')
            f.writelines(f'\n{name},{timestr}')

encode_list=findEncoding(studentImg)
vid=cv2.VideoCapture(0)

while True:
    success,frame=vid.read()
    frames = cv2.resize(frame,(0,0),None,0.25,0.25)
    #frames=cv2.cvtColor(frames,cv2.COLOR_BGR2RGB)

    faces_in_frame=face_rec.face_locations(frames)
    encode_in_frame=face_rec.face_encodings(frames,faces_in_frame)

    for encodeFace,faceloc in zip(encode_in_frame,faces_in_frame):
        matches=face_rec.compare_faces(encode_list,encodeFace)
        facedis=face_rec.face_distance(encode_list,encodeFace)
        print(facedis)
        matchIndex=np.argmin(facedis)

        if matches[matchIndex]:
            name=studentName[matchIndex]
            y1,x2,y2,x1=faceloc
            y1, x2, y2, x1= y1*4,x2*4,y2*4,x1*4
            cv2.rectangle(frame,(x1,y1),(x2,y2),(255,0,0),3)
            cv2.rectangle(frame,(x1,y2-25),(x2,y2),(0,0,0),cv2.FILLED)
            cv2.putText(frame,name,(x1+6,y2-6),cv2.FONT_HERSHEY_COMPLEX,1,(255,255,255),2)
            markAttendance(name)

    cv2.imshow('frame',frame)
    cv2.waitKey(1)

