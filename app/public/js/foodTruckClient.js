const host = 'http://localhost:3000';    //'http://flip3.engr.oregonstate.edu:3188';

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
        req.open('DELETE', host + '/api/food-trucks/' + id, true);
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


