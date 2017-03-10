var m = require('mraa');
var moment = require('moment');
var momentTimezone = require('moment-timezone');
var sleep = require('sleep');
var mqtt    = require('mqtt');
//for office
var client  = mqtt.connect('mqtt://192.168.4.45');

//for home
//var client  = mqtt.connect('mqtt://localhost');


var Led3 = new m.Gpio(3); // power the zone
var Led13= new m.Gpio(13);

var lightSensor1 = new m.Aio(0); // measure light intensity
var lightSensor2 = new m.Aio(1); // measure light intensity
var lightSensor3 = new m.Aio(2); // measure light intensity
var lightSensor4 = new m.Aio(3); // measure light intensity
//var lightSensor5 = new m.Gpio(10); // measure light intensity
Led3.dir(m.DIR_OUT); //set the gpio direction to output
Led13.dir(m.DIR_OUT);



var state='startup';
var lamp1_state='startup';
var damaged_lamp=0;
var fresh_lamp=0;
var day_control=0;
var night_control=0;
var start_time=0;
var time_difference=0;



//create connection
client.on('connect', function () {
    client.subscribe('zone-1');
	client.subscribe('zone-1-status');
         client.publish('zone-1-status', state);
          
});

//communication
client.on('message', function (topic, message) {

//damage control

//1st light
var lightValue1 = lightSensor1.read();
console.log(lightValue1);
if(lightValue1<710)
{
  lamp1_state='damaged';
}
else
{
  lamp1_state='okay';
}
client.publish('lamp1',lamp1_state);

//2nd light
var lightValue2 = lightSensor2.read();
console.log(lightValue2);
if(lightValue2<610)
{
  lamp2_state='damaged';
}
else
{
  lamp2_state='okay';
}
client.publish('lamp2',lamp2_state);

//3rd light
var lightValue3 = lightSensor3.read();
console.log(lightValue3);
if(lightValue3<510)
{
  lamp3_state='damaged';
}
else
{
  lamp3_state='okay';
}
client.publish('lamp3',lamp3_state);

//4th light
var lightValue4 = lightSensor4.read();
console.log(lightValue4);
if(lightValue4<550)
{
  lamp4_state='damaged';
}
else
{
  lamp4_state='okay';
}
client.publish('lamp4',lamp4_state);

//5th light
//var lightValue5 = lightSensor5.read();
//console.log(lightValue5);
//if(lightValue5<20)
//{
 // lamp5_state='damaged';
//}
//else if(lightValue5>=20)
//{
 // lamp5_state='okay';
//}
//client.publish('lamp5',lamp5_state);


//Light on off
var time = moment().tz("Asia/Dhaka").format('mm');
  if(time%2==0)
    {
         if(night_control==0)
            {	
		Led3.write(1);
		Led13.write(1);
		console.log('LED Turned ON');
		state = 'on';
	  }
//Light on off by using command
              if(topic=="zone-1"){
		if(message == 'on'){
			Led3.write(1);
			Led13.write(1);
			console.log('LED Turned ON');
			state = 'on';
		}else{
			Led3.write(0);
			Led13.write(0);
			console.log('LED Turned OFF');
			state = 'off';
		}
                  night_control=1;
               }


   }
  else if ( time%2==1)
   {
	if(day_control==0)
	{
		Led3.write(0);
		Led13.write(0);
		console.log('LED Turned OFF');
		state = 'off';
	}

//Light on off by using command
              if(topic=="zone-1"){
		if(message == 'on'){
			Led3.write(1);
			Led13.write(1);
			console.log('LED Turned ON');
			state = 'on';
		}else{
			Led3.write(0);
			Led13.write(0);
			console.log('LED Turned OFF');
			state = 'off';
		}
                  day_control=1;
               }
   } 


client.publish('zone-1-status', state);
 sleep.msleep(400);
console.log('');

//reset option
just_time=moment().tz("Asia/Dhaka").format('mm');
if(start_time==0)
{
start_time=just_time;
}
var running_time=moment().tz("Asia/Dhaka").format('mm');
var time_difference=running_time-start_time;

if(time_difference>=3)
{
day_control=0;
night_control=0;
start_time=0;
time_difference=0;
console.log('RESET!!!!');
}
   
});






