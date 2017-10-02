const checkedAmens = {};
const notFound = [
  '<h2 id="no_places_found">No places found :(</h2>',
  '<img src="static/images/guillaume.jpeg">'
];

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

function checkStatus () {
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    type: 'GET',
    success: function (data) {
      if (data.status === 'OK') {
        if (!$('DIV#api_status').hasClass('available')) {
          $('DIV#api_status').toggleClass('available');
        }
      } else if ($('DIV#api_status').hasClass('available')) {
        $('DIV#api_status').toggleClass('available');
      }
    },
    error: function (data) {
      console.log(data);
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
        $(notFound.join('')).appendTo($('.places'));
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

function searchButton () {
  $('button').click(function () {
    $('.places').empty();
    generatePlaces();
  });
}

$(window).on('load', function () {
  checkStatus();
  amenCheck();
  searchButton();
});
