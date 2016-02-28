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

//Specify routes
router.route('/')
.get(function(req, res){
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
	console.log('Get Request Recieved')
    res.status(200);
});

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Brian Cottrell" <Brian.Cottrell0@gmail.com>', // sender address
    to: 'Brian_Cottrell@inbox.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world 🐴', // plaintext body
    html: '<b>Hello world 🐴</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});

app.use(router);
app.use(bodyParser.json());

//Start app
app.listen(port);
console.log('Listening to port:', port);