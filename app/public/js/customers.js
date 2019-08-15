function bindAddButton() {
    document.getElementById('addCustomer').addEventListener('click', function (event) {
        event.preventDefault();

        // Set modal properties
        $('#newCustomer').on('show.bs.modal', function (event) {
            var modal = $(this);
            var title = 'Add a new customer';
            var password = modal.find('#password');
            modal.find('.modal-title').text(title);
            modal.find('#firstname').val('');
            modal.find('#lastname').val('');
            modal.find('#email').val('');
            modal.find('#username').val('');
            password.prop('disabled', false);
            password.val('');
            modal.find('#customerId').val('');
            modal.find('#update').prop('checked', false);
        });
    });
}

function bindUpdateButtons() {
    const customers = document.getElementById('customerList').children;

    for (let i = 0; i < customers.length; i++) {
        let updateBtn = customers[i].getElementsByClassName('update');
        updateBtn[0].addEventListener('click', function (event) {
            event.preventDefault();
            const element = event.srcElement;
            const id = element.parentElement.parentElement.getAttribute('id');

            const customer = document.getElementById(id);
            const firstname = customer.getElementsByClassName('firstname')[0].textContent;
            const lastname = customer.getElementsByClassName('lastname')[0].textContent;
            const email = customer.getElementsByClassName('email')[0].textContent;
            const username = customer.getElementsByClassName('username')[0].textContent;

            // Set modal properties
            $('#newCustomer').on('show.bs.modal', function (event) {
                var modal = $(this);
                var title = 'Edit customer information';
                var password = modal.find('#password');
                modal.find('.modal-title').text(title);
                modal.find('#firstname').val(firstname);
                modal.find('#lastname').val(lastname);
                modal.find('#email').val(email);
                modal.find('#username').val(username);
                password.prop('disabled', true);
                password.val('dummy_password');
                modal.find('#customerId').val(id);
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
        payload.username = document.getElementById('username').value;
        payload.firstname = document.getElementById('firstname').value;
        payload.lastname = document.getElementById('lastname').value;
        payload.email = document.getElementById('email').value;
        payload.password = document.getElementById('password').value;

        const id = document.getElementById('customerId').value;
        const update = document.getElementById('update').checked;

        if (update) {
            request.open('PUT', '/api/customers/' + id, true);
        } else {
            request.open('POST', '/api/customers', true);
        }

        request.setRequestHeader('Content-Type', 'application/json');

        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                $('#newCustomer').modal('hide');
                clearForm();
                createCustomerList();
            } else {
                console.error(`An error occurred: ${request.statusText}`)
            }
        });

        request.send(JSON.stringify(payload));
    });
}

function bindDeleteButtons() {
    const customers = document.getElementById('customerList').children;

    for (let i = 0; i < customers.length; i++) {
        let deleteBtn = customers[i].getElementsByClassName('delete');
        deleteBtn[0].addEventListener('click', function (event) {
            event.preventDefault();

            const element = event.srcElement;
            const id = element.parentElement.parentElement.getAttribute('id');

            let request = new XMLHttpRequest();
            request.open('DELETE', '/api/customers/' + id, true);
            request.addEventListener('load', function () {
                if (request.status >= 200 && request.status < 400) {
                    createCustomerList();
                } else {
                    console.error(`An error occurred: ${request.statusText}`);
                }
            });

            request.send(null);
        });
    }
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
                customer.setAttribute('id', cust.id);
                customerList.appendChild(customer);

                let firstname = document.createElement('td');
                firstname.setAttribute('class', 'firstname');
                firstname.textContent = cust.firstname;
                customer.appendChild(firstname);

                let lastname = document.createElement('td');
                lastname.setAttribute('class', 'lastname');
                lastname.textContent = cust.lastname;
                customer.appendChild(lastname);

                let username = document.createElement('td');
                username.setAttribute('class', 'username');
                customer.appendChild(username);
                username.textContent = cust.username;

                let email = document.createElement('td');
                email.setAttribute('class', 'email');
                customer.appendChild(email);
                email.textContent = cust.email;

                let actionCell = document.createElement('td');
                let deleteBtn = document.createElement('button');
                deleteBtn.setAttribute('class', 'delete btn btn-outline-primary btn-sm');
                deleteBtn.textContent = 'Delete';
                actionCell.appendChild(deleteBtn);

                let updateBtn = document.createElement('button');
                updateBtn.setAttribute('class', 'update btn btn-outline-primary btn-sm ml-2');
                updateBtn.setAttribute('data-toggle', 'modal');
                updateBtn.setAttribute('data-target', '#newCustomer');
                updateBtn.textContent = 'Update';
                actionCell.appendChild(updateBtn);

                customer.appendChild(actionCell);
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
    createCustomerList();
    bindAddButton();
    bindSubmitButton();
});