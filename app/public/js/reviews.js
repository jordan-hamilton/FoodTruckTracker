function bindSubmitButton() {
    document.getElementById('submit').addEventListener('click', function(event) {
        event.preventDefault();

        // Get the text of the selected options, not their IDs, so we can append them directly to the table of reviews.
        var foodTruckSelector = document.getElementById('food_truck_id')
        var foodTruckText = foodTruckSelector.options[foodTruckSelector.selectedIndex].text;
        var locationSelector = document.getElementById('location_id')
        var locationText = locationSelector.options[locationSelector.selectedIndex].text;

        var request = new XMLHttpRequest();
        var payload = {};
        payload.customer = '1';
        payload.food_truck_id = document.getElementById('food_truck_id').value;
        payload.location_id = document.getElementById('location_id').value;
        payload.date = document.getElementById('date').value;
        payload.rating = document.getElementById('rating').value;
        payload.title = document.getElementById('title').value;
        payload.description = document.getElementById('description').value;

        request.open('POST', '/api/reviews', true);
        request.setRequestHeader('Content-Type', 'application/json');

        request.addEventListener('load', function() {
            if (request.status >= 200 && request.status < 400) {
                console.log(request.responseText);
                var reviewRow = document.createElement('td');
                //TODO: Add current customer to table (and to POST)

                var locationCell = document.createElement('tr');
                locationCell.textContent = locationText;
                //TODO: Add location to table

                var dateCell = document.createElement('tr');
                dateCell.textContent = payload.date;
                reviewRow.appendChild(dateCell);

                var ratingCell = document.createElement('tr');
                ratingCell.textContent = payload.rating;
                reviewRow.appendChild(ratingCell);

                var foodTruckCell = document.createElement('tr');
                foodTruckCell.textContent = foodTruckText;
                reviewRow.appendChild(foodTruckCell);

                var titleCell = document.createElement('tr');
                titleCell.textContent = payload.title;
                reviewRow.appendChild(titleCell);

                var descriptionCell = document.createElement('tr');
                descriptionCell.textContent = payload.description;
                reviewRow.appendChild(descriptionCell);

                document.getElementById('reviewList').insertAdjacentElement('beforeend', reviewRow);
                $('#newReview').modal('hide');
            } else {
                console.error(`An error occurred: ${request.statusText}`)
                //document.getElementById('result').textContent = 'An error occurred when attempting to add this review. Please ensure all values in the form above have been filled, then try again.'
            }
        });

        request.send(JSON.stringify(payload));
    });
}

document.addEventListener('DOMContentLoaded', function(event) {
    bindSubmitButton();
});