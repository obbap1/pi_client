  
/*
** The Messaging Queue Telemetry Protocol Client.
**
 */

const config = require('./config');
const mqtt = require('mqtt');
const rpio = require('rpio');
const RPI_DHT_SENSOR = require('rpi-dht-sensor');

// initialize sensor
const DHT11 = new RPI_DHT_SENSOR.DHT11(2);

//Read the temperature
function readTemperature(sensor = {}){
	const read = sensor.read();
	return read;
}


//Publish message
function publishMessage(client = {}, message = {}, topic = 'api-engine', time = 86400000 ){
	setInterval(() => {
		client.publish(topic, JSON.stringify(message));
	}, time);

}
//Open the PIN for message delivery
rpio.open(12, rpio.OUTPUT, rpio.LOW);

//Initialize client
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
	client.subscribe('api-engine');
	publishMessage(client,readTemperature(DHT11),'api-engine');
});

client.on('message', function(topic, message){
	//message is Buffer
	console.log({topic});
	console.log(`The message is: ${message}`);
});
