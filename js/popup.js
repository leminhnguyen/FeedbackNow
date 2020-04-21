chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      console.log(firstHref);
    }
  }
);

var weekdays = {
  "Sun": 0,
  "Mon": 1,
  "Tue": 2,
  "Wed": 3,
  "Thu": 4,
  "Fri": 5,
  "Sat": 6
}
var rows = [];
$(document).ready(function(){

  // setup global table_data variable
  table_data = JSON.parse(localStorage.getItem(`table_data`));
  if (! table_data){
    table_data = [];
  }

  let table =  $("#subject-calendar");
  showTable(table);

  $("#clear-all").click(function(){
    $("#subject-calendar tbody tr").remove();
    table_data = [];
    localStorage.setItem(`table_data`, JSON.stringify(table_data));
  });

  $("#new").click(function(){
    let body = table.find("tbody");
    numRows = body.find("tr").length;
    // add new row
    //<td><input id="timepicker" width="120" type="text" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1"></td>
    // $('#timepicker').timepicker({
    //   uiLibrary: 'bootstrap4'
    // });
    body.append(
      `<tr id="row-${numRows+1}">
      <th scope='row' style="padding-top: 20px;">${numRows+1}</th>
      <td><input id="input-subject-${numRows+1}" style="width: 10rem" type="text" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1"></td>
      <td><input id="input-endtime-${numRows+1}" style="width: 4rem" type="text" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1"></td>
      <td>
        <div class="dropdown">
          <input id="input-dow-${numRows+1}" data-toggle="dropdown" type="text" style="width: 4rem" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1">
          <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
            <button class="dropdown-item dropdown-item-${numRows+1}" type="button">Mon</button>
            <button class="dropdown-item dropdown-item-${numRows+1}" type="button">Tue</button>
            <button class="dropdown-item dropdown-item-${numRows+1}" type="button">Wed</button>
            <button class="dropdown-item dropdown-item-${numRows+1}" type="button">Thu</button>
            <button class="dropdown-item dropdown-item-${numRows+1}" type="button">Fri</button>
            <button class="dropdown-item dropdown-item-${numRows+1}" type="button">Sat</button>
            <button class="dropdown-item dropdown-item-${numRows+1}" type="button">Sun</button>
          </div>
        </div>
      </td>
      <td>
      <button id="save-${numRows+1}" type="button" class="btn btn-success">Save</button>
      <button id="remove-${numRows+1}" type="button" class="btn btn-danger">Remove</button>
      </td>
      </tr>`
    );
    
    //$("#body")[0].style.minHeight="400px";
    // save row
    row = {
      index: numRows+1,
      id_subject: `input-subject-${numRows+1}`,
      id_endtime: `input-endtime-${numRows+1}`,
      id_dow: `input-dow-${numRows+1}`,
      btnSave: {id: `save-${numRows+1}`},
      btnRemove: {id: `remove-${numRows+1}`},
      btnEdit: {id: `edit-${numRows+1}`}
    }

    rows.push(row);
    for(r of rows){
      onAddRow(row);
    }
  });
});

function showTable(table){
  let body = table.find("tbody");
  let table_data = JSON.parse(localStorage.getItem(`table_data`));
  if (!table_data){
    return;
  }
  for (const [i, row] of table_data.entries()){
    body.append(
      `<tr>
      <th scope='row' style="padding-top: 20px;">${i+1}</th>
      <td><input id="input-subject-${i+1}" value="${row.subject}"  disabled style="width: 10rem" type="text" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1"></td>
      <td><input id="input-endtime-${i+1}" value="${row.endtime}" disabled style="width: 4rem" type="text" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1"></td>
      <td>
        <div class="dropdown">
          <input id="input-dow-${i+1}" value="${row.dow}" disabled data-toggle="dropdown" type="text" style="width: 4rem" class="form-control" placeholder="" aria-label="" aria-describedby="basic-addon1">
          <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
            <button class="dropdown-item dropdown-item-${i+1}" type="button">Mon</button>
            <button class="dropdown-item dropdown-item-${i+1}" type="button">Tue</button>
            <button class="dropdown-item dropdown-item-${i+1}" type="button">Wed</button>
            <button class="dropdown-item dropdown-item-${i+1}" type="button">Thu</button>
            <button class="dropdown-item dropdown-item-${i+1}" type="button">Fri</button>
            <button class="dropdown-item dropdown-item-${i+1}" type="button">Sat</button>
            <button class="dropdown-item dropdown-item-${i+1}" type="button">Sun</button>
          </div>
        </div>
      </td>
      <td>
      <button id="edit-${i+1}" style="width: 62px;" type="button" class="btn btn-success">Edit</button>
      <button id="remove-${i+1}" type="button" class="btn btn-danger">Remove</button>
      </td>
      </tr>`
    );

    r = {
      index: i+1,
      id_subject: `input-subject-${i+1}`,
      id_endtime: `input-endtime-${i+1}`,
      id_dow: `input-dow-${i+1}`,
      timeoutID: `${row.timeoutID}`,
      btnSave: {id: `save-${i+1}`},
      btnRemove: {id: `remove-${i+1}`},
      btnEdit: {id: `edit-${i+1}`}
    }
    onRemoveRow(r);
    onEditRow(r);
  }

}

function onAddRow(row){
  $(`.dropdown-item-${row.index}`).off().click(function (){
    $(`#input-dow-${row.index}`).val(this.textContent);
  });
  onRemoveRow(row);
  onSaveRow(row);
}

function onEditRow(row){
  let btnEdit = $(`#${row.btnEdit.id}`);
  
  btnEdit.off().click(function(){
    $(`#${row.id_subject}`).prop('disabled', false);
    $(`#${row.id_endtime}`).prop('disabled', false);
    $(`#${row.id_dow}`).prop('disabled', false);
    $(`.dropdown-item-${row.index}`).off().click(function (){
      $(`#input-dow-${row.index}`).val(this.textContent);
    });
    btnEdit.attr('id', `save-${row.index}`);
    btnEdit.text("Save");
    onSaveRow(row);
  });
  
}

function onSaveRow(row){
  //setTimeout(function() { alert("my message"); }, 5000);
  let btnSave = $(`#${row.btnSave.id}`);
  btnSave.off().click(function(){
    // get subject's name and endtime
    let subject = $(`#${row.id_subject}`).val();
    let endtime = $(`#${row.id_endtime}`).val();
    let dow = $(`#${row.id_dow}`).val();
    if (!subject || !endtime){
      //$('#modal-alert').modal();
      //$("#body")[0].style.minHeight="400px";
      alert("You must set values for subject and endtime");
      return;
    }

    // setup alert
    var now = new Date();
    // if dow is today (as day of week)
    let timeoutID;
    if (weekdays[dow] == now.getDay()){
      let subject = $(`#${row.id_subject}`).val();
      chrome.runtime.sendMessage({type: "set", endtime: endtime, message: `You have ${subject} need to feedback`}, function(response) {
        timeoutID = response.timeoutID;
        row.timeoutID = timeoutID;
        console.log(timeoutID);
      });
    }

    // save to localStorage
    let tmp = table_data.filter(function(obj){
      return obj.subject !== subject;
    });
    tmp.push({subject: subject, endtime: endtime, dow: dow, timeoutID: timeoutID});
    table_data = tmp;
    localStorage.setItem(`table_data`, JSON.stringify(table_data));

    // disable the input
    $(`#${row.id_subject}`).attr("disabled", true);
    $(`#${row.id_endtime}`).attr("disabled", true);
    $(`#${row.id_dow}`).attr("disabled", true);
    btnSave.attr('id', `edit-${row.index}`);
    btnSave.text("Edit");
    onEditRow(row); 

    alert(`You've set timer for subject ${subject} at ${endtime} - ${dow} every week`);
  });
}

function onRemoveRow(row){
  let btnRemove = $(`#${row.btnRemove.id}`);
  
  btnRemove.off().click(function(){
    let subject = $(`#${row.id_subject}`).val();
    let tmp = JSON.parse(localStorage.getItem(`table_data`));
    table_data = tmp.filter(function(obj){
      return obj.subject !== subject;
    })
    localStorage.setItem(`table_data`, JSON.stringify(table_data));
    btnRemove.parentsUntil("tbody").remove();
    
    let dow = $(`#${row.id_dow}`).val();
    // clear alert
    var now = new Date();
    // if dow is today (as day of week)
    if (weekdays[dow] == now.getDay()){
      if (r.timeoutID){
        chrome.runtime.sendMessage({type: "clear", timeoutID: r.timeoutID}, function(response) {
          console.log("cleared alert");
        });
      }
    }
  });
  row.btnRemove.onclick = true;
}

