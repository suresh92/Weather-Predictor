var weatherApp = angular.module('weatherApp',[]);

weatherApp.controller('weatherPredictor', ['$scope','$http','$q','$timeout',function($scope,$http,$q,$timeout){
	// Static Input Data - Weather Stations
	$scope.weatherData = [
	                      {"city":"Jakarta","country":"Indonesia","Code":"HLPA","lat":-6.1745,"long":106.8227,"temperature":"", "pressure":"","humidity":"","rain":"", "wind":"","fog":"","snow":""},
	                      {"city":"Chennai","country":"India","Code":"MAA","lat":13.0827,"long":80.2707,"temperature":"", "pressure":"","humidity":"","rain":"", "wind":"","fog":"","snow":""},
	                      {"city":"Washington","country":"United States","Code":"BOF","lat":49,"long":-72.5,"temperature":"", "pressure":"","humidity":"","rain":"", "wind":"","fog":"","snow":""},
	                      {"city":"Nairobi","country":"Kenya","Code":"NBO","lat":1.2,"long":36.9,"temperature":"", "pressure":"","humidity":"","rain":"", "wind":"","fog":"","snow":""},
	                      {"city":"Ankara","country":"Turkey","Code":"ESB","lat":40.08,"long":33,"temperature":"", "pressure":"","humidity":"","rain":"", "wind":"","fog":"","snow":""},
	                      {"city":"Nuuk","country":"Greenland","Code":"GOH","lat":64.1,"long":-51.48,"temperature":"", "pressure":"","humidity":"","rain":"", "wind":"","fog":"","snow":""},
	                      {"city":"Kolkata","country":"Australia","Code":"BNK","lat":22.5726,"long":88.3639,"temperature":"", "pressure":"","humidity":"","rain":"", "wind":"","fog":"","snow":""},
	                      {"city":"NewYork","country":"United States","Code":"NYC","lat":40.71,"long":-74.00,"temperature":"", "pressure":"","humidity":"","rain":"", "wind":"","fog":"","snow":""},
	                      {"city":"Namlea","country":"Australia","Code":"NAM","lat":-3.24,"long":127.05,"temperature":"", "pressure":"","humidity":"","rain":"", "wind":"","fog":"","snow":""},
	                      {"city":"Taba","country":"Egypt","Code":"TCP","lat":29.49,"long":34.89,"temperature":"", "pressure":"","humidity":"","rain":"", "wind":"","fog":"","snow":""},
	                      {"city":"Tokat","country":"Turkey","Code":"TJK","lat":40.32,"long":36.55,"temperature":"", "pressure":"","humidity":"","rain":"", "wind":"","fog":"","snow":""},
	                      ];
	var url="";
	$scope.requiredDate =  new Date();
	/*$scope.temp = 0;
	$scope.humidity =0;
	$scope.rain = 0;
	$scope.snow = 0;
	$scope.wind = 0;
	$scope.fog = 0;*/

	//Method to get the weather conditions on  "Get Weather conditions" button click
	$scope.getWeatherCondition = function(requiredDate){
		console.log("getWeatherCondition!! "+requiredDate);
		var datesForcomputation = [];
		var windowSize = 7;
		var prevYearData = [];
		var curYearData = [];
		//Looping Through all stations to get weather contions of each 
		for(var n=0; n<$scope.weatherData.length; n++){
			console.log("For city:: "+$scope.weatherData[n].city);
			datesForcomputation = computeDates(requiredDate,true);
			//Pre Yr(PY): weather conditions of 7 days before DT and weather conditions of 7 days after DT (Totally 15 days' weather conditions)
			try{
				//Looping through previous year dates of nth station - PY
				for(var j=0; j<datesForcomputation.length; j++ ) {
					url = "http://api.wunderground.com/api/33830ccdb5a2d182/history_"+(datesForcomputation[j].getFullYear()).toString()+((datesForcomputation[j].getMonth().toString().length<2)?"0"+datesForcomputation[j].getMonth():datesForcomputation[j].getMonth())+((datesForcomputation[j].getDate().toString().length<2)?"0"+datesForcomputation[j].getDate():datesForcomputation[j].getDate())+"/q/CA/"+$scope.weatherData[n].city.toString()+".json";
					$.ajax({
						url:url,
						type: 'GET',
						async: false,
						cache: false,
						success: function(response){
							console.log("PD in "+response.history.dailysummary.length);
							prevYearData.push({"temp":response.history.dailysummary[0].meantempm,
								"pressure":response.history.dailysummary[0].meanpressurem,
								"humidity":response.history.dailysummary[0].humidity,
								"wind":response.history.dailysummary[0].meanwindspdm,
								"fog":response.history.dailysummary[0].fog,
								"rain":response.history.dailysummary[0].rain,
								"snow":response.history.dailysummary[0].snow
							});

						},error: function(){
							console.log("Errored");		       
						}
					});
				}
				//weather conditions of nth Sattion for 7 days before required date in the current year - CY	 
				datesForcomputation = computeDates(requiredDate,false);
				for(var k=0; k<datesForcomputation.length; k++ ) {
					url = "http://api.wunderground.com/api/33830ccdb5a2d182/history_"+(datesForcomputation[k].getFullYear()).toString()+((datesForcomputation[k].getMonth().toString().length<2)?"0"+datesForcomputation[k].getMonth():datesForcomputation[k].getMonth())+((datesForcomputation[k].getDate().toString().length<2)?"0"+datesForcomputation[k].getDate():datesForcomputation[k].getDate())+"/q/CA/"+$scope.weatherData[n].city.toString()+".json";
					$.ajax({
						url:url,
						type: 'GET',
						async: false,
						cache: false,
						success: function(response){
							console.log("CD Success!!! "+response.history.dailysummary.length);
							curYearData.push({"temp":response.history.dailysummary[0].maxtempm,
								"pressure":response.history.dailysummary[0].meanpressurem,
								"humidity":response.history.dailysummary[0].humidity,
								"wind":response.history.dailysummary[0].meanwindspdm,
								"fog":response.history.dailysummary[0].fog,
								"rain":response.history.dailysummary[0].rain,
								"snow":response.history.dailysummary[0].snow});
						},error: function(){
							console.log("Errored");		       
						}
					});

				}
			}catch(err){console.log("ERRORR !!! "+err.message);}
			
			//windowing to find the Euclidean distance of each window with the matrix CY as ED1, ED2, ED3, ..... ED9
			console.log("PD in all "+angular.toJson(prevYearData));
			console.log("CD in all "+angular.toJson(curYearData));
			var i=0;
			var j=0;
			var e=0;
			var windowcount = 0;
			var edSet = [];
			var ed = [[],[],[],[],[],[],[],[],[]];
			try{
				while(i<7 && j<=prevYearData.length){
					ed[e][i] = {
							"temp" : prevYearData[j].temp - curYearData[i].temp,
							"pressure" : prevYearData[j].pressure - curYearData[i].pressure,
							"humidity" : prevYearData[j].humidity - curYearData[i].humidity,
							"wind" : prevYearData[j].wind - curYearData[i].wind,
							"fog" : prevYearData[j].fog - curYearData[i].fog,
							"snow" : prevYearData[j].snow - curYearData[i].snow,
							"rain" : prevYearData[j].rain - curYearData[i].rain
					};

					i++; j++; 
					if(i==(windowSize) && windowcount <= 8 ){
						console.log("NEXT WIMDOW!");
						windowcount++;
						i=0;
						j = windowcount;
						e++;
					}
				}
			}catch(err){console.log("ERROR : "+err.message);}
			console.log("Resultant edSet "+angular.toJson(ed)); 	

			//  Find the Best window as W =  window corresponding to Min(ED)
			// find min(ED) index
			tempSum = [];
			meanTemp = [];
			for(var a = 0; a<ed.length; a++){
				tempSum[a] = 0; meanTemp[a] = 0.0;
				for(var b=0; b<ed[a].length; b++){
					tempSum[a] = tempSum[a] + ed[a][b].temp;
					meanTemp[a] = tempSum[a]/7; 
				}
			}
			console.log( tempSum + "-"+ meanTemp);
			var minEDIndex = leadtElementIndex(meanTemp);
			console.log("Min ED index is "+minEDIndex);
			console.log("Min ED is "+angular.toJson(ed[minEDIndex]));

			//In matrix W i.e corresponding(Min(ED)), find the day by day variation of each weather contition as VT, VP, VW, VH
			//for PD
			var prevW = [];

			for(var i=minEDIndex; i<prevYearData.length; i++ ){
				prevW.push(prevYearData[i]);
			}
			var prevMeaners = findMean(prevW);
			
			
			//for CD
			var currMeaners = findMean(curYearData);

			//Prediction Factors - Mean of all weather conditions - both PD and CD
			var actualMeaners = [];
			for(var i=0;i<prevMeaners.length; i++ ){
				actualMeaners[i] = (prevMeaners[i]+currMeaners[i])/2;
			}
			console.log("actualMeaners - "+actualMeaners);

			//Now, Add V to the previous day’s weather condition to get req. days's weather condition
			url = "http://api.wunderground.com/api/33830ccdb5a2d182/history_"+(requiredDate.getFullYear()).toString()+((requiredDate.getMonth().toString().length<2)?"0"+requiredDate.getMonth():requiredDate.getMonth())+((requiredDate.getDate().toString().length<2)?"0"+(requiredDate.getDate()-1):(requiredDate.getDate()-1))+"/q/CA/"+$scope.weatherData[n].city.toString()+".json";
			var index = JsonIndexOf($scope.weatherData,$scope.weatherData[n].city.toString());
			console.log("URL single "+url);
			console.log("Index "+	$scope.weatherData[index].city+ " "+index);

			// Get the Weather Condition of Previous day from API
			$.ajax({
				url:url,
				type: 'GET',
				async: false,
				cache: false,
				success: function(response){
					// Add the Prediction factor to previous weather conditions
					$scope.weatherData[index].temperature = parseInt(response.history.dailysummary[0].maxtempm)+actualMeaners[0];
					$scope.weatherData[index].humidity =parseInt(response.history.dailysummary[0].humidity)+actualMeaners[1];
					$scope.weatherData[index].pressure = parseInt(response.history.dailysummary[0].meanwindspdm)+actualMeaners[2];
					$scope.weatherData[index].rain = parseInt(response.history.dailysummary[0].rain)+actualMeaners[3];
					$scope.weatherData[index].snow = parseInt(response.history.dailysummary[0].snow)+actualMeaners[4];
					$scope.weatherData[index].wind = parseInt(response.history.dailysummary[0].meanwindspdm)+actualMeaners[5];
					$scope.weatherData[index].fog = parseInt(response.history.dailysummary[0].fog)+actualMeaners[6];

					console.log("Predicted Weather > "+$scope.weatherData[index].city+"===>" +$scope.weatherData[index].temperature+","+$scope.weatherData[index].humidity+","+
							$scope.weatherData[index].pressure+","+$scope.weatherData[index].rain+","+$scope.weatherData[index].snow+","+
							$scope.weatherData[index].wind+","+$scope.weatherData[index].fog);

				},error: function(){
					console.log("Errored");		       
				}
			});
		}
	}

}]);

//Method to find the index of min element in an array
Array.prototype.min = function() {
	return Math.min.apply(null, this);
};

//Method to find the Mean of weather conditions
function findMean(prevW){

	var meaners = [];
	var daytoDayDiff = [];
	for(var i=0; i<prevW.length-1; i++){
		daytoDayDiff.push( {"temp":prevW[i].temp - prevW[i+1].temp,"humidity":prevW[i].humidity - prevW[i+1].humidity,
			"wind":prevW[i].wind - prevW[i+1].wind,"fog":prevW[i].fog - prevW[i+1].fog,
			"snow":prevW[i].snow - prevW[i+1].snow,"rain":prevW[i].rain - prevW[i+1].rain,
			"pressure":prevW[i].pressure - prevW[i+1].pressure
		});
	}
	console.log(angular.toJson(daytoDayDiff));
	//Find the Mean of VT, VP, VW, VH as MT, MP, MW, MH
	var tempSum = 0; var tempMean = 0;
	var humiditysum = 0; var humidityMean =0;
	var windSum = 0; var windMean = 0;
	var fogSum = 0; var fogMean = 0;
	var snowSum = 0; var snowMean = 0;
	var rainSum = 0; var rainMean = 0;
	var pressureSum = 0; var pressureSMean = 0;

	for(var i=0; i<daytoDayDiff.length; i++){
		tempSum += daytoDayDiff[i].temp;
		tempMean = tempSum/daytoDayDiff.length;
		meaners[i] =tempMean;
		humiditysum += daytoDayDiff[i].humidity;
		humidityMean = humiditysum/daytoDayDiff.length;
		meaners[i] =humidityMean;
		windSum += daytoDayDiff[i].wind;
		windMean = windSum/daytoDayDiff.length;
		meaners[i] =windMean;
		fogSum += daytoDayDiff[i].fog;
		fogMean = fogSum/daytoDayDiff.length;
		meaners[i] =fogMean;
		snowSum += daytoDayDiff[i].temp;
		snowMean = snowSum/daytoDayDiff.length;
		meaners[i] =snowMean;
		rainSum += daytoDayDiff[i].snow;
		rainMean = rainSum/daytoDayDiff.length;
		meaners[i] =rainMean;
		pressureSum += daytoDayDiff[i].pressure;
		pressureSMean = pressureSum/daytoDayDiff.length;
		meaners[i] =pressureSMean;

	}
	console.log("Meaners "+meaners);
	return meaners;
}


function leadtElementIndex(array){
	var minEleIndex = 0;
	for(var i=0; i<array.length; i++){
		if(array[i]<array[minEleIndex]) minEleIndex =i;
	}
	return minEleIndex;
}

// Method to find the Previous year and Current year dates
function computeDates(requiredDate, prev){

	var dates = [];
	if(prev){ 
		//console.log("Prev year");
		requiredDate.setDate(requiredDate.getDate() - 365);
		dates = getDates(requiredDate.addDays(-7), requiredDate.addDays(7));
	}else{
		//console.log("curr year ");
		dates = getDates(requiredDate.addDays(-7), requiredDate);
	}
	return dates;
}

Date.prototype.addDays = function(days) {
	var dat = new Date(this.valueOf())
	dat.setDate(dat.getDate() + days);
	return dat;
}

function getDates(startDate, stopDate) {
	var dateArray = new Array();
	var currentDate = startDate;
	while (currentDate <= stopDate) {
		dateArray.push(currentDate)
		currentDate = currentDate.addDays(1);
	}
	return dateArray;
}


function JsonIndexOf(objects, value) {
	var i = 0;
	for (i=0; i<objects.length;i++) {
		if (objects[i].city == value) {
			return i;
		}

	}
	return null;
}
