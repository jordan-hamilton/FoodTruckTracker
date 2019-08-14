function bindAddButton() {
    document.getElementById('addLocation').addEventListener('click', function (event) {
        event.preventDefault();

        // Set modal properties
        $('#newLocation').on('show.bs.modal', function (event) {
            var modal = $(this);
            var title = 'Add a new location';
            modal.find('.modal-title').text(title);
            modal.find('#name').val('');
            modal.find('#address').val('');
            modal.find('#city').val('');
            modal.find('#state').val('');
            modal.find('#zip').val('');
            modal.find('#locationId').val('');
            modal.find('#update').prop('checked', false);
        });
    });
}

function bindUpdateButtons() {
    const locations = document.getElementById('locationList').children;

    for (let i = 0; i < locations.length; i++) {
        let updateBtn = locations[i].getElementsByClassName('update');
        updateBtn[0].addEventListener('click', function (event) {
            event.preventDefault();
            const element = event.srcElement;
            const id = element.parentElement.getAttribute('id');
            const location = document.getElementById(id);
            const name = location.getElementsByClassName('addressName')[0].textContent;
            const address = location.getElementsByClassName('addressLine')[0].textContent;
            const city = location.getElementsByClassName('city')[0].textContent;
            const state = location.getElementsByClassName('state')[0].textContent;
            const zip = location.getElementsByClassName('zip')[0].textContent;

            // Set modal properties
            $('#newLocation').on('show.bs.modal', function (event) {
                var modal = $(this);
                var title = 'Edit location information';
                modal.find('.modal-title').text(title);
                modal.find('#name').val(name);
                modal.find('#address').val(address);
                modal.find('#city').val(city);
                modal.find('#state').val(state);
                modal.find('#zip').val(zip);
                modal.find('#locationId').val(id);
                modal.find('#update').prop('checked', true);
            });
        });
    }
}

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

        const id = document.getElementById('locationId').value;
        const update = document.getElementById('update').checked;

        if (update) {
            request.open('PUT', '/api/locations/' + id, true);
        } else {
            request.open('POST', '/api/locations', true);
        }

        request.setRequestHeader('Content-Type', 'application/json');

        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                $('#newLocation').modal('hide');
                clearForm();
                createLocationList();
            } else {
                console.error(`An error occurred: ${request.statusText}`)
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

                let areaCity = document.createElement('span');
                areaCity.setAttribute('class', 'city');
                areaCity.textContent = loc.city;

                let comma = document.createElement('span');
                comma.textContent = ', ';

                let areaState = document.createElement('span');
                areaState.setAttribute('class', 'state');
                areaState.textContent = loc.state;

                let space = document.createElement('span');
                space.textContent = ' ';

                let areaZip = document.createElement('span');
                areaZip.setAttribute('class', 'zip');
                areaZip.textContent = loc.zip;

                areaLine.appendChild(areaCity);
                areaLine.appendChild(comma);
                areaLine.appendChild(areaState);
                areaLine.appendChild(space);
                areaLine.appendChild(areaZip);
                location.appendChild(areaLine);

                let deleteBtn = document.createElement('button');
                deleteBtn.setAttribute('class', 'delete btn btn-outline-primary btn-sm mt-2');
                deleteBtn.textContent = 'Delete';
                location.appendChild(deleteBtn);

                let updateBtn = document.createElement('button');
                updateBtn.setAttribute('class', 'update btn btn-outline-primary btn-sm mt-2 ml-2');
                updateBtn.setAttribute('data-toggle', 'modal');
                updateBtn.setAttribute('data-target', '#newLocation');
                updateBtn.textContent = 'Update';
                location.appendChild(updateBtn);
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
    bindSubmitButton();
});