var fs = require("fs");

module.exports = {
	
	category: function (diast, syst) {
		if (diast < 60 && syst < 90) {
			return 'Hypotension';
		} else if (((diast >= 60) && (diast <= 79)) && ((syst >= 90) && (syst <= 119))) {
			return "Normal";
		} else if (((diast >= 80) && (diast <= 89)) && ((syst >= 120) && (syst <= 139))) {
			return "Prehypertension";
		} else if (((diast >= 90) && (diast <= 99)) && ((syst >= 140) && (syst <= 159))) {
			return "Hypertension Stage 1";
		} else if (((diast >= 100) && (diast <= 110)) && ((syst >= 160) && (syst <= 180))) {
			return "Hypertension Stage 2";
		} else if (diast > 110 && syst > 180) {
			return "Hypertensive Crisis";
		} else {
			return "Invalid value";
		}
	},

		
	catColor: function(args) {
		switch (args) {
			case 'Hypotension':
				return "peru";
				break;
			case "Normal":
				return "lime";
				break;
			case "Prehypertension":
				return "gold";
				break;
			case "Hypertension Stage 1":
				return "orange";
				break;
			case "Hypertension Stage 2":
				return "tomato";
				break;
			case "Hypertensive Crisis":
				return "red";
				break;
			case "Invalid value":
				return "darkgrey";
				break;
			default:
				return "black";
		}
	},
	
	timeLogs: function (yourfile, urdate, urmillis, idnum, speed, rssi, btlevel, btvoltage) {
		fs.open(yourfile, 'a+', function(err, fd) {
		   if (err) {
		      return console.error(err);
		   }
		   console.log("Logging current request..");
		   fs.appendFile(yourfile, urdate + "," + urmillis + "," + idnum + "," + speed + "," + rssi + "," + btlevel + "," + btvoltage + "\n",  function(err) {
			   if (err) {
			      return console.error(err);
			   }
			});
		   console.log("Logging done!");
		});
	}
};
