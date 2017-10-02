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

$(window).on('load', function () {
checkStatus();
amenCheck();
});
