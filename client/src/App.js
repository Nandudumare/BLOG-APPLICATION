
import './App.css';
import AuthContextProvider from './context/AuthContextProvider';
import MainRoutes from './Routes/MainRoutes';
import img from "./donger.jpg"

function App() {
  return (
    <AuthContextProvider>
    <div className="App">
      <img src={img} alt="" />
      <MainRoutes/>
      </div>
      </AuthContextProvider>
  );
}

export default App;
