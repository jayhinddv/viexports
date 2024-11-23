import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts";

function BidList() {
	const { tenderId } = useParams(); // Get tender_id from URL
	const [list, setList] = useState([]); // State to hold bid data
	const [isLoading, setIsLoading] = useState(true); // Loading state
	const [error, setError] = useState(""); // Error state
    const {role,token} = useAuth();

	// Function to format date as dd/MM/yyyy hh:mm tt
	const formatDate = (date) => {
		const options = {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		};
		return new Date(date).toLocaleString("en-GB", options);
	};

	// Fetch bids for the tender_id
	useEffect(() => {
		const fetchBids = async () => {
			setIsLoading(true); // Start loading
			setError(""); // Clear previous error
			try {
                console.log(tenderId,'tender id');
				if (!token) throw new Error("User is not authenticated.");

				const res = await axios.get(`/api/user/bid/${tenderId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
                console.log(res.data,'bid list')
				setList(res.data.data); // Set the fetched bid data

			} catch (err) {
				setError(
					err.response?.data?.message ||
						"Failed to load bids. Please try again."
				);
				console.error("Error fetching bids:", err);
			} finally {
				setIsLoading(false); // Stop loading
			}
		};

		fetchBids();
	}, [tenderId]); // Re-run if tender_id changes

	return (
		<div>
			{/* Error Message */}
			{error && (
				<div className="bg-red-500 text-white p-4 rounded-md mb-4">
					{error}
				</div>
			)}

			{/* Table for Bid List */}
			{isLoading ? (
				<div className="text-center mt-4 text-gray-400">Loading...</div>
			) : list.length > 0 ? (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
						<thead>
							<tr className="text-left text-gray-400 border-b border-gray-700">
								<th className="px-4 py-2">Bid ID</th>
								<th className="px-4 py-2">Bidder Name</th>
								<th className="px-4 py-2">Bid Amount</th>
								<th className="px-4 py-2">Bid Description</th>
								<th className="px-4 py-2">Bid Date</th>
                                <th className="px-4 py-2">Last 5 Min</th>
								{role === "admin" && <th className="px-4 py-2">Actions</th>}
							</tr>
						</thead>
						<tbody>
							{list.map((bid) => (
								<tr
									key={bid.id}
									className="hover:bg-gray-700 text-gray-300 border-b border-gray-700"
								>
									<td className="px-4 py-2">{bid.id}</td>
									<td className="px-4 py-2">{bid.User.name}</td>
									<td className="px-4 py-2">{bid.amount}</td>
									<td className="px-4 py-2">{bid.description}</td>
									<td className="px-4 py-2">{formatDate(bid.createdAt)}</td>
                                    <td className="px-4 py-2">{bid.is_last_minute_bid ? 'Yes':'No'}</td>
									{role === "admin" && (
										<td className="px-4 py-2">
											<button
												className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg shadow-md"
												onClick={() => {
													// Add delete logic or admin-specific action
													alert(`Accepted bid ${bid.id} and ${tenderId}`);
												}}
											>
												Accept
											</button>
										</td>
									)}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<p className="text-gray-300">No bids found.</p>
			)}
		</div>
	);
}

export default BidList;
