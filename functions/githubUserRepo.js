function requestUserRepos(username) {
    // create new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // gitHub endpoint, dynamically passing in specified username
    const url = `https://api.github.com/users/${username}/repos`;

    // using a GET request via URL endpoint
    // providing 3 arguments (GET/POST, the URL, async True/False)
    xhr.open('GET', url, true);

    // when request is received
    // process it here
    xhr.onload = function () {

        // parse API data into JSON
        const data = JSON.parse(this.response);

        // loop over each object in data array
        for (let i in data) {

            // get the ul with id of of userRepos
            let ul = document.getElementById('userRepos');

            // create variable that will create li's to be added to ul
            let li = document.createElement('li');

            // create the html markup for each li
            li.innerHTML = (`
                <p><strong>repo:</strong> ${data[i].name}</p>
                <p><strong>description:</strong> ${data[i].description}</p>
                <p><strong>URL:</strong> <a class="options" target="_blank" href="${data[i].html_url}">View</a></p>
                <hr>
            `);

            // append each li to the ul
            ul.appendChild(li);

        }

    }
    // send the request to the server
    xhr.send();

}

// calling the actual function
requestUserRepos('DarkenMo');
