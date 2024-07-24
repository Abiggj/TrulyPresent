#importing libraries
import cv2
import numpy as np
import face_recognition as face_rec

pic=face_rec.load_image_file('images/dhvani.jpg')
pic=cv2.cvtColor(pic,cv2.COLOR_BGR2RGB)
pic_test=face_rec.load_image_file('images/dhvani_test.jpg')
pic_test=cv2.cvtColor(pic_test,cv2.COLOR_BGR2RGB)

#finding face location

faceLocation_pic=face_rec.face_locations(pic)[0]
faceEncoding_pic=face_rec.face_encodings(pic)[0]
cv2.rectangle(pic,(faceLocation_pic[3],faceLocation_pic[0]),(faceLocation_pic[1],faceLocation_pic[2]),(255,0,255),3)

faceLocation_pic_test=face_rec.face_locations(pic_test)[0]
faceEncoding_pic_test=face_rec.face_encodings(pic_test)[0]
cv2.rectangle(pic_test,(faceLocation_pic_test[3],faceLocation_pic_test[0]),(faceLocation_pic_test[1],faceLocation_pic_test[2]),(255,0,255),3)

results=face_rec.compare_faces([faceEncoding_pic],faceEncoding_pic_test)
print(results)
cv2.putText(pic_test,f'{results}',(50,50),cv2.FONT_HERSHEY_COMPLEX,1,(0,0,255),2)

cv2.imshow('main_img',pic)
cv2.imshow('test_img',pic_test)
cv2.waitKey(0)
cv2.destroyAllWindows()
