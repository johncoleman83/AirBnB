const checkedAmens = {};
const checkedStates = {};
const checkedCities = {};
const notFound = [
  '<h2 id="no_places_found">No places found :(</h2>',
  '<img src="static/images/guillaume.jpeg">'
];

function updateHeader (headerVal) {
  if (headerVal === 'states-cities') {
    let statesString = Object.keys(checkedStates).join(', ');
    let citiesString = Object.keys(checkedCities).join(', ');
    let hString = statesString + ' ' + citiesString;
    $('.locations H4').text(hString);
  } else {
    let hString = Object.keys(checkedAmens).join(', ');
    $('.amenities H4').text(hString);
  }
}

function stateCityCheck () {
  let allStatesInput = $('.locations UL H2 INPUT');
  let allCitiesInput = $('.locations UL UL LI INPUT');

  allStatesInput.each(function () {
    $(this).change(function () {
      if ($(this).prop('checked')) {
        checkedStates[this.name] = this.id;
        updateHeader('states-cities');
      } else {
        delete checkedStates[this.name];
        updateHeader('states-cities');
      }
    });
  });

  allCitiesInput.each(function () {
    $(this).change(function () {
      if ($(this).prop('checked')) {
        checkedCities[this.name] = this.id;
        updateHeader('states-cities');
      } else {
        delete checkedCities[this.name];
        updateHeader('states-cities');
      }
    });
  });
}

function amenCheck () {
  let allAmenInputs = $('.amenities INPUT');
  allAmenInputs.each(function () {
    $(this).change(function () {
      if ($(this).prop('checked')) {
        checkedAmens[this.name] = this.id;
        updateHeader('amenities');
      } else {
        delete checkedAmens[this.name];
        updateHeader('amenities');
      }
    });
  });
}

function checkStatus () {
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    type: 'GET',
    success: function (data) {
      if (data.status === 'OK')
        $('DIV#api_status').toggleClass('available');
    },
    error: function (data) {
      console.log(data);
    }
  });
}

function generatePlaces () {
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    data: JSON.stringify({
      'states': Object.values(checkedStates),
      'cities': Object.values(checkedCities),
      'amenities': Object.values(checkedAmens)
    }),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      if (data.length > 0) {
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
      '$' + place.price_by_night,
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
  stateCityCheck();
  searchButton();
});
