<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class RecipeController extends AbstractController
{
    private $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    #[Route('/', name:'app_recipes')]
    public function index(): Response
    {
        return $this->render('recipe/index.html.twig');
    }

    #[Route('/api/recipes', name:'get_recipes')]
    public function recipes(): Response
    {
        $response = $this->httpClient->request('GET', 'https://www.themealdb.com/api/json/v1/1/random.php');

        $data = $response->toArray();

        // Extract relevant recipe data
        $recipe = $data['meals'][0];

        $recipeData = [
            'id' => $recipe['idMeal'],
            'name' => $recipe['strMeal'],
            'instructions' => $recipe['strInstructions'],
            'area' => $recipe['strArea'],
            'thumb' => $recipe['strMealThumb'],
            'ingredients' => $this->extractIngredients($recipe),
        ];

        return $this->json([$recipeData]);
    }

    private function extractIngredients(array $recipe): array
    {
        $ingredients = [];

        for ($i = 1; $i <= 20; $i++) {
            $ingredientKey = 'strIngredient' . $i;
            $measureKey = 'strMeasure' . $i;

            if (!empty($recipe[$ingredientKey]) && !empty($recipe[$measureKey])) {
                $ingredients[] = $recipe[$measureKey] . ' ' . $recipe[$ingredientKey];
            } elseif (!empty($recipe[$ingredientKey])) {
                $ingredients[] = $recipe[$ingredientKey];
            }
        }

        return $ingredients;
    }
}
