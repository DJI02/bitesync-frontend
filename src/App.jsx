import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Dash from './Pages/Dash';
import RecipeBook from './Pages/RecipieBook';
import CreateRecipe from './Pages/CreateRecipe';
import CreateAccount from './Pages/CreateAccount';
import ProtectedRoute from './Components/ProtectedRoute';
import ViewRecipe from "./Pages/ViewRecipe";
import FavoriteRecipe from "./Pages/FavoriteRecipe";
import EventList from "./Pages/EventList";
import CreateEvent from "./Pages/CreateEvent";
import Profile from "./Pages/Profile";
import ViewEvent from "./Pages/ViewEvent";
import EditRecipe from './Pages/EditRecipe';
import EditEvent from './Pages/EditEvent';
import AdminPage from './Pages/AdminPage'; 

function App() {
  return (
    // Removed the Router component since it's already in index.js
    <Routes>
      {/* Public routes */}
      <Route path="/recipe/:recipeID" element={<ViewRecipe/>} />
      <Route path="/" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="*" element={<h>404 Page Unknown </h>} />
      <Route path="/view-event/:eventID" element={<ViewEvent />} />

      {/* Protected routes */}
      <Route 
        path="/dash" 
        element={
          <ProtectedRoute>
            <Dash />
          </ProtectedRoute>
        } 
      />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />

      <Route 
        path="/recipe-book" 
        element={
          <ProtectedRoute>
            <RecipeBook />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-recipe" 
        element={
          <ProtectedRoute>
            <CreateRecipe />
          </ProtectedRoute>
        } 
      />
        <Route
            path="/favorite-recipes"
            element={
                <ProtectedRoute>
                    <FavoriteRecipe />
                </ProtectedRoute>
            }
        />

        <Route
            path="/manage-events"
            element={
                <ProtectedRoute>
                    <EventList />
                </ProtectedRoute>
            }
        />

        <Route
            path="/create-events"
            element={
                <ProtectedRoute>
                    <CreateEvent />
                </ProtectedRoute>
            }
        />

        <Route
            path="/profile"
            element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            }
        />

      <Route
        path="/edit-recipe"
        element={
          <ProtectedRoute>
            <EditRecipe />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-event"
        element={
          <ProtectedRoute>
            <EditEvent />
          </ProtectedRoute>
        }
      />  

    </Routes>
  );
}

export default App;