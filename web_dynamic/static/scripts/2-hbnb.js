const checkedItems = [];
const statusSignal = $('DIV#api_status')

function remove (array, element) {
  const index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

function amenCheck () {
  let allAmenInputs = $('.amenities INPUT');
  allAmenInputs.each(function () {
    $(this).change(function () {
      if ($(this).prop('checked')) {
        checkedItems.push(this.name);
        let itemsString = checkedItems.join(', ');
        $('.amenities H4').text(itemsString);
      } else {
        remove(checkedItems, this.name);
        let itemsString = checkedItems.join(', ');
        $('.amenities H4').text(itemsString);
      }
    });
  });
}

function checkStatus () {
  console.log('function called');
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    console.log('passed get');
    //statusSignal.toggleClass('available');
    if (data.status === 'OK') {
      console.log('status OK');
      //statusSignal.toggleClass('available');
      if (statusSignal.hasClass('available') !== true) {
        console.log('This status signal: ' + statusSignal);
        console.log('statusSignal does not have class available');
        //statusSignal.toggleClass('available');
      }
    } else if (statusSignal.hasClass('available') === true) {
      console.log('else if statement reached');
      //statusSignal.toggleClass('available');
    }
  });
}

//statusSignal.toggleClass('available');

$(document).ready(function () {
  //checkStatus();
  amenCheck();
});

$('DIV#api_status').toggleClass('available');
