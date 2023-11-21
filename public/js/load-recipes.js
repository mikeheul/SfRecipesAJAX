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
        loadButton.style.cursor = 'not-allowed';

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
                    loadButton.style.cursor = 'pointer';
                });
        }, 500);
    });

    function displayRecipe(recipe) {
        // clear previous content
        container.innerHTML = ''; 
        var recipeDiv = document.createElement('div');
        var recipeInfos = document.createElement('div');
        var recipeDesc = document.createElement('div');

        recipeInfos.classList.add('recipe-infos')
        // recipe name
        recipeInfos.innerHTML += '<div><h3>' + recipe.name + '</h3><ul>' +
        // loop ingredients + area
        recipe.ingredients.map(function (ingredient) {
            return '<li>' + ingredient + '</li>';
        }).join('') +
        '</ul><p><b>Area : </b>' + recipe.area + '</p></div>';
        // image
        recipeInfos.innerHTML += '<div><img class="thumb" src="' + recipe.thumb + '" /></div>'
        // instructions
        recipeDesc.innerHTML += '<p class="recipe-desc"><b>Intructions :</b> ' + recipe.instructions + '</p>'

        recipeDiv.appendChild(recipeInfos);
        recipeDiv.appendChild(recipeDesc);
        container.appendChild(recipeDiv);
    }

    // append the spinner to the button
    loadButton.parentNode.insertBefore(spinner, loadButton.nextSibling);
});