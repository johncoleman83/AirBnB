const checkedAmens = {};

function amenCheck () {
  let allAmenInputs = $('.amenities INPUT');
  allAmenInputs.each(function () {
    $(this).change(function () {
      if ($(this).prop('checked')) {
        checkedAmens[this.name] = this.id;
        let itemsString = Object.keys(checkedAmens).join(', ');
        $('.amenities H4').text(itemsString);
      } else {
        delete checkedAmens[this.name];
        let itemsString = Object.keys(checkedAmens).join(', ');
        $('.amenities H4').text(itemsString);
      }
    });
  });
}

function checkStatus (statusSignal) {
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      if (!statusSignal.hasClass('available')) {
        statusSignal.toggleClass('available');
      }
    } else if (statusSignal.hasClass('available')) {
      statusSignal.toggleClass('available');
    }
  });
}

function generatePlaces () {
  console.log('request URL ');
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    data: JSON.stringify({'amenities': Object.values(checkedAmens)}),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      if (data.length > 0) {
        console.log(data.length);
        loopData(data);
      } else {
        $('<h2>No places found!</h2>').appendTo($('.places'));
      }
    },
    error: function (data) {
      console.log(data);
    }
  });
}

function loopData (data) {
  $('<h1>Places</h1>').appendTo($('.places'));
  for (let i in data) {
    let place = data[i];
    const structure = [
      '<article>',
      '<DIV class="title">',
      '<h2>', place.name, '</h2>',
      '<DIV class="price_by_night">',
      place.price_by_night,
      '</DIV>',
      '</DIV>',
      '<DIV class="information">',
      '<DIV class="max_guest">',
      '<i class="fa fa-users fa-3x" aria-hidden="true"></i>',
      '<br />',
      place.max_guest, ' Guests',
      '</DIV>',
      '<DIV class="number_rooms">',
      '<i class="fa fa-bed fa-3x" aria-hidden="true"></i>',
      '<br />',
      place.number_rooms, ' Bedrooms',
      '</DIV>',
      '<DIV class="number_bathrooms">',
      '<i class="fa fa-bath fa-3x" aria-hidden="true"></i>',
      '<br />',
      place.number_bathrooms, ' Bathroom',
      '</DIV>',
      '</DIV>',
      '<DIV class="description">',
      place.description,
      '</DIV>',
      '</article>'
    ];
    $(structure.join('')).appendTo($('.places'));
  }
}

function searchAmens () {
  $('button').click(function () {
    $('.places').empty();
    generatePlaces();
  });
}

$(document).ready(function () {
  checkStatus($('DIV#api_status'));
  amenCheck();
  searchAmens();
});
