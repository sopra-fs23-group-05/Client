import AppRouter from "components/routing/routers/AppRouter";
import BackgroundMusic from "components/views/sounds/BackgroundMusic";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
  return (
    <div>
      <AppRouter/>
      <BackgroundMusic/>
    </div>
  );
};

export default App;
