function bindSubmitButton() {
    document.getElementById('submit').addEventListener('click', function(event) {
        event.preventDefault();

        let request = new XMLHttpRequest();
        let payload = {};
        payload.name = document.getElementById('name').value;
        payload.description = document.getElementById('description').value;
        payload.location = document.getElementById('location').value;

        request.open('POST', '/api/food-trucks', true);
        request.setRequestHeader('Content-Type', 'application/json');

        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                const response = JSON.parse(request.responseText);

                let foodTruckList = document.getElementById('foodTruckList');

                let card = document.createElement('div');
                card.setAttribute('class', 'card col-md-6');

                let map = document.createElement('img');
                // TODO: Need to call get location api to build the correct image URL
                map.setAttribute('src', 'https://maps.googleapis.com/maps/api/staticmap?markers=235%209th%20Ave.%20N.,Seattle+WA&zoom=14&size=600x300&format=PNG&maptype=roadmap&key=AIzaSyBueaHQo4UUWzFY9958zOy_qn5sWo3ODeo');
                map.setAttribute('class', 'card-img-top');
                map.setAttribute('alt', 'location map');

                let cardBody = document.createElement('div');
                cardBody.setAttribute('id', response.insertId);
                cardBody.setAttribute('class', 'card-body');

                let cardTitle = document.createElement('h4');
                cardTitle.setAttribute('class', 'card-title');
                cardTitle.textContent = payload.name;

                let cardText = document.createElement('p');
                cardText.setAttribute('class', 'card-text');
                cardText.textContent = payload.description;

                let deleteBtn = document.createElement('button');
                deleteBtn.setAttribute('class', 'btn btn-outline-primary btn-sm')
                deleteBtn.textContent = 'Delete';

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                cardBody.appendChild(deleteBtn);

                card.appendChild(map);
                card.appendChild(cardBody);

                foodTruckList.appendChild(card);

                // TODO: fix button binding
                bindDeleteButtons();
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
            const id = element.getAttribute('id').split('-')[1];

            // Delete a food truck entry
            // TODO: Fix unhandled promise rejection warning
            let request = new XMLHttpRequest();
            request.open('DELETE', '/api/food-trucks/' + id, true);
            request.addEventListener('load', function() {
                if (request.status >= 200 && request.status < 400) {
                    const card = document.getElementById(id);
                    card.parentNode.removeChild(card);
                } else {
                    console.error(`An error occurred: ${request.statusText}`);
                }
            });
            
            request.send(null);
        });
    };
}

document.addEventListener('DOMContentLoaded', function(event) {
    bindSubmitButton();
    bindDeleteButtons();
});

