import React from "react";
import "./App.css";
import Messenger from "./components/Messenger";

const App: React.FC = () => {
  return (
    <div className="App">
      헤더
      <Messenger />
      푸터
    </div>
  );
};

export default App;
