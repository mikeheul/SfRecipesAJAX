document.addEventListener('DOMContentLoaded', function () {
    var loadButton = document.getElementById('load-recipes');
    var container = document.getElementById('recipe-container');
    var spinner = document.createElement('img');
    spinner.src = './img/logo.svg'; // Set the path to your spinner image
    spinner.className = 'spinner-logo';
    spinner.setAttribute('alt', 'Spinner');
    spinner.setAttribute('role', 'status');

    loadButton.addEventListener('click', function () {
        
        // display spinner
        spinner.style.display = 'block';
        // disable button loading recipes
        loadButton.setAttribute('disabled', 'true');

        // spinner displays during 1/2 second
        setTimeout(function () {
            // fetch API themealdb.com
            fetch('/api/recipes')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    // return JSON response
                    return response.json();
                })
                .then(recipe => {
                    // display random recipe
                    displayRecipe(recipe[0]);
                })
                .catch(error => {
                    console.error('Error fetching recipes:', error);
                })
                .finally(() => {
                    // hide spinner after loading
                    spinner.style.display = 'none';
                    loadButton.removeAttribute('disabled');
                });
        }, 500);
    });

    function displayRecipe(recipe) {
        // clear previous content
        container.innerHTML = ''; 
        var recipeDiv = document.createElement('div');
        // recipe name
        recipeDiv.innerHTML += '<h3>' + recipe.name + '</h3><ul>' +
        // loop ingredients
        recipe.ingredients.map(function (ingredient) {
            return '<li>' + ingredient + '</li>';
        }).join('') +
        '</ul>';
        // country + image
        recipeDiv.innerHTML += '<p>Area : ' + recipe.area + '</p><img class="thumb" src="' + recipe.thumb + '" />'
        // description
        recipeDiv.innerHTML += '<p class="recipe-desc">' + recipe.description + '</p>'
        container.appendChild(recipeDiv);
    }

    // append the spinner to the button
    loadButton.parentNode.insertBefore(spinner, loadButton.nextSibling);
});