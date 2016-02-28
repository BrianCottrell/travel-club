/* Travel Club        */
/* by Brian Cottrell  */
/* 02-27-2016         */

//Add neccessary packages
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var http		= require('http');
var request     = require('request');

//Set port to 8080
var port        = process.env.PORT || 8080;

//Specify routes
router.route('/')
//Called when a user navigates to the home page
.get(function(req, res){
	request({
			url: 'https://messagingApi.Sinch.com/v1/sms/13109386046',
			method: 'POST',
			headers: {
				'Authorization': 'Basic ' + new Buffer('application\\6646ab62-5920-4274-b30e-cfce7d9f45bf:11VLa7eaPkKVY5au3y7PzQ==').toString('base64'),
				'Content-Type' : 'application/json'
			},
			body: "{'message': 'hello'}"
		}, 
		function(error, response, body){
			console.log(body);
		}
	);

	http.request({
			host: 'terminal2.expedia.com',
			path: '/x/hotels?regionids=5921&radius=5km&dates=2016-05-19,2016-05-22&apikey=hHloxcWENIyQ34LK1vBP40sndQDHXAvx'
		}, 
		function(res){
			var str = '';
			res.on('data', function(chunk){
				str += chunk;
			});
			res.on('end', function(){
				str = JSON.parse(str);
				console.log(str.HotelInfoList.HotelInfo[0].Name);
				console.log(str.HotelInfoList.HotelInfo[0].Price.TotalRate.Value);
				console.log(str.HotelInfoList.HotelInfo[1].Name);
				console.log(str.HotelInfoList.HotelInfo[1].Price.TotalRate.Value);
				console.log(str.HotelInfoList.HotelInfo[2].Name);
				console.log(str.HotelInfoList.HotelInfo[2].Price.TotalRate.Value);
			});
		}
	).end();
    res.status(200);
})

//Start app
app.listen(port);
console.log('Listening to port:', port);