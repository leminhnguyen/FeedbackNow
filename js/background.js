// chrome.tabs.onCreated.addListener(function (tab) {
//   var newURL = "http://stackoverflow.com/";
//   chrome.tabs.create({ url: newURL });
// })

var weekdays = {
  "Sun": 0,
  "Mon": 1,
  "Tue": 2,
  "Wed": 3,
  "Thu": 4,
  "Fri": 5,
  "Sat": 6
}

chrome.runtime.onStartup.addListener(function() {
  table_data = localStorage.getItem(`table_data`);
  if (!table_data){
    table_data = [];
  }
  var dow;
  var timeoutID;
  var now = new Date();
  for (const [i, row] of table_data.entries()){
    dow = row.dow;
    if (weekdays[dow] == now.getDay()){
      timeoutID = setAlertFeedback(`You have ${row.subject} need to feedback`, row.endtime);
      let tmp = table_data.filter(function(obj){
        return obj.subject !== subject;
      });
      tmp.push({subject: subject, endtime: endtime, dow: dow, timeoutID: timeoutID});
      table_data = tmp;
      localStorage.setItem(`table_data`, JSON.stringify(table_data));
    }
  }
  console.log(table_data);
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === "set"){
      let timeoutID = setAlertFeedback(request.message, request.endtime);
      console.log(`set alert ${timeoutID}`);
      sendResponse({timeoutID: timeoutID});
    }else{
      if (request.type === "clear"){
        let timeoutID = request.timeoutID;
        console.log(`clear alert ${timeoutID}`);
        clearAlertFeedback(timeoutID);
      }
    }
  }
);


function setAlertFeedback(message, endtime){
  let et_hour = endtime.split(':')[0];
  let et_min = endtime.split(':')[1];
  let now = new Date();
  let millisTillAlert = new Date(now.getFullYear(), now.getMonth(), now.getDate(), et_hour, et_min, 0, 0) - now;

  // if it's before endtime
  if (millisTillAlert > 0){
    timeoutID = setTimeout(function (){ myAlert(message) }, millisTillAlert);
    return timeoutID;
  }else{ // not set alert
    return;
  }
}

function clearAlertFeedback(timeoutID){
  window.clearTimeout(timeoutID);
}


function myAlert(message){
  if(window.confirm(`${message}` + "\nGo to feedback page right now ?")){
    chrome.tabs.create({ url: "https://qldt.hust.edu.vn/student.html"});
  }
}
