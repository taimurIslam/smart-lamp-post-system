import pymongo
from pymongo import MongoClient
import matplotlib.pyplot as plt 
import matplotlib.animation as animation
from matplotlib import style
import numpy as np


#mondoDb connection
client = MongoClient()
db=client.cameraData
my_data=db.data
#plot style
style.use('fivethirtyeight')
fig=plt.figure()
ax1=fig.add_subplot(1,1,1)



"""
for line in lines_up:
		if len(line)>1:
			up_count, hour, minute, second, date, month, year = line.split(" ")
			my_data.insert(
				{
				"up_count":int(up_count),
				"hour":int(hour),
				"minute":int(minute),
				"second":int(second),
				"date":int(date),
				"month":int(month),
				"year":int(year)
				})
"""
def animate(i):
	x_up=[]
	y_up=[]
	pre_min=0
	ck=my_data.find()
	for k in ck:
	#print(k["minute"])
	#mimute=k["minute"]
	#print(minute)
		if (pre_min!=k["minute"]):
			pre_min=k["minute"]
			print(pre_min)
			x_up.append(pre_min)
			show1=my_data.find({"minute":pre_min}).count()
			print(show1)
			y_up.append(show1)
		#x_up.title("minuite")
		ax1.clear()
		ax1.plot( x_up,y_up)
		ax1.set_title(" count vs time")
		ax1.set_xlabel('time')
		ax1.set_ylabel('count')
ani= animation.FuncAnimation(fig,animate, interval=1000)
plt.show()
	#else:



#show=my_data.find({"minute":9})
#a=show
#show1=my_data.find({"minute":9}).count()
#show_mimute=show.find({"minute":"08"}).count()
#for post in show:
#	print(post["up_count"])
#print(show1)

#print(show)
#show1=my_data.find_one({"minute":8}).sort("up_count").explain()
#print(show1)
