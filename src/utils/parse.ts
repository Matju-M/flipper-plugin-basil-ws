import isArray from 'lodash/isArray';
import { MessageProps } from '../Message/Message';

export function extractDataFromMessage(selectedMessage: MessageProps['messageObj']['message']): string {
    let message = "";

    if (isArray(selectedMessage)) {
        message = selectedMessage[0];
    } else if (typeof selectedMessage === 'object') {
        message = (selectedMessage as any)?.data;
    } else if (typeof selectedMessage === 'string') {
        message = selectedMessage;
    }
    return message;
}

export function parse(selectedMessage: null | MessageProps['messageObj']['message']): string | null | JSON {
    if (!selectedMessage) {
        return null;
    }

    const message = extractDataFromMessage(selectedMessage);
    try {
        return JSON.parse(message);
    } catch (e) {
        return message;
    }
}