function bindSubmitButton() {
    document.getElementById('submit').addEventListener('click', function (event) {
        event.preventDefault();

        var request = new XMLHttpRequest();
        var payload = {};
        payload.name = document.getElementById('name').value;
        payload.address = document.getElementById('address').value;
        payload.city = document.getElementById('city').value;
        payload.state = document.getElementById('state').value;
        payload.zip = document.getElementById('zip').value;

        request.open('POST', '/api/locations', true);
        request.setRequestHeader('Content-Type', 'application/json');

        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                $('#newLocation').modal('hide');
                clearForm();
                createLocationList();
            } else {
                console.error(`An error occurred: ${request.statusText}`)
                //document.getElementById('result').textContent = 'An error occurred when attempting to add this location. Please ensure all values in the form above have been filled, then try again.'
            }
        });

        request.send(JSON.stringify(payload));
    });
}

function bindDeleteButtons() {
    const locations = document.getElementById('locationList').children;

    for (let i = 0; i < locations.length; i++) {
        let deleteBtn = locations[i].getElementsByClassName('delete');
        deleteBtn[0].addEventListener('click', function (event) {
            event.preventDefault();

            const element = event.srcElement;
            const id = element.parentElement.getAttribute('id');

            let request = new XMLHttpRequest();
            request.open('DELETE', '/api/locations/' + id, true);
            request.addEventListener('load', function () {
                if (request.status >= 200 && request.status < 400) {
                    createLocationList();
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
    document.getElementById('address').value = '';
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
    document.getElementById('zip').value = '';
}

function createLocationList() {
    let request = new XMLHttpRequest();
    request.open('GET', '/api/locations/', true);
    request.addEventListener('load', function () {
        if (request.status >= 200 && request.status < 400) {
            const response = JSON.parse(request.responseText);

            let locationList = document.getElementById('locationList');
            locationList.innerHTML = '';

            response.forEach(function (loc) {
                let location = document.createElement('address');
                location.setAttribute('id', loc.id);
                location.setAttribute('class', 'col-sm-4');
                locationList.appendChild(location);

                let name = document.createElement('div');
                name.setAttribute('class', 'addressName');
                name.textContent = loc.name;
                location.appendChild(name);

                let addressLine = document.createElement('div');
                addressLine.setAttribute('class', 'addressLine');
                addressLine.textContent = loc.address;
                location.appendChild(addressLine);

                let areaLine = document.createElement('div');
                areaLine.setAttribute('class', 'areaLine');
                areaLine.textContent = loc.city + ', ' + loc.state + ' ' + loc.zip;
                location.appendChild(areaLine);

                let deleteBtn = document.createElement('button');
                deleteBtn.setAttribute('class', 'delete btn btn-outline-primary btn-sm mt-2');
                deleteBtn.textContent = 'Delete';
                location.appendChild(deleteBtn);
            });
        } else {
            console.error(`An error occurred: ${request.statusText}`);
        }

        bindDeleteButtons();
    });

    request.send(null);
}

document.addEventListener('DOMContentLoaded', function (event) {
    createLocationList();
    bindSubmitButton();
});