// Initialize Firebase
var config = {
  apiKey: "AIzaSyBfaDEK478wJsRDcCOSzycoHHm8win26Jg",
  authDomain: "train-schedule-52e71.firebaseapp.com",
  databaseURL: "https://train-schedule-52e71.firebaseio.com",
  projectId: "train-schedule-52e71",
  storageBucket: "train-schedule-52e71.appspot.com",
  messagingSenderId: "70271096650"
};
firebase.initializeApp(config);

// Reference database
var database = firebase.database();

var trainName = "";
var destination = "";
var firstTrain = 0;
var frequency = 0;
var currentTime= moment()

// Current Time
setInterval(function(){
        $("#current-time").html(moment(moment()).format("hh:mm:ss"));
    }, 1000);

// Submit Button to add new trains
$("#submit").on("click", function(event) {
  event.preventDefault();

	trainName = $("#trainName").val().trim();
	destination = $("#destination").val().trim();
	firstTrain = $("#firstTrain").val().trim();
	frequency = $("#frequency").val().trim();

// Resets form for new train
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrain").val("");
  $("#frequency").val("");

//Pushes to Firebase
  database.ref().push({

	    trainName: trainName,
	    destination: destination,
	    firstTrain: firstTrain,
	    frequency: frequency

	});
});

database.ref().on("child_added", function(childSnapshot) {

//calculations needed

	var firstTimeConverted = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "days");
 	var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
    //console.log("Time Difference: " + timeDiff);

    var remainder = timeDiff % childSnapshot.val().frequency;
    //console.log("Remaining Time: " + remainder);

    var minsUntilTrain = childSnapshot.val().frequency - remainder;
    //console.log("Train coming in : " + minsUntilTrain);
    
    var nextTrainTime = moment().add(minsUntilTrain, "minutes");
    //console.log("Next Train: " + moment(nextTrainTime).format("hh:mm"));
  		

// Add train data to table
    $("#schedule > tbody").append("<tr><td>" + childSnapshot.val().trainName + "</td><td>" + childSnapshot.val().destination + "</td><td>" +
        childSnapshot.val().frequency + "</td><td>" + moment(nextTrainTime).format("hh:mm") + "</td><td>" + minsUntilTrain + "</td></tr>");

// Handle the errors
    }, function(e) {
      console.log("Error: " + e.code);

});
