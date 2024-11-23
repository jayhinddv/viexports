import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts";

function TenderList({ list, role }) {
	const [showModal, setShowModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);
	const [amount, setAmount] = useState("");
	const [description, setDescription] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [statusModal, setStatusModal] = useState(false); // Modal for changing status
	const [newStatus, setNewStatus] = useState(""); 
	const {token} = useAuth();
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

	// Function to handle bid submission
	const handlePlaceBid = async () => {
		setIsLoading(true);
		setError("");
		try {
			if (!token) throw new Error("User is not authenticated.");

			const res = await axios.post(
				"/api/user/bid",
				{
					tender_id: selectedItem?.id,
					amount,
					description,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (!res.data.success) {
				setError(res.data.message || "Failed to place bid. Please try again.");
			}
		} catch (err) {
			setError(err.response?.data?.message || "Failed to place bid. Please try again.");
			console.error("Error placing bid:", err);
		} finally {
			setIsLoading(false);
			setShowModal(false);
			setAmount("");
			setDescription("");
		}
	};

	// Function to handle tender status update
	const handleStatusUpdate = async () => {
		try {
			if (!token) throw new Error("User is not authenticated.");

			const res = await axios.patch(
				`/api/user/tender`,
				{ status: newStatus,id :selectedItem?.id },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			console.log(res.data)

			if (res.data.data.success) {
				alert("Tender status updated successfully.");
				setStatusModal(false);
				setNewStatus("");
			} else {
				alert("Failed to update tender status.");
			}
		} catch (err) {
			console.error("Error updating tender status:", err);
		}
	};

	return (
		<div>
			{error && (
				<div className="bg-red-500 text-white p-4 rounded-md mb-4">
					{error}
				</div>
			)}
			<ul className="space-y-4">
				{list.length > 0 ? (
					list.map((item) => (
						<li
							key={item.id}
							className="relative border border-gray-700 rounded-lg p-4 bg-gray-800 shadow-md"
						>
							{/* Badge for New */}
							{item.isNew === "Y" && (
								<span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
									New
								</span>
							)}
							<p>
								<Link
									to={`/auction/${item.id}`}
									className="text-indigo-400 hover:underline text-lg font-semibold"
								>
									{item.name}
								</Link>
							</p>
							<p className="text-gray-300 mt-2">
								<b>{item.description}</b>
							</p>
							<p className="text-gray-400 mt-2">
								<b>Bid Start On:</b> {formatDate(item.start_time)}
							</p>
							<p className="text-gray-400 mt-2">
								<b>End Date: </b>
								{formatDate(item.end_time)}
							</p>
							<p className="text-gray-400 mt-2">
								<b>Lowest Bid: </b>
								{item.lowest_bid ? item.lowest_bid : "No bids yet"}
							</p>
							<div className="flex flex-wrap gap-4 mt-4 justify-end">
	{role === "admin" && (
		<>
			<Link
				to={`/bid/${item.id}`}
				className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md"
			>
				View Bids
			</Link>
			<button
				onClick={() => {
					setSelectedItem(item);
					setStatusModal(true);
				}}
				className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
			>
				Change Status
			</button>
		</>
	)}

	{role !== "admin" &&
		(item.status === "pending" || (item.status === "open" && new Date(item.end_time) >= new Date()) ? (
			<button
				className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md"
			>
				Bid Not Open
			</button>
		) : item.status === "open" &&
		  new Date(item.start_time) <= new Date() &&
		  new Date(item.end_time) >= new Date() ? (
			<button
				onClick={() => {
					setSelectedItem(item);
					setShowModal(true);
				}}
				className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md"
			>
				Place Bid
			</button>
		) : (
			<button
				className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md"
			>
				Expired
			</button>
		))}
</div>

						</li>
					))
				) : (
					<p className="text-gray-300">No tenders found.</p>
				)}
			</ul>

			{/* Modal for placing bid */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-md">
						<h3 className="text-xl font-semibold text-white mb-4">Place Your Bid</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-gray-300">Amount</label>
								<input
									type="number"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
									placeholder="Enter your bid amount"
								/>
							</div>
							<div>
								<label className="block text-gray-300">Description</label>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
									placeholder="Enter a description for your bid"
								/>
							</div>
							<div className="flex justify-end space-x-4">
								<button
									onClick={() => setShowModal(false)}
									className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
								>
									Cancel
								</button>
								<button
									onClick={handlePlaceBid}
									className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
									disabled={isLoading}
								>
									{isLoading ? "Submitting..." : "Submit Bid"}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Modal for changing status */}
			{statusModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-gray-800 rounded-lg p-6 shadow-lg w-full max-w-md">
						<h3 className="text-xl font-semibold text-white mb-4">Change Tender Status</h3>
						<div className="space-y-4">
							<div>
								<label className="block text-gray-300">New Status</label>
								<select
									value={newStatus}
									onChange={(e) => setNewStatus(e.target.value)}
									className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
								>
									<option value="pending">Pending</option>
									<option value="open">Open</option>
									<option value="close">Close</option>
								</select>
							</div>
							<div className="flex justify-end space-x-4">
								<button
									onClick={() => setStatusModal(false)}
									className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
								>
									Cancel
								</button>
								<button
									onClick={handleStatusUpdate}
									className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
								>
									Update Status
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default TenderList;
