import "./App.scss";
import { Layout } from "./components/Layout";
import Router from "./components/Router";

const App: React.FC = () => {
  return (
    <Layout isLoggedIn={false}>
      <div className="router-container">
        <Router />
      </div>
    </Layout>
  );
};

export default App;
