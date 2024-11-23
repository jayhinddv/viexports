import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts";

const CreateTender = () => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [bufferTime, setBufferTime] = useState(0);
	const [status, setStatus] = useState("pending");
	const [error, setError] = useState("");
	const {token} = useAuth()
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post(
				"/api/user/create-tender",
				{
					name,
					description,
					start_time: startTime,
					end_time: endTime,
					buffer_time: bufferTime,
					status,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			navigate("/");
		} catch (err) {
			setError("Failed to create auction. Please try again.");
			console.error(err);
		}
	};

	return (
		<div className="bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-gray-300">
			<div className="max-w-2xl mx-auto">
				<div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden">
					<div className="p-6 sm:p-10">
						<h2 className="text-3xl font-extrabold text-white mb-6">
							Create Tender
						</h2>
						{error && <p className="text-red-500 mb-4">{error}</p>}
						<form onSubmit={handleSubmit}>
							<div className="mb-4">
								<label
									htmlFor="name"
									className="block text-lg font-medium text-gray-300 mb-1"
								>
									Title
								</label>
								<input
									id="name"
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
									required
									minLength={5}
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="description"
									className="block text-lg font-medium text-gray-300 mb-1"
								>
									Description
								</label>
								<textarea
									id="description"
									value={description}
									onChange={(e) =>
										setDescription(e.target.value)
									}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
									required
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="startTime"
									className="block text-lg font-medium text-gray-300 mb-1"
								>
									Start Time
								</label>
								<input
									id="startTime"
									type="datetime-local"
									value={startTime}
									onChange={(e) => setStartTime(e.target.value)}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
									required
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="endTime"
									className="block text-lg font-medium text-gray-300 mb-1"
								>
									End Time
								</label>
								<input
									id="endTime"
									type="datetime-local"
									value={endTime}
									onChange={(e) => setEndTime(e.target.value)}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
									required
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="bufferTime"
									className="block text-lg font-medium text-gray-300 mb-1"
								>
									Buffer Time (in minutes)
								</label>
								<input
									id="bufferTime"
									type="number"
									value={bufferTime}
									onChange={(e) =>
										setBufferTime(e.target.value)
									}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
									min={0}
								/>
							</div>
							<div className="mb-4">
								<label
									htmlFor="status"
									className="block text-lg font-medium text-gray-300 mb-1"
								>
									Status
								</label>
								<select
									id="status"
									value={status}
									onChange={(e) => setStatus(e.target.value)}
									className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-300"
								>
									<option value="pending">Pending</option>
									<option value="open">Open</option>
									<option value="closed">Closed</option>
								</select>
							</div>
							<button
								type="submit"
								className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors duration-300 text-lg font-semibold"
							>
								Create Tender
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateTender;
