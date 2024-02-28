import React, {useEffect, useRef, useState} from "react";
import {Button, ConfigProvider, Divider, Layout} from "antd";
import styles from "./components/ChatBot/index.module.scss";
import SampleQuestions from "./components/ChatBot/SampleQuestions";
import {isNotEmptyArray} from "./utils/formatter";
import _ from "lodash";
import ChatMessage from "./components/ChatMessage";
import ChatBotSender from "./components/ChatBot/ChatBotSender";
import {useTranslation} from "react-i18next";
import {GEN_AI_MODEL_TYPE, LANGUAGES} from "./constants";
import {onDeleteChat, onGetAllHistory, onGetChatHistoryById, onGetSampleQuestions, onPostChat} from "./hooks/chat";
import {CHAT_SESSION_ID, clearSessionStorage, getSessionStorage, setSessionStorage} from "./utils/storage";
import AllHistoryList from "./components/ChatBot/AllHistoryList";
import KnowledgeManagement from "./components/KnowledgeManagement";

function App() {
    const {Header, Sider, Content} = Layout;
    const {i18n: {language}} = useTranslation();
    const messagesRef = useRef(null);
    const [sampleQuestions, setSampleQuestions] = useState(null);
    const [currentSessionId, setCurrentSessionId] = useState('');
    const [history, setHistory] = useState([]);
    const [allHistory, setAllHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const ROLE = {
        C: 'C端用户',
        B: 'B端用户'
    }
    const [role, setRole] = useState(ROLE.C)
    const [isOpen, setIsOpen] = useState(false)
    useEffect(() => {
        if (role === ROLE.C) {
            setIsOpen(false)
        }
    }, [role])
    // const [model, setModel] = useState(process.env.REACT_APP_LLM_MODEL || GEN_AI_MODEL_TYPE.GPT35TURBO);
    // const [totalWidth, setTotalWidth] = useState(showAllHistory ? TOTAL_WIDTH : BOT_WIDTH);

    // useEffect(() => {
    //     const target = messagesRef?.current;
    //     target.scroll({
    //         top: target.scrollHeight,
    //         behavior: 'smooth',
    //     });
    // }, [history]);


    useEffect(() => {
        const fetchSampleQuestions = async () => {
            const data = await onGetSampleQuestions(language === LANGUAGES.EN)
            setSampleQuestions(data)
        }
        handleFetchAllHistory();
        fetchSampleQuestions();
    }, [language]);

    useEffect(() => {
        const sessionId = getSessionStorage(CHAT_SESSION_ID);
        if (sessionId) {
            handleFetchHistoryById(sessionId);
        }
    }, []);

    const handleFetchHistoryById = async sessionId => {
        setLoading(true);
        setCurrentSessionId(sessionId);
        const res = await onGetChatHistoryById(sessionId);
        setHistory(isNotEmptyArray(res) ? res : []);
        setLoading(false);
    };

    const handleFetchAllHistory = async () => {
        const allRes = await onGetAllHistory();
        setAllHistory(allRes);
    };

    const handleChat = async (question, existingQuestionId) => {
        if (!existingQuestionId) {
            setHistory(prev => _.concat(prev, {question, questionId: _.uniqueId()}));
        }
        setIsError(false);
        setLoading(true);
        const res = await onPostChat(question, currentSessionId, GEN_AI_MODEL_TYPE.GPT35TURBO, existingQuestionId);
        if (res?.id) {
            setCurrentSessionId(res.id);
            setHistory(res.history);
        } else {
            setIsError(true);
        }
        setLoading(false);
        await handleFetchAllHistory();
    };

    const handleStartNewChat = () => {
        clearSessionStorage(CHAT_SESSION_ID);
        setCurrentSessionId('');
        setHistory([]);
    };

    const handleDeleteChat = async () => {
        await onDeleteChat(currentSessionId);
        handleStartNewChat();
        await handleFetchAllHistory();
    };

    const handleClickHistory = async id => {
        if (id && id !== currentSessionId) {
            setSessionStorage(CHAT_SESSION_ID, id);
            await handleFetchHistoryById(id);
        }
    };

    return (
        <ConfigProvider theme={{token: {colorPrimary: '#0066FF'}}}>
            <Layout style={{
                height: '100vh',
                overflow: 'hidden',
            }}>
                <Sider width='300px'
                       style={{
                           display: 'flex',
                           flexDirection: 'column',
                           padding: '12px 24px',
                           backgroundColor: '#fafafa',
                       }}
                >
                    <div style={{fontSize: '24px', color: '#0066FF', fontWeight: 'bold', textAlign: 'left'}}>历史问询
                    </div>
                    <Divider/>
                    <AllHistoryList
                        currentSessionId={currentSessionId}
                        allHistory={allHistory}
                        onClickHistory={handleClickHistory}
                        onDeleteChat={handleDeleteChat}
                        onStartNewChat={handleStartNewChat}
                    />
                    {role === ROLE.B && (<div style={{position: 'absolute', bottom: '24px', paddingLeft: '16px'}}>
                        <Button
                            style={{
                                backgroundColor: `${!isOpen ? 'rgb(22, 119, 255)' : '#fff'}`,
                                color: `${!isOpen ? '#ffffff' : 'rgb(22, 119, 255)'}`
                            }}
                            onClick={() => setIsOpen(!isOpen)}>{isOpen ? '点击退出上传知识库文档页面' : '点击进入上传知识库文档页面'}</Button>
                    </div>)}
                </Sider>
                <Layout style={{display: "flex"}}>
                    <Header style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        height: 64,
                        backgroundColor: '#dddddd'
                    }}>
                        <div style={{
                            color: 'rgb(22, 119, 255)',
                            fontSize: 24,
                            textAlign: 'left',
                            fontWeight: 'bold'
                        }}>
                            CommodiAI Insight
                        </div>
                        <div style={{display: 'flex', placeItems: 'center'}}>
                            <Button style={{
                                backgroundColor: `${role === ROLE.B ? 'rgb(22, 119, 255)' : '#fff'}`,
                                color: `${role === ROLE.B ? '#ffffff' : 'rgb(22, 119, 255)'}`
                            }} onClick={() => {
                                setRole(role === ROLE.C ? ROLE.B : ROLE.C)
                            }}>{role}</Button>
                        </div>
                    </Header>
                    <Content style={{padding: '40px 64px 8px 64px', overflow: 'initial', display: 'flex'}}>
                        {!isOpen ? (<div style={{display: 'flex', justifyContent: 'center', flex: "1 1 0%"}}>
                            <div style={{
                                maxWidth: '1000px',
                                minWidth: '1000px',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <div className={styles.botContent} ref={messagesRef}>
                                    {isNotEmptyArray(history) ? (
                                        _.map(history, (item, index) => {
                                                return (item?.questionId && item?.question ? (
                                                    <ChatMessage
                                                        key={item.questionId}
                                                        data={item}
                                                        index={index}
                                                        isLastOne={index === history.length - 1}
                                                        loading={loading}
                                                        isError={isError}
                                                        onChat={handleChat}
                                                        model={GEN_AI_MODEL_TYPE.GPT35TURBO}
                                                    />
                                                ) : null)
                                            }
                                        )
                                    ) : (
                                        <SampleQuestions data={sampleQuestions} onClickQuestion={handleChat}/>
                                    )}
                                </div>
                                <ChatBotSender
                                    onStartNewChat={handleStartNewChat}
                                    onSendChat={handleChat}
                                    isLoading={loading}
                                    questions={_.flatten(_.map(sampleQuestions, item => item?.questions))}
                                />
                                <div style={{
                                    fontSize: '12px',
                                    color: '#555',
                                    lineHeight: '32px',
                                    textAlign: 'center'
                                }}>免责声明：在使用CommodiAI Insight之前，请您务必仔细阅读以下投资免责声明。
                                </div>
                            </div>
                        </div>) : (<KnowledgeManagement/>)}
                    </Content>
                </Layout>
            </Layout>
            {/*<div className="App">*/}
            {/*	{!showChatBot && (*/}
            {/*		<div className={styles.chatBotBtn}>*/}
            {/*			<Button icon={<ChatBotIcon/>} onClick={() => setShowChatBot(true)}/>*/}
            {/*		</div>*/}
            {/*	)}*/}
            {/*	<ChatBot open={showChatBot} onClose={() => setShowChatBot(false)}/>*/}
            {/*</div>*/}
        </ConfigProvider>
    );
}

export default App;
