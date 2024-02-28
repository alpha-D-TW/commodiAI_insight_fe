import {Button, Menu} from 'antd';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import _ from "lodash";

import {KNOWLEDGE_TAB_KEY} from './tabUtils';
import {onGetKnowledgeItems} from '../../hooks/knowledge';
import MarketReportList from './MarketReportList';
import UploadMarketReportModal from './UploadMarketReportModal';
import {KNOWLEDGE_TYPE, LANGUAGES, SUPPORT_TYPE} from '../../constants';
import UploadDataModal from './UploadDataModal';
import {ReactComponent as RefreshIcon} from '../../icons/refresh.svg';
import styles from './index.module.scss';
import DailyReportList from "./DailyReportList";
import i18n from '../../i18n';

const getTypesByTab = tab => {
	switch (tab) {
		case KNOWLEDGE_TAB_KEY.DOMAIN:
			return [KNOWLEDGE_TYPE.DOMAIN_KNOWLEDGE];
		default:
			return [KNOWLEDGE_TYPE.MARKET_DATA];
	}
};
const KnowledgeManagement = () => {
	const {t, i18n: {language}} = useTranslation();
	const [currentKey, setCurrentKey] = useState(KNOWLEDGE_TAB_KEY.MARKET);
	const [allFiles, setAllFiles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);

	useEffect(() => {
		const handleFetchFiles = async () => {
			setLoading(true);
			const res = await onGetKnowledgeItems(getTypesByTab(currentKey));
			setAllFiles(res);
			setLoading(false);
		};
		handleFetchFiles();
	}, [currentKey]);

	const handleRefreshFiles = async () => {
		setLoading(true);
		const res = await onGetKnowledgeItems(getTypesByTab(currentKey));
		setAllFiles(res);
		setLoading(false);
	};

	return (
		<div style={{display:"flex",flexDirection:'column',flex:'1',backgroundColor:'#fff',marginBottom:'24px',borderRadius:'24px'}}>
			{/*<h1 className={styles.title}>{t("header.title")}</h1>*/}
			<div className={styles.topBar}>
				<Menu
					onClick={({key}) => setCurrentKey(key)}
					selectedKeys={[currentKey]}
					mode="horizontal"
					items={_.values(KNOWLEDGE_TAB_KEY).map(key => ({
						key,
						label: t(`label.knowledge.tabs.${key}`),
					}))}
				/>
				<div className={styles.actions}>
					{/*<Button onClick={() => i18n.changeLanguage(language === LANGUAGES.EN ? LANGUAGES.CN : LANGUAGES.EN)}>*/}
					{/*	{t(`nextLanguage`)}*/}
					{/*</Button>*/}
					{/*<Button type="primary" onClick={handleRefreshFiles}>*/}
					{/*	<RefreshIcon/>*/}
					{/*	{t('operation.refresh_page')}*/}
					{/*</Button>*/}
					<Button type="primary" onClick={() => setShowKnowledgeModal(true)}>
						{t(`operation.upload_${currentKey}`)}
					</Button>
				</div>
			</div>
			{currentKey === KNOWLEDGE_TAB_KEY.MARKET && (
				<>
					<MarketReportList loading={loading} allFiles={allFiles} onRefresh={handleRefreshFiles}/>
					<UploadMarketReportModal
						title={t(`operation.upload_${currentKey}`)}
						visible={showKnowledgeModal}
						onClose={() => setShowKnowledgeModal(false)}
						onRefresh={handleRefreshFiles}
					/>
				</>
			)}
			{currentKey === KNOWLEDGE_TAB_KEY.DOMAIN && (
				<>
					<DailyReportList loading={loading} allFiles={allFiles} disableDelete onRefresh={handleRefreshFiles}/>
					<UploadDataModal
						uploadType={KNOWLEDGE_TYPE.DOMAIN_KNOWLEDGE}
						supportedType={SUPPORT_TYPE.KNOWLEDGE_DOMAIN_DATA}
						title={t(`operation.upload_${currentKey}`)}
						visible={showKnowledgeModal}
						onClose={() => setShowKnowledgeModal(false)}
						onRefresh={handleRefreshFiles}
					/>
				</>
			)}
		</div>
	);
};

export default KnowledgeManagement;
