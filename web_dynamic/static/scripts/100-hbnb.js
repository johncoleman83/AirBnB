const checkedAmens = {};
const checkedStates = {};
const checkedCities = {};
const notFound = [
  '<h2 id="no_places_found">No places found :(</h2>',
  '<img src="static/images/guillaume.jpeg">'
];

function checkStatus () {
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    type: 'GET',
    success: function (data) {
      if (data.status === 'OK') {
        $('DIV#api_status').toggleClass('available');
      }
    },
    error: function (data) {
      console.log(data);
    }
  });
}

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

function appendStructure (place, userName, amenities, reviews) {
  let structure = [
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
    '<div class="user">',
    '<strong>Owner: ',
    userName,
    '</strong>',
    '</div>',
    '<DIV class="description">',
    '<STRONG>Description:</STRONG>',
    '<BR />',
    place.description,
    '<BR />',
    '</DIV>',
    '<div class="amenities">',
    '<h2>Amenities</h2>',
    '<ul>',
    amenities,
    '</ul>',
    '</div>',
    '<div class="reviews">',
    '<h2>Reviews</h2>',
    '<ul>',
    reviews,
    '</ul>', '</div>',
    '</article>'
  ];
  $(structure.join('')).appendTo($('.places'));
}

function getUserName (userId) {
  return $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/users/' + userId,
    type: 'GET'
  });
}

function buildAmenities (placeAmenities) {
  let amenities = [];
  for (let a in placeAmenities) {
    amenities.push('<li>' + placeAmenities[a] + '</li>');
  }
  return amenities.join('');
}

function buildReviews (placeReviews) {
  let reviews = [];
  for (let r in placeReviews) {
    reviews.push('<li>' + placeReviews[r].text + '</li>');
  }
  if (reviews.length === 0) {
    reviews.push('<li>No Reviews</li>');
  }
  return reviews.join('');
}

function loopData (data) {
  $('<h1>Places</h1>').appendTo($('.places'));
  for (let p in data) {
    let place = data[p];
    getUserName(place.user_id).done(
      function (data) {
        let userName = data.first_name + ' ' + data.last_name;
        let amenities = buildAmenities(place.amenities);
        let reviews = buildReviews(place.reviews);
        appendStructure(place, userName, amenities, reviews);
      }
    ).fail(
      function (data) {
        console.log(data);
      }
    );
  }
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
