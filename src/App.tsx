import "./App.scss";
import { Layout } from "./components/Layout";
import Router from "./components/Router";

const App: React.FC = () => {
  return (
    <Layout>
      <Router />
    </Layout>
  );
};

export default App;
