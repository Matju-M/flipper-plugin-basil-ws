import React, { useEffect, useMemo, useState } from 'react';
import map from 'lodash/map';
import {
  usePlugin,
  createState,
  useValue,
  Layout,
  PluginClient,
  styled
} from 'flipper-plugin';
import { List, Button, Tooltip, Select, Input } from 'antd';
import {
  CloseCircleOutlined,
  DownCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  UpCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Option } = Select;

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<any, any>) {
  const state = createState<Record<string, []>>({});

  const sendToSocket = (value: any, socketUrl: string) => {
    client.send('send', { data: value, socketUrl });
  };

  const sendMockToSocket = (value: any, socketUrl: string) => {
    client.send('mock', { data: value, socketUrl });
  };

  client.onMessage("send", ({ key, data }) => {
    state.update((draft: any) => {
      const message = { message: JSON.stringify(data, null, 2)?.replace(/\\/g, ''), type: "sent" };
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

      const formatted = JSON.stringify(data, null, 2)?.replace(/\\/g, '');
      if (!formatted) {
        return;
      }

      const message = { message: formatted, type: "received" };

      if (!draft[key]) {
        draft[key] = [message];
        return;
      }

      draft[key]?.push(message);
    })
  });

  client.onMessage('closed', ({ key, data }) => {
    state.update((draft: any) => {
      const message = { message: JSON.stringify(data, null, 2)?.replace(/\\/g, ''), type: "closed" };

      if (!draft[key]) {
        draft[key] = [message];
        return;
      }

      draft[key]?.push(message);
    })
  });

  client.onMessage('error', ({ key, data }) => {
    state.update((draft: any) => {
      const message = { message: JSON.stringify(data, null, 2)?.replace(/\\/g, ''), type: "error" };
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

  const firstSocket = useMemo(() => {
    return Object.keys(data)?.[0];
  }, [data]);

  return (
    <Layout.ScrollContainer>

      {!firstSocket && <Loader>
        <SSpan>
          No Websockets registered yet!
        </SSpan>
      </Loader>}
      {!!firstSocket &&
        <>
          <Toolbar>
            <ControlContainer>
              <Tooltip title="delete all">
                <Button icon={<DeleteOutlined />} onClick={handleOnDelete} />
              </Tooltip>

              <Input.Group compact style={{ marginLeft: '10px' }}>
                <Input style={{ maxWidth: '80%' }} onChange={(value) => setSendSocket(value.target.value)} />
                <Button type="primary" onClick={handleSend}>Send</Button>
              </Input.Group>

              <Input.Group compact style={{ marginLeft: '10px' }}>
                <Input style={{ maxWidth: '80%' }} onChange={(value) => setSendMock(value.target.value)} />
                <Button type="primary" onClick={handleMock}>Mock</Button>
              </Input.Group>
            </ControlContainer>

            <SelectContainer>
              <SSelect defaultValue={firstSocket} onChange={handleOnChange}>
                {map(data, (value, index) => (
                  <Option key={index} value={index}>{index}</Option>
                ))}
              </SSelect>
            </SelectContainer>
          </Toolbar>

          <List
            header={<div>Messages</div>}
            dataSource={data[selected]}
            renderItem={(item: any) => (<List.Item>
              {item.type === "info" && <InfoCircleOutlined style={{ color: 'deepskyblue', verticalAlign: 'top' }} />}
              {item.type === "received" && <DownCircleOutlined style={{ color: 'green', verticalAlign: 'top' }} />}
              {item.type === "sent" && <UpCircleOutlined style={{ color: 'orange', verticalAlign: 'top' }
              } />}
              {item.type === "error" && <ExclamationCircleOutlined style={{ color: 'red', verticalAlign: 'top' }} />}
              {item.type === "closed" && <CloseCircleOutlined style={{ color: 'gray', verticalAlign: 'top' }} />}
              {' '}
              <SPre>{item?.message}</SPre>
            </List.Item>)}
          />
        </>
      }
    </Layout.ScrollContainer>
  );
}

const ControlContainer = styled.div`
  display: flex;
  flex-direct: column;
  max-width: 90vh;  
`;

const Loader = styled.div`
  display: flex;
  height: 90vh;
`;

const SSpan = styled.span`
  margin: auto;
`;

const Toolbar = styled.div`
  margin: 10px;
`;

const SelectContainer = styled.div`
  margin: 10px 10px 10px 0;
  width: 50%;
`;

const SSelect = styled(Select)`
  width: 100%;
`

const SPre = styled.pre`
  display: inline-block;
  margin-bottom: 0;
`;
