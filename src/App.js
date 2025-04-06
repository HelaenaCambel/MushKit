import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage";
import Dashboard from "./components/Dashboard";
import DataHistory from "./components/DataHistory";
import UserProfile from "./components/UserProfile";

const App = () => {
  return (
    <Router>
      <div className="flex">
        <div className="content">
          <Routes>        
            <Route path="/home" element={<Homepage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/history" element={<DataHistory />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;