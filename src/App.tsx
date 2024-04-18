import "./App.scss";
import { Layout } from "./components/Layout";
import Router from "./components/Router";

const App: React.FC = () => {
  return (
    <Layout>
      <div className="router-container">
        <Router />
      </div>
    </Layout>
  );
};

export default App;
