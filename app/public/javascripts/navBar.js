// Create a header element and navigation icons to include on every page using
// JavaScript to manipulate the DOM.
// All navigation icons are under the MIT license and provided by the Ionic Framework team
// (https://ionicons.com/)

function createLink(page) {
    var link = document.createElement('a');

    if (page == 'home') {
        link.setAttribute('href', '/');
    } else {
        link.setAttribute('href', `/${page}`);
    }

    var linkImg = document.createElement('img');
    linkImg.setAttribute('src', `./icons/${page}.svg`);
    link.appendChild(linkImg);

    return link;
}

function createNavBar() {

    var header = document.createElement('header');
    header.setAttribute('id', 'nav');

    header.appendChild(createLink('home'));
    header.appendChild(createLink('reviews'));
    header.appendChild(createLink('food-trucks'));
    header.appendChild(createLink('locations'));
    header.appendChild(createLink('customers'));

    return header;
}

// Display the navigation bar
document.getElementsByTagName('body')[0].insertAdjacentElement('afterbegin', createNavBar());

//export default createNavBar;
