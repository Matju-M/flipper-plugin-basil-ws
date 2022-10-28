import React, { useMemo } from 'react';
import { extractDataFromMessage, parse } from '../utils/parse';
import {
	CloseCircleOutlined,
	DownCircleOutlined,
	ExclamationCircleOutlined,
	InfoCircleOutlined,
	UpCircleOutlined,
} from '@ant-design/icons';

import { List } from 'antd';

import {
	Item,
	ItemIcon,
	ItemMain,
	CodeBlock,
} from './Message.style';

enum MESSAGE_TYPES {
	INFO = 'info',
	RECEIVED = 'received',
	SENT = 'sent',
	ERROR = 'error',
	CLOSED = 'closed',
}

export type MessageObject = {
	data: string;
	isTrusted: boolean;
}

export type MessageProps = {
	messageObj: {
		type: string,
		message: string | string[] | MessageObject,
	};
	selectMessage: (message: string | string[] | MessageObject) => void;
};

const Message = ({
	messageObj,
	selectMessage
}: MessageProps) => {
	const {
		type,
		message
	} = messageObj;

	const typeIcon = useMemo(() => {
		switch (type) {
			case MESSAGE_TYPES.INFO:
				return (
					<InfoCircleOutlined style={{ color: 'deepskyblue', verticalAlign: 'middle' }} />
				);
			case MESSAGE_TYPES.RECEIVED:
				return (
					<DownCircleOutlined style={{ color: 'green', verticalAlign: 'middle' }} />
				);
			case MESSAGE_TYPES.SENT:
				return (
					<UpCircleOutlined style={{ color: 'orange', verticalAlign: 'middle' }} />
				);
			case MESSAGE_TYPES.ERROR:
				return (
					<ExclamationCircleOutlined style={{ color: 'red', verticalAlign: 'middle' }} />
				);
			case MESSAGE_TYPES.CLOSED:
				return (
					<CloseCircleOutlined style={{ color: 'gray', verticalAlign: 'middle' }} />
				);
		}
	}, [type]);
	
	const text = extractDataFromMessage(message);

	return (
		<List.Item style={{ padding: 0 }} onClick={() => selectMessage(message)}>
			<Item wrap={false} gutter={16} vertical="middle">
				<ItemIcon flex="none">{typeIcon}</ItemIcon>
				<ItemMain flex="auto">
					<CodeBlock>{text}</CodeBlock>
				</ItemMain>
			</Item>
		</List.Item>
	);
};

export default Message;
