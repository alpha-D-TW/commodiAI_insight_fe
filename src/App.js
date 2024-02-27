import {useState} from "react";
import {Button, ConfigProvider} from "antd";

import ChatBot from "./components/ChatBot";
import KnowledgeManagement from "./components/KnowledgeManagement";
import {ReactComponent as ChatBotIcon} from './icons/chat-logo-sm.svg';
import styles from './App.module.scss';

function App() {
	const [showChatBot, setShowChatBot] = useState(true);

	return (
		<ConfigProvider theme={{token: {colorPrimary: '#0066FF'}}}>
			<div className="App">
				<KnowledgeManagement/>
				{!showChatBot && (
					<div className={styles.chatBotBtn}>
						<Button icon={<ChatBotIcon/>} onClick={() => setShowChatBot(true)}/>
					</div>
				)}
				<ChatBot open={showChatBot} onClose={() => setShowChatBot(false)}/>
			</div>
		</ConfigProvider>
	);
}

export default App;
