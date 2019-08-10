function bindSubmitButton() {
    document.getElementById('submit').addEventListener('click', function (event) {
        event.preventDefault();

        let request = new XMLHttpRequest();
        let payload = {};
        payload.name = document.getElementById('name').value;
        payload.description = document.getElementById('description').value;
        payload.location = document.getElementById('location').value;

        request.open('POST', '/api/food-trucks/', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
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
        let deleteBtn = cards[i].getElementsByTagName('button');
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
    };
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('location').selectedIndex = 0;
}

function createLocationList() {
    let req = new XMLHttpRequest();
    req.open('GET', '/api/locations/', true);
    req.addEventListener('load', function () {
        if (req.status >= 200 && req.status < 400) {
            console.log(req.responseText);
            const res = JSON.parse(req.responseText);

            let locationList = document.getElementById('location');

            res.forEach(function (loc) {
                let location = document.createElement('option');
                location.setAttribute('value', loc.id);
                location.textContent = loc.name;
                locationList.appendChild(location);
            });
        } else {
            console.error(`An error occurred: ${req.statusText}`);
        }
    });

    req.send(null);
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

                let map = document.createElement('img');
                let mapUrl = `https://maps.googleapis.com/maps/api/staticmap?markers=\
                            ${ft.loc_address},${ft.loc_city}+${ft.loc_state}&zoom=14&size=600x300&format=PNG&maptype=\
                            roadmap&key=AIzaSyBueaHQo4UUWzFY9958zOy_qn5sWo3ODeo`;
                map.setAttribute('src', mapUrl);
                map.setAttribute('alt', ft.loc_name);

                let cardBody = document.createElement('div');
                cardBody.setAttribute('class', 'card-body');

                let cardTitle = document.createElement('h4');
                cardTitle.setAttribute('class', 'card-title');
                cardTitle.textContent = ft.ft_name;

                let cardText = document.createElement('p');
                cardText.setAttribute('class', 'card-text');
                cardText.textContent = ft.ft_description;

                let deleteBtn = document.createElement('button');
                deleteBtn.setAttribute('class', 'btn btn-outline-primary btn-sm')
                deleteBtn.textContent = 'Delete';

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                cardBody.appendChild(deleteBtn);
                card.appendChild(map);
                card.appendChild(cardBody);
                foodTruckList.appendChild(card);

                bindDeleteButtons();
            });
        } else {
            console.error(`An error occurred: ${request.statusText}`);
        }
    });

    request.send(null);
}

document.addEventListener('DOMContentLoaded', function (event) {
    createLocationList();
    createFoodTruckList();
    bindSubmitButton();
});

