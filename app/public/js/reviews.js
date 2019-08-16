function bindSubmitButton() {
    document.getElementById('submit').addEventListener('click', function (event) {
        event.preventDefault();

        let form = document.getElementById('modalForm');
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        form.classList.add('was-validated');
        handleReviews();
    });

    function handleReviews() {
        var request = new XMLHttpRequest();
        var payload = {};

        payload.customer = document.getElementById('customer_id').value;
        payload.food_truck_id = document.getElementById('food_truck_id').value;

        let loc_id = document.getElementById('location_id').value;

        if (loc_id == '') {
            payload.location_id = null;
        } else {
            payload.location_id = loc_id;
        }

        payload.date = document.getElementById('date').value;
        payload.rating = document.getElementById('rating').value;
        payload.title = document.getElementById('title').value;
        payload.description = document.getElementById('description').value;

        request.open('POST', '/api/reviews', true);
        request.setRequestHeader('Content-Type', 'application/json');

        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                handleCustomersFoodTrucks();
            } else {
                console.error(`An error occurred: ${request.statusText}`);
                //document.getElementById('result').textContent = 'An error occurred when attempting to add this review. Please ensure all values in the form above have been filled, then try again.'
            }
        });

        request.send(JSON.stringify(payload));
    }

    function handleCustomersFoodTrucks() {
        var request = new XMLHttpRequest();
        var payload = {};
        payload.customer_id = document.getElementById('customer_id').value;
        payload.food_truck_id = document.getElementById('food_truck_id').value;

        request.open('POST', '/api/customers-food-trucks', true);
        request.setRequestHeader('Content-Type', 'application/json');

        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                $('#newReview').modal('hide');
                clearForm();
                createReviewList('/api/reviews/');

                // Reset review filters after submitting a review, so a new review is always visible upon submission
                document.getElementById('resetFilterSection').setAttribute('hidden', 'hidden');
                document.getElementById('foodTruckFilterForm').removeAttribute('hidden');
                document.getElementById('minRatingFilterForm').removeAttribute('hidden');
                document.getElementById('usernameFilterForm').removeAttribute('hidden');

            } else {
                console.error(`An error occurred: ${request.statusText}`)
                //document.getElementById('result').textContent = 'An error occurred when attempting to add this review. Please ensure all values in the form above have been filled, then try again.'
            }
        });

        request.send(JSON.stringify(payload));
    }

}

function bindResetButton() {
    document.getElementById('resetFilters').addEventListener('click', function (event) {
        event.preventDefault();

        createReviewList('/api/reviews/');
        document.getElementById('resetFilterSection').setAttribute('hidden', 'hidden');
        document.getElementById('foodTruckFilterForm').removeAttribute('hidden');
        document.getElementById('minRatingFilterForm').removeAttribute('hidden');
        document.getElementById('usernameFilterForm').removeAttribute('hidden');

    });
}

function bindFoodTruckFilterButton() {
    document.getElementById('foodTruckFilterButton').addEventListener('click', function (event) {
        event.preventDefault();

        let form = document.getElementById('foodTruckFilterForm');
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        form.classList.add('was-validated');

        var foodTruckSelector = document.getElementById('foodTruckFilter');
        var foodTruckId = foodTruckSelector.options[foodTruckSelector.selectedIndex].value;

        createReviewList(`/api/reviews/food-truck/${foodTruckId}`);
        document.getElementById('resetFilterSection').removeAttribute('hidden');
        document.getElementById('minRatingFilterForm').setAttribute('hidden', 'hidden');
        document.getElementById('usernameFilterForm').setAttribute('hidden', 'hidden');

        // Remove the form validation status indicator after successfully filtering
        form.classList.remove('was-validated');
    });

}

function bindMinRatingFilterButton() {
    document.getElementById('minRatingFilterButton').addEventListener('click', function (event) {
        event.preventDefault();

        let form = document.getElementById('minRatingFilterForm');
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        form.classList.add('was-validated');

        var minRatingSelector = document.getElementById('minRatingFilter');
        var minRating = minRatingSelector.options[minRatingSelector.selectedIndex].value;

        createReviewList(`/api/reviews/rating/${minRating}`);
        document.getElementById('resetFilterSection').removeAttribute('hidden');
        document.getElementById('foodTruckFilterForm').setAttribute('hidden', 'hidden');
        document.getElementById('usernameFilterForm').setAttribute('hidden', 'hidden');

        // Remove the form validation status indicator after successfully filtering
        form.classList.remove('was-validated');
    });
}

function bindUsernameFilterButton() {
    document.getElementById('usernameFilterButton').addEventListener('click', function (event) {
        event.preventDefault();

        let form = document.getElementById('usernameFilterForm');
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        form.classList.add('was-validated');

        var customerId = document.getElementById('usernameFilter').value;

        createReviewList(`/api/reviews/customer/${customerId}`);
        document.getElementById('resetFilterSection').removeAttribute('hidden');
        document.getElementById('foodTruckFilterForm').setAttribute('hidden', 'hidden');
        document.getElementById('minRatingFilterForm').setAttribute('hidden', 'hidden');

        // Remove the form validation status indicator after successfully filtering
        form.classList.remove('was-validated');
    });
}

function bindCancelButtons() {
    document.getElementById('cancelButton').addEventListener('click', function(event) {
        let form = document.getElementById('modalForm');
        form.classList.remove('was-validated');
    });
    document.getElementById('closeButton').addEventListener('click', function(event) {
        let form = document.getElementById('modalForm');
        form.classList.remove('was-validated');
    });
}

function clearForm() {
    document.getElementById('food_truck_id').value = '';
    document.getElementById('location_id').value = '';
    document.getElementById('date').value = '';
    document.getElementById('rating').value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    let form = document.getElementById('modalForm');
    form.classList.remove('was-validated');
}

function createReview(rev, reviewList) {
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

    let date = document.createElement('h6');
    date.setAttribute('class', 'ml-3');
    date.textContent = rev.rev_date;
    reviewCardInfoPane.appendChild(date);

    let reviewCardBodyPane = document.createElement('div');
    reviewCardBodyPane.setAttribute('class', 'col-md-8');
    reviewCardRow.appendChild(reviewCardBodyPane);

    let reviewCardBody = document.createElement('div');
    reviewCardBody.setAttribute('class', 'card-body');
    reviewCardBodyPane.appendChild(reviewCardBody);

    let reviewCardBodyText = document.createElement('p');
    reviewCardBodyText.setAttribute('class', 'card-text');
    reviewCardBodyText.textContent = rev.rev_description;
    reviewCardBody.appendChild(reviewCardBodyText);

    reviewList.appendChild(review);

}

function createReviewList(endpoint) {
    let request = new XMLHttpRequest();
    request.open('GET', endpoint, true);
    request.addEventListener('load', function () {
        if (request.status >= 200 && request.status < 400) {
            const response = JSON.parse(request.responseText);

            let reviewList = document.getElementById('reviewList');
            reviewList.innerHTML = '';
            response.forEach(function (rev) {
                createReview(rev, reviewList)
            });
        } else {
            console.error(`An error occurred: ${request.statusText}`);
        }
    });

    request.send(null);
}

function setCreateButtonState() {
    if (isNaN(parseInt(document.getElementById('customer_id').value))) {

        // Disable the 'write a review' button if a customer ID wasn't stored in the form from the Handlebars context
        let newReviewButton = document.getElementById('newReviewButton');
        newReviewButton.setAttribute('disabled', 'disabled');
        newReviewButton.setAttribute('style', 'pointer-events: none;');

        // Make a wrapper around the button with a tooltip with instructions to create an account.
        let wrapper = document.createElement('span');
        wrapper.setAttribute('class', 'd-inline-block');
        wrapper.setAttribute('data-toggle', 'tooltip');
        wrapper.setAttribute('data-trigger', 'manual');
        wrapper.setAttribute('data-html', 'true');
        wrapper.setAttribute('title', 'Create a <a href=\"/customers\">customer account</a> to start writing reviews.');
        $(newReviewButton).wrap(wrapper);

        // Initialize and persist the tooltip
        $(function () {
            $('[data-toggle="tooltip"]').tooltip('show');
        })
    }
}

document.addEventListener('DOMContentLoaded', function (event) {
    createReviewList('/api/reviews/');
    setCreateButtonState();
    bindSubmitButton();
    bindResetButton();
    bindFoodTruckFilterButton();
    bindMinRatingFilterButton();
    bindUsernameFilterButton();
    bindCancelButtons();
});