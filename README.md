# Weather-Predictor
Implementation of a Weather Predicting algorithm

#How to Run the Project

Prerequisite: A web server, say Apcahe Tomcat server, browser
Have the project in the webapps folder of Tomcat server.
Start the server
and Hit the URL: http://localhost:8080/WeatherPredicto/weatherPredictor.html
(assuming the server is configured with port 8080)

Choose a date as input and Click the "Get Weather Conditions" button to get the weather conditions of various stations


# Algorithm Behind the weather prediction implementation

Weather conditions of future dates are predicted based on two factors.

1. Weather conditions prevailed in previous year - same date as that of required date

2. Weather conditions prevailed a week before the required date

Algorithm is as follows:

Step 1: Have the date on which the weather conditions(temperature, pressure, hmidity, etc.,) needs to be predicted as RD

Step 2: Get the weather conditions of following days

		Prev Yr(PD): weather conditions of 7 days before RD of prev year and weather conditions of 7 days after RD of prev year (Totally 15 days' weather conditions)
		
		Cur Yr(CD): weather conditions of 7 days before RD in the current year
		
  Example for Step 2:
  Suppose if RD is July 15, 2016, then 
  
  PD -> weather conditions of days: July 8, 2015 to July 22, 2015
  
  CD -> weather conditions of days: July 8, 2016 to July 14, 2016
  
Step 3: Slice the 15 days to 9 windows as (1-7),(2-8),(3-9),(4-10),(5-11),....(9-15)

Now  among PD, find a window which matches with CD. We find this using Euclidean distance method.
Euclidean distance between 2 points: (x1,y1) and (x2,y2) is (x1-x2),(y1-y2) 

Step 4: Compute the Euclidean distance of each window with the matrix CD as ED1, ED2, ED3, ..... ED9

Step 5: Find the Best window as W = window corresponding to Min(ED)

Step 6: In matrix W, find the day by day variation of each weather contition as VT1, VP1, VH1, etc., 

Step 6: Also, In matrix CD, find the day by day variation of each weather contition as VT2, VP2, VH2, etc., 

Step 7: Find the Mean of VT, VP, VH.. of both matrices as V = [MT, MP, MH..]
  V = [(VT1+VT2)/2,(VP1+VP2)/2,(VH1+VH2)/2, ... ]
  
Step 8: Now V is the Predicted Variaon Factor

Step 9: Add V to the previous day’s weather condition to get RD's weather condition


#Technology Used

HTML5 and Angular JS

