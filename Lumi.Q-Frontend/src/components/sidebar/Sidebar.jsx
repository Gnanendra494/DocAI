import "./sidebar.css";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { Context } from "../../context/Context";

import {useNavigate} from 'react-router-dom';
const Sidebar = () => {
	const [extended, setExtended] = useState(false);
	const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);
	const navigate = useNavigate()
	// logout handler function
	function userLogout(){
		localStorage.removeItem('token');
		navigate('/')
	  }

	const loadPreviousPrompt = async (prompt) => {
		setRecentPrompt(prompt);
		await onSent(prompt);
	};
	return (
		<div className="sidebar">
			<div className="top">
				<img
					src={assets.menu_icon}
					className="menu"
					alt="menu-icon"
					onClick={() => {
						setExtended((prev) => !prev);
					}}
				/>
				
				{extended ? (
					<div className="recent">
						<p className="recent-title">Recent</p>
						{prevPrompts.map((item, index) => {
							return (
								<div onClick={()=>{
                                    loadPreviousPrompt(item)
                                }} className="recent-entry">
									<img src={assets.message_icon} alt="" />
									<p>{item.slice(0, 18)}...</p>
								</div>
							);
						})}
					</div>
				) : null}
			</div>
			<div className="bottom">
				<div className="bottom-item recent-entry">
					<img src={assets.question_icon} alt="" />
					{extended ? <p>Help</p> : null}
				</div>
				<div className="bottom-item recent-entry">
					<img src={assets.history_icon} alt="" />
					{extended ? <p>Activity</p> : null}
				</div>
				<div className="bottom-item recent-entry" onClick={userLogout}>
					<img src={assets.setting_icon} alt="" />
					{extended ? <p>Logout</p> : null}
				</div>
			</div>
		</div>
	);
};

export default Sidebar;