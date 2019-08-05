function bindSubmitButton() {
    document.getElementById('submit').addEventListener('click', function(event) {
        event.preventDefault();

        var request = new XMLHttpRequest();
        var payload = {};
        payload.username = document.getElementById('username').value;
        payload.firstname = document.getElementById('firstname').value;
        payload.lastname = document.getElementById('lastname').value;
        payload.email = document.getElementById('email').value;
        payload.password = document.getElementById('password').value;

        request.open('POST', '/api/customers', true);
        request.setRequestHeader('Content-Type', 'application/json');

        request.addEventListener('load', function() {
            if (request.status >= 200 && request.status < 400) {
                console.log(request.responseText);
                var customerRow = document.createElement('tr');

                var usernameCell = document.createElement('td');
                usernameCell.textContent = payload.username;
                customerRow.appendChild(usernameCell);

                var firstnameCell = document.createElement('td');
                firstnameCell.textContent = payload.firstname;
                customerRow.appendChild(firstnameCell);

                var lastnameCell = document.createElement('td');
                lastnameCell.textContent = payload.lastname;
                customerRow.appendChild(lastnameCell);

                document.getElementById('customerList').insertAdjacentElement('beforeend', customerRow);
                $('#newCustomer').modal('hide');
            } else {
                console.error(`An error occurred: ${request.statusText}`)
                //document.getElementById('result').textContent = 'An error occurred when attempting to add this customer. Please ensure all values in the form above have been filled, then try again.'
            }
        });

        request.send(JSON.stringify(payload));
    });
}

document.addEventListener('DOMContentLoaded', function(event) {
    bindSubmitButton();
});