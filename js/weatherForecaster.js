var weatherApp = angular.module('weatherApp',[]); // angular Module/app creation
// angular Controller
weatherApp.controller('weatherPredictor', ['$scope','$http','$q','$timeout',function($scope,$http,$q,$timeout){
	// Static Input Data - Weather Stations
	$scope.weatherData = [
	                      {"city":"Jakarta","country":"Indonesia","Code":"HLPA","lat":-6.1745,"long":106.8227,"temperature":"", "pressure":"","humidity":"","rain":"", "wind":"","fog":"","snow":""},                 {"city":"Chennai","country":"India","Code":"MAA","lat":13.0827,"long":80.2707,"temperature":"", "pressure":"","humidity":"","rain":"", "wind":"","fog":"","snow":""},
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
	$scope.requiredDate =  new Date();	// Date given by user
	//Method to get the weather conditions on  "Get Weather conditions" button click
	$scope.getWeatherCondition = function(requiredDate){
		var datesForcomputation = [];
		var prevYearData = []; var curYearData = [];
		$('#loading').show();
		$timeout(function() { 
			try{
				//Looping Through all stations to get weather conditions of each 
				for(var n=0; n<$scope.weatherData.length; n++){
					//Pre Yr(PY): weather conditions of 7 days before DT and weather conditions of 7 days after DT (Totally 15 days' weather conditions)
					datesForcomputation = computeDates(requiredDate,true);
					for(var j=0; j<datesForcomputation.length; j++ ) {
						prevYearData.push(serviceCall(datesForcomputation[j],$scope.weatherData[n]));
					}
					//Curr Yr(CY): weather conditions of nth Station for 7 days before required date in the current year
					datesForcomputation = computeDates(requiredDate,false);
					for(var j=0; j<datesForcomputation.length; j++ ) {
						curYearData.push(serviceCall(datesForcomputation[j],$scope.weatherData[n]));
					}
					//windowing to find the Euclidean distance(ed) of each window with the matrix CY as ED1, ED2, ED3, ..... ED9
					var ed = [];
					ed = windower(prevYearData,curYearData);
					//  Find the Best window as W =  window corresponding to Min(ED)
					var minEDIndex = leastElementIndex(ed);
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
					//Now, Add V to the previous day’s weather condition to get req. days's weather condition
					url = "http://api.wunderground.com/api/c7866e4d414ea5aa/history_"+(requiredDate.getFullYear()).toString()+((requiredDate.getMonth().toString().length<2)?"0"+requiredDate.getMonth():requiredDate.getMonth())+((requiredDate.getDate().toString().length<2)?"0"+(requiredDate.getDate()-1):(requiredDate.getDate()-1))+"/q/CA/"+$scope.weatherData[n].city.toString()+".json";
					// Get the Weather Condition of Previous day from API
					$.ajax({
						url:url,	type: 'GET',	async: false,	cache: false,
						success: function(response){
							// Add the Prediction factor to previous weather conditions
							$scope.weatherData[n].temperature = parseInt(response.history.dailysummary[0].maxtempm)+actualMeaners[0];
							$scope.weatherData[n].humidity =parseInt(response.history.dailysummary[0].humidity)+actualMeaners[1];
							$scope.weatherData[n].pressure = parseInt(response.history.dailysummary[0].meanwindspdm)+actualMeaners[2];
							$scope.weatherData[n].rain = parseInt(response.history.dailysummary[0].rain)+actualMeaners[3];
							$scope.weatherData[n].snow = parseInt(response.history.dailysummary[0].snow)+actualMeaners[4];
							$scope.weatherData[n].wind = parseInt(response.history.dailysummary[0].meanwindspdm)+actualMeaners[5];
							$scope.weatherData[n].fog = parseInt(response.history.dailysummary[0].fog)+actualMeaners[6];
							$('#loading').hide();
						},error: function(){
							console.log(" Error with external API for url "+url);
							$('#loading').hide();
							$('#error-block').css("display","block");
						}
					});
				}
			}catch(err){
				console.log("ERROR : "+err.message);
			}
		},0);
	}
}]);
// Function : To fetch API Weather Data on a particular date (dateForComputatio) 
function serviceCall(datesForcomputation,weatherData){
	var url = "";
	var data = {};
	console.log(datesForcomputation);
	try{
		url = "http://api.wunderground.com/api/c7866e4d414ea5aa/history_"+(datesForcomputation.getFullYear()).toString()+((datesForcomputation.getMonth().toString().length<2)?"0"+datesForcomputation.getMonth():datesForcomputation.getMonth())+((datesForcomputation.getDate().toString().length<2)?"0"+datesForcomputation.getDate():datesForcomputation.getDate())+"/q/CA/"+weatherData.city.toString()+".json";
		$.ajax({
			url:url,	type: 'GET',	async: false,	cache: true,
			success: function(response){
				console.log("!!");
				data={"temp":response.history.dailysummary[0].meantempm,
						"pressure":response.history.dailysummary[0].meanpressurem,
						"humidity":response.history.dailysummary[0].humidity,
						"wind":response.history.dailysummary[0].meanwindspdm,
						"fog":response.history.dailysummary[0].fog,
						"rain":response.history.dailysummary[0].rain,
						"snow":response.history.dailysummary[0].snow
				};
			},error: function(){
				console.log("Errored for "+url);
			}
		});
	}catch(err){
		console.log("ERROR : "+err.message);
		console.log("Exception while fetching data for following url : "+url);
	}
	return data;
}

function windower(prevYearData,curYearData){
	var i=0; var j=0; var e=0;
	var windowcount = 0;
	var ed = [];
	try{
		while(i<curYearData.length && j<prevYearData.length){
			if(!ed[e]) ed[e] = [];
			if(prevYearData[j]!="undefined" && curYearData[i]!="undefined")
				ed[e][i] = {
					"temp" : prevYearData[j].temp - curYearData[i].temp,
					"pressure" : prevYearData[j].pressure - curYearData[i].pressure,
					"humidity" : prevYearData[j].humidity - curYearData[i].humidity,
					"wind" : prevYearData[j].wind - curYearData[i].wind,
					"fog" : prevYearData[j].fog - curYearData[i].fog,
					"snow" : prevYearData[j].snow - curYearData[i].snow,
					"rain" : prevYearData[j].rain - curYearData[i].rain
			};
			else console.log("undefined");
			i++; j++; 
			if(i==(curYearData.length) && windowcount <= 8 ){
				windowcount++;
				i=0;
				j = windowcount;
				e++;
			}
		}
	}catch(err){
		console.log("ERROR : "+err.message);
	}
	return ed;
}

//Method to find the index of min element in an array
Array.prototype.min = function() {
	return Math.min.apply(null, this);
};

//Method to find the Mean of weather conditions
function findMean(prevW){
	console.log("findMean "+angular.toJson(prevW));
	var meaners = [];
	var daytoDayDiff = [];
	for(var i=0; i<=6; i++) {
		sum[i] = 0.0;
		meaners[i] = 0.0;
	}
	for(var i=0; i<prevW.length-1; i++){
		daytoDayDiff.push( {"temp":prevW[i].temp - prevW[i+1].temp,"humidity":prevW[i].humidity - prevW[i+1].humidity,
			"wind":prevW[i].wind - prevW[i+1].wind,"fog":prevW[i].fog - prevW[i+1].fog,
			"snow":prevW[i].snow - prevW[i+1].snow,"rain":prevW[i].rain - prevW[i+1].rain,
			"pressure":prevW[i].pressure - prevW[i+1].pressure
		});
	}
	//Find the Mean of VT, VP, VW, VH as MT, MP, MW, MH
	for(var i=0; i<daytoDayDiff.length; i++){
		if(daytoDayDiff[i].temp) sum[0] += daytoDayDiff[i].temp;
		if(daytoDayDiff[i].humidity) sum[1] += daytoDayDiff[i].humidity;
		if(daytoDayDiff[i].wind) sum[2] += daytoDayDiff[i].wind;
		if(daytoDayDiff[i].fog)	sum[3] += daytoDayDiff[i].fog;
		if(daytoDayDiff[i].snow) sum[4] += daytoDayDiff[i].snow;
		if(daytoDayDiff[i].rain) sum[5] += daytoDayDiff[i].rain;
		if(daytoDayDiff[i].pressure) sum[6] += daytoDayDiff[i].pressure;
	}
	for(var i=0; i<=6; i++){
		meaners[i] = sum[i]/daytoDayDiff.length;
	return meaners;
}

function leastElementIndex(ed){
	tempSum = [];
	meanTemp = [];
	for(var a = 0; a<ed.length; a++){
		tempSum[a] = 0; meanTemp[a] = 0.0;
		for(var b=0; b<ed[a].length; b++){
			tempSum[a] = tempSum[a] + ed[a][b].temp;
			meanTemp[a] = tempSum[a]/7; 
		}
	}
	var minEleIndex = 0;
	for(var i=0; i<meanTemp.length; i++){
		if(meanTemp[i]<meanTemp[minEleIndex]) minEleIndex =i;
	}
	return minEleIndex;
}

//Method to find the Previous year and Current year dates
function computeDates(requiredDate, prev){
	console.log("computeDates "+requiredDate+" "+prev);
	var dates = [];
	if(prev){ 
		//Prev year dates
		requiredDate.setDate(requiredDate.getDate() - 365);
		dates = getDates(requiredDate.addDays(-7), requiredDate.addDays(7));
	}else{
		//curr year dates
		dates = getDates(requiredDate.addDays(-7), requiredDate);
	}
	console.log("computeDates "+dates);
	return dates;

}
// Function: To add days to given / specified date
Date.prototype.addDays = function(days) {
	var dat = new Date(this.valueOf())
	dat.setDate(dat.getDate() + days);
	return dat;
}
// Function : to get the dates between startDate and stopDate
function getDates(startDate, stopDate) {
	console.log("getDates "+startDate +" "+stopDate);
	var dateArray = new Array();
	var currentDate = startDate;
	while (currentDate <= stopDate) {
		dateArray.push(currentDate)
		currentDate = currentDate.addDays(1);
	}
	console.log("getDates "+dateArray);
	return dateArray;
}
