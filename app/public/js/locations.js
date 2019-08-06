function bindSubmitButton() {
    document.getElementById('submit').addEventListener('click', function(event) {
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

        request.addEventListener('load', function() {
            if (request.status >= 200 && request.status < 400) {
                console.log(request.responseText);
                var locationAddr = document.createElement('address');
                locationAddr.setAttribute('class', 'col-sm-4');

                var addrName = document.createElement('strong');
                addrName.textContent = payload.name;
                locationAddr.appendChild(addrName);
                locationAddr.appendChild(document.createElement('br'));

                var addrLine = document.createElement('div');
                addrLine.setAttribute('class', 'addressLine');
                addrLine.textContent = payload.address;
                addrLine.appendChild(document.createElement('br'));
                locationAddr.appendChild(addrLine);

                var areaLine = document.createElement('div');
                areaLine.setAttribute('class', 'areaLine');
                areaLine.textContent = `${payload.city}, ${payload.state} ${payload.zip}`;
                locationAddr.appendChild(areaLine);

                document.getElementById('locationList').insertAdjacentElement('beforeend', locationAddr);
                $('#newLocation').modal('hide');
            } else {
                console.error(`An error occurred: ${request.statusText}`)
                //document.getElementById('result').textContent = 'An error occurred when attempting to add this location. Please ensure all values in the form above have been filled, then try again.'
            }
        });

        request.send(JSON.stringify(payload));
    });
}

document.addEventListener('DOMContentLoaded', function(event) {
    bindSubmitButton();
});