/* Travel Club        */
/* by Brian Cottrell  */
/* 02-27-2016         */

//Add neccessary packages
var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var http		= require('http');
var request     = require('request');
var nodemailer  = require('nodemailer');
var router      = express.Router();
var port        = process.env.PORT || 8080;

var hotelList;

app.use(router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/hotel', function(req, res){
	var arrive = req.body.arrive;
	var depart = req.body.depart;
	var region = req.body.region;
	http.request({
			host: 'terminal2.expedia.com',
			path: '/x/hotels?regionids='+region+'&radius=5km&dates='+arrive+','+depart+'&apikey=hHloxcWENIyQ34LK1vBP40sndQDHXAvx'
		}, 
		function(res){
			var str = '';
			res.on('data', function(chunk){
				str += chunk;
			});
			res.on('end', function(){
				str = JSON.parse(str);
				hotelList =
				'1. '+str.HotelInfoList.HotelInfo[0].Name+' $'+str.HotelInfoList.HotelInfo[0].Price.TotalRate.Value+
				'2. '+str.HotelInfoList.HotelInfo[1].Name+' $'+str.HotelInfoList.HotelInfo[1].Price.TotalRate.Value+
				'3. '+str.HotelInfoList.HotelInfo[2].Name+' $'+str.HotelInfoList.HotelInfo[2].Price.TotalRate.Value;
				console.log(hotelList);
				request(
					{
						url: 'https://messagingApi.Sinch.com/v1/sms/13109386046',
						method: 'POST',
						headers: {
							'Authorization': 'Basic ' + new Buffer('application\\6646ab62-5920-4274-b30e-cfce7d9f45bf:11VLa7eaPkKVY5au3y7PzQ==').toString('base64'),
							'Content-Type' : 'application/json'
						},
						body: "{\"message\": \""+hotelList+"\"}"
					}, 
					function(error, response, body){
						if(error){
							console.log(error);
						}else{
							console.log(body);
						}
					}
				);
			});
		}
	).end();
	console.log('Post Request Recieved');
    res.status(200);
})

router.route('/email').post(function(req, res){
	console.log(hotelList);
	var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'hacker1323@iocodelabs.com', // Your email id
            pass: 'onak6cemu2' // Your password
        }
    });

    var mailOptions = {
	    from: 'hacker1323@iocodelabs.com', // sender address
	    to: 'Brian_Cottrell@inbox.com', // list of receivers
	    subject: 'You have a new booking request from FL1GHT CLUB', // Subject line
	    text: 'Here is the clients top 3 choices: 'hotelList //, // plaintext body
	    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
	};

	transporter.sendMail(mailOptions, function(error, info){
	    if(error){
	        console.log(error);
	        res.json({yo: 'error'});
	    }else{
	        console.log('Message sent: ' + info.response);
	        res.json({yo: info.response});
	    };
	});
	res.status(200);
})

//Start app
app.listen(port);
console.log('Listening to port:', port);