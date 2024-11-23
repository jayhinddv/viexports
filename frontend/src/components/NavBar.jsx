import { useAuth } from "../contexts/AuthContext";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

const NavBar = () => {
	const { isLoggedIn ,role} = useAuth();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="bg-gray-900 bg-opacity-80 backdrop-blur-md p-4 shadow-lg">
			<div className="container mx-auto flex items-center justify-between">
				<div
					className={`w-full lg:flex lg:items-center lg:w-auto ${
						isOpen ? "block" : "hidden"
					}`}
				>
					<ul className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0 mt-4 lg:mt-0">
						<li>
							<NavLink
								className="text-white hover:text-gray-300 text-lg"
								to="/"
							>
								Home
							</NavLink>
						</li>
						{ role ==='admin' && (<li>
							<NavLink
								className="text-white hover:text-gray-300 text-lg"
								to="/create-tender"
							>
								createTender
							</NavLink>
						</li>)}
						{isLoggedIn && (
							<>
								<li>
									<NavLink
										className="text-white hover:text-gray-300 text-lg"
										to="/logout"
									>
										Logout
									</NavLink>
								</li>
							</>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
