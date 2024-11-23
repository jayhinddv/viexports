import { Route, Routes ,useNavigate} from "react-router-dom";
import NavBar from "./components/NavBar";
import TenderList from "./components/TenderList";
import Tender from "./components/Tender";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import BidList from "./components/BidList";
import Logout from "./components/Logout";
import CreateTender from "./components/CreateTender";
const Layout = ({ children }) => (
  <>
    <NavBar />
    <div className="container mx-auto">{children}</div>
  </>
);

function App() {
  const navigate = useNavigate();

  return (
    <Routes> {/* Use Routes to define routes here */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/logout" element={<Layout><Logout /></Layout>} />
      <Route path="/view-tender" element={<Layout><TenderList /></Layout>} />
      <Route path="/tender/:id" element={<Layout><Tender /></Layout>} />
      <Route path="/create-tender" element={<Layout><CreateTender /></Layout>} />
      <Route path="/bid/:tenderId" element={<Layout><BidList /></Layout>} />
    </Routes>
  );
}

export default App;
