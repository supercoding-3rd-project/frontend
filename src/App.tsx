import "./App.scss";
import { Layout } from "./components/Layout";
import Router from "./components/Router";

const App: React.FC = () => {
  return (
    <Layout isLoggedIn={true}>
      <Router />
    </Layout>
  );
};

export default App;
