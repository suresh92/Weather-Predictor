function setUp() {
	// fixture setup before running a testcase
}

function tearDown() {
	// anything to cleanup after running a testcase
}

function testServiceCall() {
	
	assertEquals("Checking for Proper data received", 
			{"temp":"29","pressure":"1009.92","humidity":"57","wind":"14","fog":"0","rain":"0","snow":"0"}, 
			serviceCall(new Date("Fri Aug 14 2015 15:41:47 GMT+0530 (India Standard Time)"),{"city":"Jakarta","country":"Indonesia","Code":"HLPA","lat":-6.1745,"long":106.8227,"temperature":"", "pressure":"","humidity":"","rain":"", "wind":"","fog":"","snow":""}));
}

function testServiceCall1() {
	
	assertEquals("Checking for Proper data received", 
			{"temp":"29","pressure":"1009.92","humidity":"57","wind":"14","fog":"0","rain":"0","snow":"0"}, 
			serviceCall(new Date("Fri Aug 14 2000 20:32:47 GMT+0530 (India Standard Time)"), {"city":"Nairobi","country":"Kenya","Code":"NBO","lat":1.2,"long":36.9,"temperature":"", "pressure":"","humidity":"","rain":"", "wind":"","fog":"","snow":""}));
	
}

function testServiceCall2() {
	
	assertEquals("Checking for Proper data received", 
			{"temp":"29","pressure":"1009.92","humidity":"57","wind":"14","fog":"0","rain":"0","snow":"0"}, 
			serviceCall(new Date("Fri Aug 14 2015 15:41:47 GMT+0530 (India Standard Time)"),{"city":"Jakarta","country":"Indonesia","Code":"HLPA","lat":-6.1745,"long":106.8227,"temperature":"", "pressure":"","humidity":"","rain":"", "wind":"","fog":"","snow":""}));
	
}


function testComputeDates() {
	
	assertEquals("Checking for dates for Weather prediction",[new Date("Fri Aug 14 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Sat Aug 15 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Sun Aug 16 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Mon Aug 17 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Tue Aug 18 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Wed Aug 19 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Thu Aug 20 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Fri Aug 21 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Sat Aug 22 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Sun Aug 23 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Mon Aug 24 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Tue Aug 25 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Wed Aug 26 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Thu Aug 27 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Fri Aug 28 2015 15:52:30 GMT+0530 (India Standard Time)")], 
			computeDates(new Date("Sat Aug 20 2016 15:52:30 GMT+0530 (India Standard Time)"),true));
}
function testComputeDates1() {
	
	assertEquals("Checking for dates for Weather prediction",[new Date("Fri Aug 14 2016 15:52:30 GMT+0530 (India Standard Time)"),new Date("Sat Aug 15 2016 15:52:30 GMT+0530 (India Standard Time)"),new Date("Sun Aug 16 2016 15:52:30 GMT+0530 (India Standard Time)"),new Date("Mon Aug 17 2016 15:52:30 GMT+0530 (India Standard Time)"),new Date("Tue Aug 18 2016 15:52:30 GMT+0530 (India Standard Time)"),new Date("Wed Aug 19 2016 15:52:30 GMT+0530 (India Standard Time)"),new Date("Thu Aug 20 2016 15:52:30 GMT+0530 (India Standard Time)"),], 
			computeDates(new Date("Sat Aug 20 2016 15:52:30 GMT+0530 (India Standard Time)"),false));
}function testComputeDates2() {
	
	assertEquals("Checking for dates for Weather prediction","", 
			computeDates("",true));
}

function testGetDates() {
	
	assertEquals("Checking dates received", 
			[new Date("Fri Aug 14 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Sat Aug 15 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Sun Aug 16 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Mon Aug 17 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Tue Aug 18 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Wed Aug 19 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Thu Aug 20 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Fri Aug 21 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Sat Aug 22 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Sun Aug 23 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Mon Aug 24 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Tue Aug 25 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Wed Aug 26 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Thu Aug 27 2015 15:52:30 GMT+0530 (India Standard Time)"),new Date("Fri Aug 28 2015 15:52:30 GMT+0530 (India Standard Time)")],
			getDates(new Date("Fri Aug 14 2015 15:52:30 GMT+0530 (India Standard Time)"), new Date("Fri Aug 28 2015 15:52:30 GMT+0530 (India Standard Time)")));
}
function testGetDates1() {
	
	assertEquals("Checking dates received", 
			"",
			getDates("", ""));
}function testGetDates2() {
	
	assertEquals("Checking dates received", 
			"",
			getDates("20/6/2015", "26/6/2015"));
}

function testFindMean() {
	
	assertEquals("Checking for Meaners received", [0.14285714285714285,-1,0.14285714285714285,0,0,0,-0.3628571428571539],
			findMean([{"temp":"29","pressure":"1009.92","humidity":"57","wind":"14","fog":"0","rain":"0","snow":"0"},{"temp":"28","pressure":"1009.69","humidity":"68","wind":"14","fog":"0","rain":"0","snow":"0"},{"temp":"28","pressure":"1009.92","humidity":"68","wind":"19","fog":"0","rain":"0","snow":"0"},{"temp":"28","pressure":"1010.82","humidity":"64","wind":"13","fog":"0","rain":"0","snow":"0"},{"temp":"28","pressure":"1011.58","humidity":"63","wind":"12","fog":"0","rain":"0","snow":"0"},{"temp":"28","pressure":"1010.86","humidity":"71","wind":"11","fog":"0","rain":"0","snow":"0"},{"temp":"28","pressure":"1011.69","humidity":"63","wind":"11","fog":"0","rain":"0","snow":"0"},{"temp":"28","pressure":"1012.46","humidity":"64","wind":"13","fog":"0","rain":"0","snow":"0"}]));
}

function testFindMean1() {
	
	assertEquals("Checking for Meaners received", [-4,-9.142857142857142,-1.8571428571428572,0,0,0,-144.63714285714286],
			findMean([{"temp":null,"pressure":null,"humidity":null,"wind":null,"fog":null,"rain":null,"snow":null},{"temp":"28","pressure":"1009.69","humidity":"68","wind":"14","fog":"0","rain":"0","snow":"0"},{"temp":"28","pressure":"1009.92","humidity":"68","wind":"19","fog":"0","rain":"0","snow":"0"},{"temp":"28","pressure":"1010.82","humidity":"64","wind":"13","fog":"0","rain":"0","snow":"0"},{"temp":"28","pressure":"1011.58","humidity":"63","wind":"12","fog":"0","rain":"0","snow":"0"},{"temp":"28","pressure":"1010.86","humidity":"71","wind":"11","fog":"0","rain":"0","snow":"0"},{"temp":"28","pressure":"1011.69","humidity":"63","wind":"11","fog":"0","rain":"0","snow":"0"},{"temp":"28","pressure":"1012.46","humidity":"64","wind":"13","fog":"0","rain":"0","snow":"0"}]));
}
function testFindMean2() {
	
	assertEquals("Checking for Meaners received", [NaN,NaN,NaN,NaN,NaN,NaN,NaN],
			findMean([""]));
}
function testGetWeatherCondition(){
	assertEquals("Checking for Weather Data Received", {"city":"Jakarta","country":"Indonesia","Code":"HLPA","lat":-6.1745,"long":106.8227,"temperature":33,"pressure":9.821428571428571,"humidity":69.32142857142857,"rain":0,"wind":9,"fog":-0.3328571428571487,"snow":0},
			getWeatherCondition());
	
}



