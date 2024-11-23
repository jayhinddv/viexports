import { useEffect, useState } from "react";
import axios from "axios";
import AuctionList from "./TenderList";
import { useAuth } from "../contexts";
import { useNavigate} from "react-router-dom"; // Use Routes and Route instead of createBrowserRouter


function Home() {
  const [tenders, setTenders] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const {isLoggedIn, token,role} = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchTenders = async () => {
      if (isLoggedIn) {
        try {
          // API call to fetch tenders
          const res = await axios.get(
            "/api/user/view-tender",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log(res.data)
          setTenders(res.data); // Assuming res.data contains the list of tenders
          setError(""); // Clear any previous error
        } catch (error) {
          console.error("Error fetching tenders:", error);
          setError("Failed to fetch tenders. Please try again.");
        } finally {
          setIsLoading(false);
        }
      } else {
		navigate("/login");
      }
    };

    fetchTenders();
  }, [isLoggedIn, token]);

  return (
    <div className="container mx-auto p-4">
      {isLoading ? (
        <p className="text-gray-600">Loading tenders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : tenders.length > 0 ? (
        <AuctionList list={tenders} role={role} />
      ) : (
        <p className="text-gray-600">No tenders available at the moment.</p>
      )}
    </div>
  );
}

export default Home;
