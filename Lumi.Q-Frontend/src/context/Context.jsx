import { createContext, useState } from "react";
import axios from "axios"
export const Context = createContext();

const ContextProvider = (props) => {
	const [input, setInput] = useState("");
	const [recentPrompt, setRecentPrompt] = useState("");
	const [prevPrompts, setPrevPrompts] = useState([]);
	const [showResults, setShowResults] = useState(false);
	const [loading, setLoading] = useState(false);
	const [resultData, setResultData] = useState("");

	const delayPara = (index, nextWord) => {
		setTimeout(function () {
			setResultData((prev) => prev + nextWord);
		}, 10 * index);
	};
    const newChat = () =>{
        setLoading(false);
        setShowResults(false)
    }

	const onSent = async (prompt) => {
		setResultData("");
		setLoading(true);
		setShowResults(true);
        let response;
        if(prompt !== undefined){
			const res = await axios.post("http://127.0.0.1:8008/ask", {query: prompt})
			// const res = {"answer": " Readmine is an open-source project management tool that helps teams plan, track, and collaborate on projects efficiently using the Agile methodology, such as Scrum framework. It's customizable and extensible through plugins." }
			console.log(res)
			
			response = res.data.answer
			console.log(response)
            setRecentPrompt(prompt)
        }else{
            setPrevPrompts(prev=>[...prev,input]);
            setRecentPrompt(input);
			
			const res = await axios.post("http://127.0.0.1:8008/ask", {query: prompt})
			console.log(res)

            // const res = {"answer": " Readmine is an open-source project management tool that helps teams plan, track, and collaborate on projects efficiently using the Agile methodology, such as Scrum framework. It's customizable and extensible through plugins." }
			response = res.data.answer
			// response=await runChat(input);
        }
		
		try {
			
			
			let responseArray = response.split("**");
            let newResponse = "";
			for (let i = 0; i < responseArray.length; i++) {
				if (i === 0 || i % 2 !== 1) {
					newResponse += responseArray[i];
				} else {
					newResponse += "<b>" + responseArray[i] + "</b>";
				}
			}
			let newResponse2 = newResponse.split("*").join("<br/>");
			let newResponseArray = newResponse2.split("");
			for (let i = 0; i < newResponseArray.length; i++) {
				const nextWord = newResponseArray[i];
				delayPara(i, nextWord + "");
			}
		} catch (error) {
			console.error("Error while running chat:", error);
			// Handle error appropriately
		} finally {
			setLoading(false);
			setInput("");
		}
	};

	const contextValue = {
		prevPrompts,
		setPrevPrompts,
		onSent,
		setRecentPrompt,
		recentPrompt,
		input,
		setInput,
		showResults,
		loading,
		resultData,
		newChat,
	};

	return (
		<Context.Provider value={contextValue}>{props.children}</Context.Provider>
	);
};

export default ContextProvider;