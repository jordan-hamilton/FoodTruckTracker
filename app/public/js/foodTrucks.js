function bindAddButton() {
    document.getElementById('addFoodTruck').addEventListener('click', function (event) {
        event.preventDefault();

        // Set modal properties
        $('#newFoodTruck').on('show.bs.modal', function (event) {
            var modal = $(this);
            var title = 'Add a new food truck';
            var location = modal.find('#location');
            modal.find('.modal-title').text(title);
            modal.find('#name').val('');
            location.val('');
            location.removeClass('no-arrow');
            location.prop('disabled', false);
            modal.find('#description').val('');
            modal.find('#foodTruckId').val('');
            modal.find('#update').prop('checked', false);
        });
    });
}

function bindUpdateButtons() {
    const cards = document.getElementsByClassName('card-body');

    for (let i = 0; i < cards.length; i++) {
        let updateBtn = cards[i].getElementsByClassName('update');
        updateBtn[0].addEventListener('click', function (event) {
            event.preventDefault();
            const element = event.srcElement;
            const id = element.parentElement.parentElement.getAttribute('id');
            const card = document.getElementById(id);
            const name = card.getElementsByClassName('card-title')[0].textContent;
            const locId = card.firstChild.getAttribute('data-location')

            const description = card.getElementsByClassName('card-text')[0].textContent;

            // Set modal properties
            $('#newFoodTruck').on('show.bs.modal', function (event) {
                var modal = $(this);
                var title = 'Edit food truck information';
                var location = modal.find('#location');
                modal.find('.modal-title').text(title);
                modal.find('#name').val(name);
                location.val(locId);
                location.addClass('no-arrow');
                location.prop('disabled', true);
                modal.find('#description').val(description);
                modal.find('#foodTruckId').val(id);
                modal.find('#update').prop('checked', true);
            });
        });
    }
}


function bindSubmitButton() {
    document.getElementById('submit').addEventListener('click', function (event) {
        event.preventDefault();

        let request = new XMLHttpRequest();
        let payload = {};
        payload.name = document.getElementById('name').value;
        payload.description = document.getElementById('description').value;
        payload.location = document.getElementById('location').value;

        const id = document.getElementById('foodTruckId').value;
        const update = document.getElementById('update').checked;

        if (update) {
            request.open('PUT', '/api/food-trucks/' + id, true);
        } else {
            request.open('POST', '/api/food-trucks/', true);
        }

        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                $('#newFoodTruck').modal('hide');
                clearForm();
                createFoodTruckList();
            } else {
                console.error(`An error occurred: ${request.statusText}`);
            }
        });

        request.send(JSON.stringify(payload));
    });
}

function bindDeleteButtons() {
    const cards = document.getElementsByClassName('card-body');

    for (let i = 0; i < cards.length; i++) {
        let deleteBtn = cards[i].getElementsByClassName('delete');
        deleteBtn[0].addEventListener('click', function (event) {
            event.preventDefault();

            const element = event.srcElement;
            const id = element.parentElement.parentElement.getAttribute('id');

            let request = new XMLHttpRequest();
            request.open('DELETE', '/api/food-trucks/' + id, true);
            request.addEventListener('load', function () {
                if (request.status >= 200 && request.status < 400) {
                    createFoodTruckList();
                } else {
                    console.error(`An error occurred: ${request.statusText}`);
                }
            });

            request.send(null);
        });
    }
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('location').selectedIndex = 0;
}

function createLocationList() {
    let request = new XMLHttpRequest();
    request.open('GET', '/api/locations/', true);
    request.addEventListener('load', function () {
        if (request.status >= 200 && request.status < 400) {
            const response = JSON.parse(request.responseText);

            let locationList = document.getElementById('location');

            response.forEach(function (loc) {
                let location = document.createElement('option');
                location.setAttribute('value', loc.id);
                location.textContent = loc.name;
                locationList.appendChild(location);
            });
        } else {
            console.error(`An error occurred: ${request.statusText}`);
        }
    });

    request.send(null);
}


function createFoodTruckList() {
    let request = new XMLHttpRequest();
    request.open('GET', '/api/food-trucks', true);
    request.addEventListener('load', function () {
        if (request.status >= 200 && request.status < 400) {
            const response = JSON.parse(request.responseText);

            // build a card for each food truck
            let foodTruckList = document.getElementById('foodTruckList');
            foodTruckList.innerHTML = '';

            response.forEach(function (ft) {
                let card = document.createElement('div');
                card.setAttribute('id', ft.ft_id);
                card.setAttribute('class', 'card col-md-6');

                if (ft.loc_name != null) {
                    let map = document.createElement('img');
                    map.setAttribute('data-location', ft.rev_location);
                    map.setAttribute('class', 'img-fluid');
                    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?markers=\
                    ${ft.loc_address},${ft.loc_city}+${ft.loc_state}&zoom=14&size=600x300&format=PNG&maptype=\
                    roadmap&key=AIzaSyBueaHQo4UUWzFY9958zOy_qn5sWo3ODeo`;
                    map.setAttribute('src', mapUrl);
                    map.setAttribute('alt', ft.loc_name);
                    card.appendChild(map);
                } else {
                    const noMap = document.createElement('div');
                    noMap.setAttribute('data-location', '0');
                    noMap.setAttribute('class', 'loc-not-found py-4 text-secondary');
                    noMap.textContent = 'No location information available';
                    card.appendChild(noMap);
                }

                let cardBody = document.createElement('div');
                cardBody.setAttribute('class', 'card-body');
                card.appendChild(cardBody);

                let cardTitle = document.createElement('h4');
                cardTitle.setAttribute('class', 'card-title');
                cardTitle.textContent = ft.ft_name;
                cardBody.appendChild(cardTitle);

                let cardText = document.createElement('p');
                cardText.setAttribute('class', 'card-text');
                cardText.textContent = ft.ft_description;
                cardBody.appendChild(cardText);

                let updateBtn = document.createElement('button');
                updateBtn.setAttribute('class', 'update btn btn-outline-primary btn-sm float-right ml-2');
                updateBtn.setAttribute('data-toggle', 'modal');
                updateBtn.setAttribute('data-target', '#newFoodTruck');
                updateBtn.textContent = 'Update';
                cardBody.appendChild(updateBtn);

                let deleteBtn = document.createElement('button');
                deleteBtn.setAttribute('class', 'delete btn btn-outline-primary btn-sm float-right');
                deleteBtn.textContent = 'Delete';
                cardBody.appendChild(deleteBtn);

                foodTruckList.appendChild(card);
            });
        } else {
            console.error(`An error occurred: ${request.statusText}`);
        }

        bindUpdateButtons();
        bindDeleteButtons();
    });

    request.send(null);
}

document.addEventListener('DOMContentLoaded', function (event) {
    createLocationList();
    createFoodTruckList();
    bindAddButton();
    bindSubmitButton();
});

