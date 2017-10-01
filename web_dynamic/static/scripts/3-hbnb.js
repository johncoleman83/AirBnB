const checkedItems = [];

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
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    data: '{}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (data) {
      loopData(data);
    },
    error: function (data) {
      console.log(data);
    }
  });
}

function loopData (data) {
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

$(document).ready(function () {
  checkStatus($('DIV#api_status'));
  amenCheck();
  generatePlaces();
});
