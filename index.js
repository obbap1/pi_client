
/*
** The Messaging Queue Telemetry Protocol Client.
**
 */

const config = require('./config');
const mqtt = require('mqtt');
const rpio = require('rpio');

rpio.open(11, rpio.INPUT);

console.log(`Pin 11 is currently ${rpio.read(11) ? 'high' : 'low'}`);

rpio.open(12, rpio.OUTPUT, rpio.LOW);

for(let i = 0; i < 500; i++) {
	rpio.write(12, rpio.HIGH);
	rpio.sleep(1);

	rpio.write(12, rpio.LOW);
	rpio.msleep(500);

}


const client = mqtt.connect({
	port: config.mqtt.port,
	protocol: 'mqtts',
	host: config.mqtt.host,
	clientId: config.mqtt.clientId,
	reconnectPeriod: 1000,
	username: config.mqtt.clientId,
	password: config.mqtt.clientId,
	keepalive: 300,
	rejectUnauthorized: false
});

client.on('connect',function(){
	client.subscribe('greet');
	client.publish('greet', 'Hello, Its the PI baby');
});

client.on('message', function(topic, message){
	//message is Buffer
	console.log({topic});
	console.log(`The message is: ${message}`);
});