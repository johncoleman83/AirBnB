function remove (array, element) {
  const index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

const checkedItems = [];
$(document).ready(function () {
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
});
