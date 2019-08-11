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

                let areaLine = document.createElement('di');
                areaLine.setAttribute('class', 'areaLine');
                areaLine.textContent = loc.city + ',' + loc.state + ' ' + loc.zip;
                location.appendChild(areaLine);

                locationList.appendChild(location);
            });
        } else {
            console.error(`An error occurred: ${request.statusText}`);
        }
    });

    request.send(null);
}

document.addEventListener('DOMContentLoaded', function (event) {
    createLocationList();
    bindSubmitButton();
});