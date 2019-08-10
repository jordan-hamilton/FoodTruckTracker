function bindSubmitButton() {
    document.getElementById('submit').addEventListener('click', function (event) {
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

        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                $('#newCustomer').modal('hide');
                clearForm();
                createCustomerList();
            } else {
                console.error(`An error occurred: ${request.statusText}`)
                //document.getElementById('result').textContent = 'An error occurred when attempting to add this customer. Please ensure all values in the form above have been filled, then try again.'
            }
        });

        request.send(JSON.stringify(payload));
    });
}

function clearForm() {
    document.getElementById('firstname').value = '';
    document.getElementById('lastname').value = '';
    document.getElementById('firstname').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function createCustomerList() {
    let request = new XMLHttpRequest();
    request.open('GET', '/api/customers/', true);
    request.addEventListener('load', function () {
        if (request.status >= 200 && request.status < 400) {
            const response = JSON.parse(request.responseText);

            let customerList = document.getElementById('customerList');
            customerList.innerHTML = '';

            response.forEach(function (cust) {
                let customer = document.createElement('tr');

                let lastname = document.createElement('td');
                lastname.textContent = cust.lastname;

                let firstname = document.createElement('td');
                firstname.textContent = cust.firstname;

                let username = document.createElement('td');
                username.textContent = cust.username;

                let email = document.createElement('td');
                email.textContent = cust.email;

                customer.appendChild(lastname);
                customer.appendChild(firstname);
                customer.appendChild(username);
                customer.appendChild(email);
                customerList.appendChild(customer);
            });
        } else {
            console.error(`An error occurred: ${request.statusText}`);
        }
    });

    request.send(null);
}

document.addEventListener('DOMContentLoaded', function (event) {
    createCustomerList();
    bindSubmitButton();
});