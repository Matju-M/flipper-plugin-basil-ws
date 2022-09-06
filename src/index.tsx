import React, { useEffect, useMemo, useState } from 'react';
import map from 'lodash/map';
import {
  usePlugin,
  createState,
  useValue,
  PluginClient,
  DetailSidebar,
} from 'flipper-plugin';
import {
  List,
  Button,
  Tooltip,
  Select,
  Input,
  Empty
} from 'antd';

import {
  DeleteOutlined
} from '@ant-design/icons';

import {
  Shell,
  Toolbar,
  Main,
  ControlContainer,
  SSelect,
  Container,
} from './index.style'

import Message from "./Message";
const { Option } = Select;
const { TextArea } = Input;

const sanitizeValue = (value: string) => {
  return value?.replace(/(\n|\t|\s)/g, '');
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<any, any>) {
  const state = createState<Record<string, []>>({});
  const socketState = createState<Record<string, {}>>({});

  const sendToSocket = (value: any, socketUrl: string) => {
    client.send('send', { data: value, socketUrl });
  };

  const sendMockToSocket = (value: any, socketUrl: string) => {
    client.send('mock', { data: value, socketUrl });
  };

  client.onMessage("send", ({ key, data }) => {
    state.update((draft: any) => {
      const message = { message: data, type: "sent" };
      if (!draft[key]) {
        draft[key] = [message];
        return;
      }

      draft[key]?.push(message);
    })
  });

  client.onMessage('add', ({ key }) => {
    state.update((draft: any) => {
      const message = { message: 'Registered', type: "info" };

      if (!draft[key]) {
        draft[key] = [message]
        return;
      }
      draft[key]?.push(message);
    });
  });

  client.onMessage('open', ({ key, data }) => {
    state.update((draft: any) => {
      const message = { message: 'Open', type: "info" };
      if (!draft[key]) {
        draft[key] = [message];
        return;
      }

      draft[key]?.push(message);
    });
  });

  client.onMessage('message', ({ key, data }) => {
    state.update((draft: any) => {

      // const formatted = JSON.stringify(data, null, 2)?.replace(/\\/g, '');
      // if (!formatted) {
      //   return;
      // }

      const message = { message: data, type: "received" };

      if (!draft[key]) {
        draft[key] = [message];
        return;
      }

      draft[key]?.push(message);
    })
  });

  client.onMessage('closed', ({ key, data }) => {
    state.update((draft: any) => {
      const message = { message: data, type: "closed" };

      if (!draft[key]) {
        draft[key] = [message];
        return;
      }

      draft[key]?.push(message);
    })
  });

  client.onMessage('error', ({ key, data }) => {
    state.update((draft: any) => {
      const message = { message: data, type: "error" };
      if (!draft[key]) {
        draft[key] = [message];
        return;
      }
      draft[key]?.push(message);

    })
  });

  return { state, sendToSocket, sendMockToSocket };
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
  const instance = usePlugin(plugin);
  const data = useValue(instance.state);
  const [selected, setSelected] = useState('');
  const [sendSocket, setSendSocket] = useState('');
  const [sendMock, setSendMock] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  
  useEffect(() => {
    if (!selected && data) {
      setSelected(Object.keys(data)[0])
    }
  }, [data]);

  const handleOnChange = (key: string) => {
    setSelected(key);
  }

  const handleOnDelete = () => {
    instance.state.set({});
  }

  const handleSend = () => {
    instance.sendToSocket(sendSocket, selected);
  }

  const handleMock = () => {
    instance.sendMockToSocket(sendMock, selected);
  }

  const handleSetSendMock = (value: string) => {
    setSendMock(sanitizeValue(value || ''));
  }

  const handleSetSend = (value: string) => {
    setSendSocket(sanitizeValue(value || ''));
  }
  
  const sockets = useMemo(() => Object.keys(data) || [], [data]);
  
  const parseSelectedMessage = useMemo(() => {
    if (!selectedMessage) {
      return null;
    }
    
    try {
      return JSON.parse(selectedMessage);
    } catch (e) {
      return selectedMessage
    }
  }, [selectedMessage]);
  
  return (
      <>
        <Shell>
          <Toolbar data-testID="Toolbar">
            <ControlContainer>
              <Tooltip title="delete all">
                <Button
                    style={{ width: '50px' }}
                    icon={<DeleteOutlined />}
                    onClick={handleOnDelete}
                />
              </Tooltip>
          
              <Input.Group compact style={{ marginLeft: '10px' }}>
                <TextArea
                    style={{ maxWidth: '80%' }}
                    rows={4}
                    onChange={(value: any) => handleSetSend(value.target.value)}
                />
                <Button
                    type="primary"
                    onClick={handleSend}
                >Send</Button>
              </Input.Group>
          
              <Input.Group compact style={{ marginLeft: '10px' }}>
                <TextArea
                    style={{ maxWidth: '80%' }}
                    rows={4}
                    onChange={(value: any) => handleSetSendMock(value.target.value)}
                />
                <Button
                    type="primary"
                    onClick={handleMock}
                >Mock</Button>
              </Input.Group>
            </ControlContainer>
            <ControlContainer data-testID="ControlContainer">
              <SSelect
                  data-testID="SSelect"
                  showSearch
                  defaultValue={sockets?.[0]}
                  optionFilterProp="children"
                  filterOption={(input: string, option: any) => (option!.children as unknown as string).includes(input)}
                  filterSort={(optionA: any, optionB: any) =>
                      (optionA!.children as unknown as string)
                      .toLowerCase()
                      .localeCompare((optionB!.children as unknown as string).toLowerCase())
                  }
                  onChange={handleOnChange}
                  disabled={sockets?.length === 0}
              >
                {map(sockets, (value, index) => (
                    <Option key={index} value={value}>{value}</Option>
                ))}
              </SSelect>
            </ControlContainer>
          </Toolbar>
          <Main>
            {sockets?.length ? (
              <Container>
                <List
                    itemLayout="vertical"
                    dataSource={data[selected]}
                    renderItem={(item: any) => (
                        <Message
                            messageObj={item}
                            selectMessage={setSelectedMessage}
                        />
                    )}
                />
              </Container>
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No Websockets registered yet!"
                />
            )}
          </Main>
        </Shell>
        <DetailSidebar>
          {parseSelectedMessage && (
              <Container>
                <pre>{JSON.stringify(parseSelectedMessage, null, 2)}</pre>
              </Container>
          )}
        </DetailSidebar>
      </>
  );
}
