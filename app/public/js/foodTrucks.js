/*
const cards = document.getElementsByClassName('card-body');

for (let i = 0; i < cards.length; i++) {
    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('class', 'btn btn-primary')
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', function (event) {
        const elem = event.srcElement;
        const id = elem.parentElement.parentElement.getAttribute('id');

        // Delete a food truck entry
        let req = new XMLHttpRequest();
        req.open('DELETE', '/api/food-trucks/' + id, true);
        req.addEventListener('load', function () {
            if (req.status >= 200 && req.status < 400) {
                console.log(`Deleted ID: ${id}`);
                location.reload();
            } else {
                console.log('Request error: ' + req.statusText);
            }
        });

        req.send(null);
        event.preventDefault();
    });
    cards[i].appendChild(deleteBtn);
};
*/

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

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);

                card.appendChild(map);
                card.appendChild(cardBody);

                foodTruckList.appendChild(card);

            } else {
                console.error(`An error occurred: ${request.statusText}`);
            }
        });

        request.send(JSON.stringify(payload));
    });
}

document.addEventListener('DOMContentLoaded', function(event) {
    bindSubmitButton();
});

