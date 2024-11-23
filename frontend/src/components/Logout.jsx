import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Logout() {
	const navigate = useNavigate();
	const { logout: signout } = useAuth();

	useEffect(() => {
		const performLogout = async () => {
			try {
				// Call the logout function to clear the token and update state
				signout();

				// Redirect to the login page
				navigate("/login", { replace: true });
			} catch (err) {
				console.error("Error during logout:", err);
			}
		};

		performLogout();
	}, [navigate, signout]);

	return <div>Logging out...</div>;
}

export default Logout;
