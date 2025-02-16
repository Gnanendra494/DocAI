import { useContext } from "react";
import { assets } from "../../assets/assets";
import 'bootstrap/dist/css/bootstrap.css';
import "./main.css";
import { Context } from "../../context/Context";
const Main = () => {
	const {
		onSent,
		recentPrompt,
		showResults,
		loading,
		resultData,
		setInput,
		input,
	} = useContext(Context);

	
	  
    const handleCardClick = (promptText) => {
			setInput(promptText);
		};
	return (
		<div className="main">
			
			
			
			<div className="main-container">
			
			
				{!showResults ? (
					<>
						<div className="greet">
						<img className="logo" src={assets.lumiq_icon} alt="" />
							<p>
								<span>Hello , Lumiquer! </span>
							</p>
							<p>How Can I help you Today?</p>
						</div>
						<div className="cards">
							<div
								className="card"
								onClick={() =>
									handleCardClick("What does Lumiq.ai do?")
								}
							>
								<p>What does Lumiq.ai do?</p>
								<img src={assets.compass_icon} alt="" />
							</div>
							<div
								className="card"
								onClick={() =>
									handleCardClick(
										"Name some top clients of Lumiq.ai"
									)
								}
							>
								<p>Name some top clients of Lumiq.ai</p>
								<img src={assets.message_icon} alt="" />
							</div>
							<div
								className="card"
								onClick={() =>
									handleCardClick("What are the products of Lumiq.ai?")
								}
							>
								<p>What are the products of Lumiq.ai?</p>
								<img src={assets.bulb_icon} alt="" />
							</div>
							<div
								className="card"
								onClick={() => {
									handleCardClick(
										"Who are the founders of Lumiq.ai?"
									);
								}}
							>
								<p>Who are the founders of Lumiq.ai?</p>
								<img src={assets.code_icon} alt="" />
							</div>
						</div>
					</>
				) : (
					<div className="result">
						<div className="result-title">
							<img src={assets.user} alt="" />
							<p>{recentPrompt}</p>
						</div>
						<div className="result-data">
							<img src={assets.lumiq_icon} alt="" />
							{loading ? (
								<div className="loader">
									<hr />
									<hr />
									<hr />
								</div>
							) : (
								<p dangerouslySetInnerHTML={{ __html: resultData }}></p>
							)}
						</div>
					</div>
				)}

				<div className="main-bottom">
					<div className="search-box">
						<input
							onChange={(e) => {
								setInput(e.target.value);
							}}
							value={input}
							type="text"
							placeholder="Enter the query here"
						/>
						<div>
							<img src={assets.gallery_icon} alt="" />
							<img src={assets.mic_icon} alt="" />
							<img
								src={assets.send_icon}
								alt=""
								onClick={() => {
									onSent(input);
								}}
							/>
						</div>
					</div>
					<div className="bottom-info">
						<p>
							Code_Shinigami@2024
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Main;