import React, { useState } from 'react';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const MainContent = styled.div`
  width: 90%;  /* Use percentage instead of fixed max-width */
  max-width: 1000px;  /* Set a larger maximum */
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: white;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 300;
  line-height: 1.5;
`;

const Card = styled.section`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;  /* Add this to take full width of MainContent */
    box-sizing: border-box;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 25px;
  text-align: center;
`;

// Ingredient Input Section
const IngredientInputSection = styled.div`
  margin-bottom: 30px;
  align-items: center;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
  width: 100%;  /* Take full width of parent */
max-width: 600px;  /* But limit maximum width */
justify-content: center;
`;

const IngredientInput = styled.input`
  flex: 1;
  padding: 16px 20px;
  border: 2px solid #e1e8ed;
  border-radius: 16px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: white;
  color: #2c3e50;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #95a5a6;
  }
`;

const AddButton = styled.button`
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 100px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const IngredientsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 25px;
  min-height: 50px;
  justify-content: center;  /* Add this to center the ingredient tags */
    width: 100%;
`;

const IngredientTag = styled.span`
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #2c3e50;
  padding: 12px 16px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  }
`;

const RemoveButton = styled.button`
  background: rgba(231, 76, 60, 0.15);
  border: none;
  color: #e74c3c;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: bold;

  &:hover {
    background: rgba(231, 76, 60, 0.25);
    transform: scale(1.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px;
  color: #7f8c8d;
  font-style: italic;
  background: #f8f9fa;
  border-radius: 16px;
  border: 2px dashed #dee2e6;
  max-width: 600px;  /* Add this to limit width */
    margin: 0 auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 16px 32px;
  background: ${props => props.primary ?
    'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' :
    'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)'
  };
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 160px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const StatusCard = styled.div`
  padding: 20px;
  background: ${props => props.error ?
    'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)' :
    'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
  };
  color: white;
  border-radius: 16px;
  margin: 20px 0;
  text-align: center;
  font-weight: 500;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// Keep all your existing recipe display styled components (RecipeCard, etc.)
const RecipeCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin: 25px 0;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  border: 1px solid rgba(0,0,0,0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.18);
  }
`;

const RecipeTitle = styled.h3`
  color: #2c3e50;
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
`;

const MetaInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 25px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const MetaIcon = styled.span`
  font-size: 1.5rem;
`;

const MetaLabel = styled.span`
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 500;
`;

const MetaValue = styled.span`
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 600;
`;

const DifficultyBadge = styled.span`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background: ${props => {
    switch(props.difficulty) {
      case 'Easy': return 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)';
      case 'Medium': return 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)';
      case 'Hard': return 'linear-gradient(135deg, #e84393 0%, #fd79a8 100%)';
      default: return 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)';
    }
  }};
  color: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
`;

const SectionSubtitle = styled.h4`
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 25px 0 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InstructionsList = styled.ol`
  padding-left: 0;
  list-style: none;
  counter-reset: step-counter;
`;

const InstructionItem = styled.li`
  counter-increment: step-counter;
  margin-bottom: 15px;
  padding: 15px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  line-height: 1.6;
  position: relative;
  color: #2c3e50;
  font-size: 1rem;

  &:before {
    content: counter(step-counter);
    position: absolute;
    left: -10px;
    top: 10px;
    background: #667eea;
    color: white;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
  }
`;

const NutritionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  background: linear-gradient(135deg, #f1f2f6 0%, #e9ecef 100%);
  padding: 25px;
  border-radius: 16px;
  margin-top: 20px;
`;

const NutritionItem = styled.div`
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
`;

const NutritionValue = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 5px;
`;

const NutritionLabel = styled.div`
  font-size: 0.85rem;
  color: #7f8c8d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addIngredient = () => {
    const trimmed = currentIngredient.trim();
    if (trimmed && !ingredients.some(ing => ing.name.toLowerCase() === trimmed.toLowerCase())) {
      setIngredients([...ingredients, { name: trimmed }]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  const findRecipes = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/analyze-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredients,
          dietary_restrictions: [],
          cuisine_preference: null
        })
      });

      const data = await response.json();
      console.log('Setting recipes:', data.recipes);

      const cleanRecipes = data.recipes.map((recipe, index) => ({
        id: `recipe-${Date.now()}-${index}`,
        name: String(recipe.name || 'Unnamed Recipe'),
        cookingTime: String(recipe.cookingTime || 'Unknown'),
        difficulty: String(recipe.difficulty || 'Unknown'),
        servings: Number(recipe.servings || 4),
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
        instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
        nutrition: recipe.nutrition || {}
      }));

      setRecipes(cleanRecipes);

    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setIngredients([]);
    setRecipes([]);
    setCurrentIngredient('');
    setError('');
  };

  const renderRecipe = (recipe, index) => {
    try {
      return (
        <RecipeCard key={recipe.id || index}>
          <RecipeTitle>{recipe.name}</RecipeTitle>

          <MetaInfo>
            <MetaItem>
              <MetaIcon>⏱️</MetaIcon>
              <MetaLabel>Cooking Time</MetaLabel>
              <MetaValue>{recipe.cookingTime}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaIcon>👥</MetaIcon>
              <MetaLabel>Servings</MetaLabel>
              <MetaValue>{recipe.servings}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaIcon>📊</MetaIcon>
              <MetaLabel>Difficulty</MetaLabel>
              <DifficultyBadge difficulty={recipe.difficulty}>
                {recipe.difficulty}
              </DifficultyBadge>
            </MetaItem>
          </MetaInfo>

          {recipe.instructions && recipe.instructions.length > 0 && (
            <div>
              <SectionSubtitle>
                📝 Instructions
              </SectionSubtitle>
              <InstructionsList>
                {recipe.instructions.map((instruction, idx) => (
                  <InstructionItem key={`inst-${recipe.id}-${idx}`}>
                    {String(instruction)}
                  </InstructionItem>
                ))}
              </InstructionsList>
            </div>
          )}

          {recipe.nutrition && Object.keys(recipe.nutrition).length > 0 && (
            <div>
              <SectionSubtitle>
                🥗 Nutritional Information
              </SectionSubtitle>
              <NutritionGrid>
                {recipe.nutrition.calories && (
                  <NutritionItem>
                    <NutritionValue>{recipe.nutrition.calories}</NutritionValue>
                    <NutritionLabel>Calories</NutritionLabel>
                  </NutritionItem>
                )}
                {recipe.nutrition.protein && (
                  <NutritionItem>
                    <NutritionValue>{recipe.nutrition.protein}</NutritionValue>
                    <NutritionLabel>Protein</NutritionLabel>
                  </NutritionItem>
                )}
                {recipe.nutrition.carbs && (
                  <NutritionItem>
                    <NutritionValue>{recipe.nutrition.carbs}</NutritionValue>
                    <NutritionLabel>Carbs</NutritionLabel>
                  </NutritionItem>
                )}
                {recipe.nutrition.fat && (
                  <NutritionItem>
                    <NutritionValue>{recipe.nutrition.fat}</NutritionValue>
                    <NutritionLabel>Fat</NutritionLabel>
                  </NutritionItem>
                )}
                {recipe.nutrition.fiber && (
                  <NutritionItem>
                    <NutritionValue>{recipe.nutrition.fiber}</NutritionValue>
                    <NutritionLabel>Fiber</NutritionLabel>
                  </NutritionItem>
                )}
              </NutritionGrid>
            </div>
          )}
        </RecipeCard>
      );
    } catch (renderError) {
      console.error('Error rendering recipe:', renderError);
      return (
        <StatusCard key={recipe.id || index} error>
          Error rendering recipe: {renderError.message}
        </StatusCard>
      );
    }
  };

  return (
    <AppContainer>
      <MainContent>
        <Header>
          <Title>🍳 Smart Recipe Analyzer</Title>
          <Subtitle>
            Add your ingredients and discover amazing AI-powered recipe suggestions
          </Subtitle>
        </Header>

        <Card>
          <SectionTitle>🥕 Your Ingredients</SectionTitle>

          <IngredientInputSection>
            <InputGroup>
              <IngredientInput
                type="text"
                placeholder="Enter an ingredient (e.g., chicken, broccoli, rice, garlic...)"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <AddButton
                onClick={addIngredient}
                disabled={!currentIngredient.trim()}
              >
                ➕ Add
              </AddButton>
            </InputGroup>

            {ingredients.length > 0 ? (
              <IngredientsList>
                {ingredients.map((ingredient, index) => (
                  <IngredientTag key={index}>
                    {ingredient.name}
                    <RemoveButton onClick={() => removeIngredient(index)}>
                      ✕
                    </RemoveButton>
                  </IngredientTag>
                ))}
              </IngredientsList>
            ) : (
              <EmptyState>
                👆 Add some ingredients to get started! Try "chicken", "rice", "broccoli"...
              </EmptyState>
            )}
          </IngredientInputSection>

          <ButtonGroup>
            <Button
              primary
              onClick={findRecipes}
              disabled={loading || ingredients.length === 0}
            >
              {loading ? (
                <>
                  <LoadingSpinner />
                  Analyzing ingredients...
                </>
              ) : (
                '🔍 Find Amazing Recipes'
              )}
            </Button>

            <Button onClick={clearAll}>
              🗑️ Clear All
            </Button>
          </ButtonGroup>

          {error && (
            <StatusCard error>
              ❌ {error}
            </StatusCard>
          )}

          {!error && !loading && (
            <StatusCard>
              📊 {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} ready • {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
            </StatusCard>
          )}
        </Card>

        {recipes.length > 0 && (
          <Card>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2 style={{
                color: '#2c3e50',
                fontSize: '2rem',
                fontWeight: '600',
                margin: '0 0 10px 0'
              }}>
                🍽️ Perfect Recipes For You
              </h2>
              <p style={{
                color: '#7f8c8d',
                fontSize: '1.1rem',
                margin: 0
              }}>
                Using: {ingredients.map(ing => ing.name).join(', ')}
              </p>
            </div>
            {recipes.map((recipe, index) => renderRecipe(recipe, index))}
          </Card>
        )}
      </MainContent>
    </AppContainer>
  );
}

export default App;