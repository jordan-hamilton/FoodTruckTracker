function bindAddButton() {
    document.getElementById('relationshipButton').addEventListener('click', function(event) {
        event.preventDefault();

        let form = document.getElementById('relationshipForm');
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            form.classList.add('was-validated');
            return;
        }
        form.classList.add('was-validated');
        handleRelationship();
    });

    function handleRelationship() {
        var request = new XMLHttpRequest();
        var payload = {};

        payload.customer_id = document.getElementById('customer').value;
        payload.food_truck_id = document.getElementById('foodTruck').value;

        request.open('POST', '/api/customers-food-trucks', true);
        request.setRequestHeader('Content-Type', 'application/json');

        request.addEventListener('load', function() {
            if (request.status >= 200 && request.status < 400) {
                createRelationshipList();
            } else {
                console.error(`An error occurred: ${request.statusText}`);
                //document.getElementById('result').textContent = 'An error occurred when attempting to add this customer to a network. Please ensure all values in the form above have been filled, then try again.'
            }
        });

        request.send(JSON.stringify(payload));
    }
}

//TODO: Update for the add button (change the selected option)
function clearForm() {
    document.getElementById('food_truck_id').value = '';
    document.getElementById('location_id').value = '';
    document.getElementById('date').value = '';
    document.getElementById('rating').value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    let form = document.getElementById('relationshipForm');
    form.classList.remove('was-validated');
}

function createRelationship(ft, foodTruckCardRow) {
    handleFoodTruck(ft);

    function handleFoodTruck() {
        let request = new XMLHttpRequest();
        request.open('GET', `/api/customers/food-truck/${ft.ft_id}`, true);
        request.addEventListener('load', function () {
            if (request.status >= 200 && request.status < 400) {
                const response = JSON.parse(request.responseText);
                response.forEach(function(relationship) {
                    let relationshipCardBodyPane = document.createElement('div');
                    relationshipCardBodyPane.setAttribute('class', 'col-md-3 border border-primary');

                    let relationshipCardBody = document.createElement('div');
                    relationshipCardBody.setAttribute('class', 'card-body');
                    relationshipCardBodyPane.appendChild(relationshipCardBody);

                    let customerImage = document.createElement('img');
                    customerImage.setAttribute('src', './icons/customer.svg');
                    customerImage.setAttribute('class', 'customer-icon ml-3 float-left');
                    relationshipCardBody.appendChild(customerImage);

                    let relationshipCardBodyText = document.createElement('p');
                    relationshipCardBodyText.setAttribute('class','card-text');
                    relationshipCardBodyText.textContent = relationship.username;
                    relationshipCardBody.appendChild(relationshipCardBodyText);

                    foodTruckCardRow.appendChild(relationshipCardBodyPane);
                });
            } else {
                console.error(`An error occurred: ${request.statusText}`);
            }
        });
        request.send(null);
    }
    
}

function createRelationshipList() {
    let request = new XMLHttpRequest();
    request.open('GET', '/api/food-trucks', true);
    request.addEventListener('load', function () {
        if (request.status >= 200 && request.status < 400) {
            const response = JSON.parse(request.responseText);

            let relationshipList = document.getElementById('relationshipList');
            relationshipList.innerHTML = '';
            response.forEach(function(ft) {

                let foodTruck = document.createElement('div');
                foodTruck.setAttribute('class', 'card');

                let foodTruckHeader = document.createElement('div');
                foodTruckHeader.setAttribute('class', 'card-header');
                foodTruckHeader.setAttribute('id', ft.ft_id);
                foodTruck.appendChild(foodTruckHeader);

                let foodTruckTitle = document.createElement('h2');
                foodTruckTitle.setAttribute('class', 'mb-auto');
                foodTruckHeader.appendChild(foodTruckTitle);

                let foodTruckButton = document.createElement('button');
                foodTruckButton.setAttribute('class', 'btn btn-link');
                foodTruckButton.setAttribute('type', 'button');
                foodTruckButton.setAttribute('data-toggle', 'collapse');
                foodTruckButton.setAttribute('data-target', `#foodTruckBody${ft.ft_id}`);
                foodTruckButton.textContent = ft.ft_name;
                foodTruckTitle.appendChild(foodTruckButton);

                let foodTruckCard = document.createElement('div');
                foodTruckCard.setAttribute('id', `foodTruckBody${ft.ft_id}`);
                foodTruckCard.setAttribute('class', 'collapse show');
                foodTruckCard.setAttribute('data-parent', '#relationshipList');
                foodTruck.appendChild(foodTruckCard);

                let foodTruckCardRow = document.createElement('div');
                foodTruckCardRow.setAttribute('class', 'row no-gutters');
                foodTruckCard.appendChild(foodTruckCardRow);

                relationshipList.appendChild(foodTruck);
                createRelationship(ft, foodTruckCardRow);
            });
        } else {
            console.error(`An error occurred: ${request.statusText}`);
        }
    });

    request.send(null);
}


document.addEventListener('DOMContentLoaded', function(event) {
    createRelationshipList();
    bindAddButton();
});