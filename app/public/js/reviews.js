function bindSubmitButton() {
    document.getElementById('submit').addEventListener('click', function(event) {
        event.preventDefault();

        let form = document.getElementById('modalForm');
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        form.classList.add('was-validated');

        // Get the text of the selected options, not their IDs, so we can append them directly to the table of reviews.
        var foodTruckSelector = document.getElementById('food_truck_id');
        var foodTruckText = foodTruckSelector.options[foodTruckSelector.selectedIndex].text;
        var locationSelector = document.getElementById('location_id');
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
                $('#newReview').modal('hide');
                clearForm();
                createReviewList();
            } else {
                console.error(`An error occurred: ${request.statusText}`)
                //document.getElementById('result').textContent = 'An error occurred when attempting to add this review. Please ensure all values in the form above have been filled, then try again.'
            }
        });

        request.send(JSON.stringify(payload));
    });
}

function clearForm() {
    document.getElementById('food_truck_id').value = '';
    document.getElementById('location_id').value = '';
    document.getElementById('date').value = '';
    document.getElementById('rating').value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
}

function createReviewList() {
    let request = new XMLHttpRequest();
    request.open('GET', '/api/reviews/', true);
    request.addEventListener('load', function () {
        if (request.status >= 200 && request.status < 400) {
            const response = JSON.parse(request.responseText);

            let reviewList = document.getElementById('reviewList');
            reviewList.innerHTML = '';

            response.forEach(function (rev) {
                let review = document.createElement('div');
                review.setAttribute('class', 'card');

                let reviewHeader = document.createElement('div');
                reviewHeader.setAttribute('class', 'card-header');
                reviewHeader.setAttribute('id', rev.rev_id);
                review.appendChild(reviewHeader);

                let reviewTitle = document.createElement('h2');
                reviewTitle.setAttribute('class', 'mb-auto');
                reviewHeader.appendChild(reviewTitle);

                let reviewButton = document.createElement('button');
                reviewButton.setAttribute('class', 'btn btn-link');
                reviewButton.setAttribute('type', 'button');
                reviewButton.setAttribute('data-toggle', 'collapse');
                reviewButton.setAttribute('data-target', `#reviewBody${rev.rev_id}`);
                reviewButton.textContent = rev.rev_title;
                reviewTitle.appendChild(reviewButton);

                let reviewCard = document.createElement('div');
                reviewCard.setAttribute('id', `reviewBody${rev.rev_id}`);
                reviewCard.setAttribute('class', 'collapse show');
                reviewCard.setAttribute('data-parent', '#reviewList');
                review.appendChild(reviewCard);

                let reviewCardRow = document.createElement('div');
                reviewCardRow.setAttribute('class', 'row no-gutters');
                reviewCard.appendChild(reviewCardRow);

                let reviewCardInfoPane = document.createElement('div');
                reviewCardInfoPane.setAttribute('class', 'col-md-4');
                reviewCardRow.appendChild(reviewCardInfoPane);

                let customerImage = document.createElement('img');
                customerImage.setAttribute('src', './icons/customer.svg');
                customerImage.setAttribute('class', 'customer-icon ml-3 float-left');
                reviewCardInfoPane.appendChild(customerImage);

                let customerName = document.createElement('span');
                customerName.setAttribute('class', 'ml-1');
                customerName.textContent = rev.cust_username;
                reviewCardInfoPane.appendChild(customerName);

                let rating = document.createElement('p');
                rating.setAttribute('class', 'mx-auto');
                for (var i = 0; i < rev.rev_rating; i++) {
                    var star = document.createElement('img');
                    star.setAttribute('src', './icons/star.svg');
                    star.setAttribute('class', 'rating-icon img-fluid');
                    rating.appendChild(star);
                }
                reviewCardInfoPane.appendChild(rating);

                let foodTruck = document.createElement('h5');
                foodTruck.setAttribute('class', 'ml-3');
                foodTruck.textContent = rev.ft_vendor;
                reviewCardInfoPane.appendChild(foodTruck);

                let location = document.createElement('h6');
                location.setAttribute('class', 'ml-3');
                location.textContent = rev.loc_location;
                reviewCardInfoPane.appendChild(location);

                let reviewCardBodyPane = document.createElement('div');
                reviewCardBodyPane.setAttribute('class', 'col-md-8');
                reviewCardRow.appendChild(reviewCardBodyPane);

                let reviewCardBody = document.createElement('div');
                reviewCardBody.setAttribute('class', 'card-body');
                reviewCardBodyPane.appendChild(reviewCardBody);

                let reviewCardBodyText = document.createElement('p');
                reviewCardBodyText.setAttribute('class','card-text');
                reviewCardBodyText.textContent = rev.rev_description;
                reviewCardBody.appendChild(reviewCardBodyText);

                reviewList.appendChild(review);

            });
        } else {
            console.error(`An error occurred: ${request.statusText}`);
        }
    });

    request.send(null);
}

document.addEventListener('DOMContentLoaded', function(event) {
    createReviewList();
    bindSubmitButton();
});