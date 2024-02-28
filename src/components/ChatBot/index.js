// import { useEffect, useRef, useState } from 'react';
// import { Resizable } from 're-resizable';
// import _ from "lodash";
// import {useTranslation} from "react-i18next";
//
// import Disclaimer from './Disclaimer';
// import SampleQuestions from './SampleQuestions';
// import styles from './index.module.scss';
// import {
//   onDeleteChat,
//   onGetAllHistory,
//   onGetChatHistoryById, onGetSampleQuestions,
//   onPostChat,
// } from '../../hooks/chat';
// import {
//   CHAT_SESSION_ID,
//   clearSessionStorage,
//   getSessionStorage,
//   setSessionStorage,
// } from '../../utils/storage';
// import AllHistoryList from './AllHistoryList';
// import ChatBotHeader from './ChatBotHeader';
// import ChatBotSender from './ChatBotSender';
// import ChatMessage from '../../components/ChatMessage';
// import {isNotEmptyArray} from "../../utils/formatter";
// import {GEN_AI_MODEL_TYPE, LANGUAGES} from "../../constants";
//
// const HISTORY_WIDTH = 300;
// const BOT_WIDTH = 480;
// const TOTAL_WIDTH = BOT_WIDTH + HISTORY_WIDTH;
//
// const getWidth = (newWidth, maxWidth, minWidth) => {
//   if (newWidth >= maxWidth) {
//     return maxWidth;
//   }
//   if (newWidth <= minWidth) {
//     return minWidth;
//   }
//   return newWidth;
// };
//
// const ChatBot = ({ open, onClose }) => {
//   const {i18n: { language }} = useTranslation();
//   const messagesRef = useRef(null);
//   const [sampleQuestions, setSampleQuestions] = useState(null);
//   const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
//   const [currentSessionId, setCurrentSessionId] = useState('');
//   const [history, setHistory] = useState([]);
//   const [showAllHistory, setShowAllHistory] = useState(false);
//   const [allHistory, setAllHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const [model, setModel] = useState(process.env.REACT_APP_LLM_MODEL || GEN_AI_MODEL_TYPE.WENXIN);
//   const [totalWidth, setTotalWidth] = useState(showAllHistory ? TOTAL_WIDTH : BOT_WIDTH);
//
//   useEffect(() => {
//     const target = messagesRef?.current;
//     if (open && isNotEmptyArray(history) && target) {
//       target.scroll({
//         top: target.scrollHeight,
//         behavior: 'smooth',
//       });
//     }
//   }, [history, open]);
//
//   useEffect(() => {
//     document.body.style.overflow = open ? 'hidden' : 'auto';
//   }, [open]);
//
//   useEffect(() => {
//     const fetchSampleQuestions = async () => {
//       const data = await onGetSampleQuestions(language === LANGUAGES.EN)
//       setSampleQuestions(data)
//     }
//     handleFetchAllHistory();
//     fetchSampleQuestions();
//   }, [language]);
//
//   useEffect(() => {
//     const sessionId = getSessionStorage(CHAT_SESSION_ID);
//     if (sessionId) {
//       handleFetchHistoryById(sessionId);
//     }
//   }, []);
//
//   const handleFetchHistoryById = async sessionId => {
//     setLoading(true);
//     setCurrentSessionId(sessionId);
//     const res = await onGetChatHistoryById(sessionId);
//     setHistory(isNotEmptyArray(res) ? res : []);
//     setLoading(false);
//   };
//
//   const handleFetchAllHistory = async () => {
//     const allRes = await onGetAllHistory();
//     setAllHistory(allRes);
//   };
//
//   const handleChat = async (question, existingQuestionId) => {
//     if (!existingQuestionId) {
//       setHistory(prev => _.concat(prev, { question, questionId: _.uniqueId() }));
//     }
//     setIsError(false);
//     setLoading(true);
//     const res = await onPostChat(question, currentSessionId, model, existingQuestionId);
//     if (res?.id) {
//       setCurrentSessionId(res.id);
//       setHistory(res.history);
//     } else {
//       setIsError(true);
//     }
//     setLoading(false);
//     await handleFetchAllHistory();
//   };
//
//   const handleStartNewChat = () => {
//     clearSessionStorage(CHAT_SESSION_ID);
//     setCurrentSessionId('');
//     setHistory([]);
//   };
//
//   const handleClose = () => {
//     setHistory([]);
//     setShowAllHistory(false);
//     onClose();
//   };
//
//   const handleDeleteChat = async () => {
//     await onDeleteChat(currentSessionId);
//     handleStartNewChat();
//     await handleFetchAllHistory();
//   };
//
//   const handleToggleAllHistory = () => {
//     const currentShow = showAllHistory;
//     setShowAllHistory(!showAllHistory);
//     setTotalWidth(currentShow ? totalWidth - HISTORY_WIDTH : totalWidth + HISTORY_WIDTH);
//   };
//
//   const handleClickHistory = async id => {
//     if (id && id !== currentSessionId) {
//       setSessionStorage(CHAT_SESSION_ID, id);
//       await handleFetchHistoryById(id);
//     }
//   };
//
//   const maxWidth = window.innerWidth - (showAllHistory ? 0 : HISTORY_WIDTH) - 100;
//   const minWidth = showAllHistory ? TOTAL_WIDTH : BOT_WIDTH;
//   return (
//     <div className={styles.container} style={{ display: open ? 'block' : 'none' }}>
//       <div className={styles.mask} onClick={onClose} />
//       <div className={styles.bot}>
//         <Resizable
//           size={{
//             width: totalWidth,
//             height: '100%',
//           }}
//           minWidth={minWidth}
//           maxWidth={maxWidth}
//           enable={{
//             top: false,
//             right: false,
//             bottom: false,
//             left: true,
//             topRight: false,
//             bottomRight: false,
//             bottomLeft: false,
//             topLeft: false,
//           }}
//           onResizeStop={(e, dir, ref, delta) => {
//             setTotalWidth(getWidth(totalWidth + delta.width, maxWidth, minWidth));
//           }}
//         >
//           <div className={styles.botContainer}>
//             <div
//               className={styles.left}
//               style={{ display: showAllHistory ? 'block' : 'none', width: HISTORY_WIDTH, flexBasis: HISTORY_WIDTH }}
//             >
//               <AllHistoryList
//                 currentSessionId={currentSessionId}
//                 allHistory={allHistory}
//                 onClickHistory={handleClickHistory}
//                 onDeleteChat={handleDeleteChat}
//                 onStartNewChat={handleStartNewChat}
//               />
//             </div>
//             <div className={styles.right}>
//               <ChatBotHeader
//                 onClickHistory={handleToggleAllHistory}
//                 onClose={handleClose}
//                 onShowDisclaimer={() => setShowDisclaimerModal(true)}
//                 model={model}
//                 onSwitchModel={setModel}
//               />
//               <div className={styles.botContent} ref={messagesRef}>
//                 {isNotEmptyArray(history) ? (
//                   _.map(history, (item, index) =>
//                     item?.questionId && item?.question ? (
//                       <ChatMessage
//                         key={item.questionId}
//                         data={item}
//                         index={index}
//                         isLastOne={index === history.length - 1}
//                         loading={loading}
//                         isError={isError}
//                         onChat={handleChat}
//                         model={model}
//                       />
//                     ) : null,
//                   )
//                 ) : (
//                   <SampleQuestions data={sampleQuestions} onClickQuestion={handleChat} />
//                 )}
//               </div>
//               <ChatBotSender
//                 onStartNewChat={handleStartNewChat}
//                 onSendChat={handleChat}
//                 isLoading={loading}
//                 questions={_.flatten(_.map(sampleQuestions, item => item?.questions))}
//               />
//             </div>
//           </div>
//         </Resizable>
//       </div>
//       <Disclaimer open={showDisclaimerModal} onClose={() => setShowDisclaimerModal(false)} />
//     </div>
//   );
// };
//
// export default ChatBot;
