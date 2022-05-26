# Websocket Plugin for Flipper

Websocket Flipper Plugin

![screenshot of the plugin](https://i.imgur.com/D51uYt9.png)

This plugin allows
- Monitoring the Websocket Tunnel
- Send data to server through the socket
- Mock 'Received' Data

## Get Started

```bash
yarn add basil-ws-flipper react-native-flipper
# for iOS
cd ios && pod install
```

### Add the middleware into your redux store:

In React Native bootstrap add: 

```javascript

if (__DEV__) {
  require('basil-ws-flipper').wsDebugPlugin;
}

```

### Install [flipper-plugin-basil-ws](https://github.com/Matju-M/flipper-plugin-basil-ws) in Flipper desktop client:

```
Manage Plugins > Install Plugins > search "basil-ws" > Install
```

Start your app, then you should be able to see 

![screenshot of the plugin](https://i.imgur.com/ADmbD40.png)

By Default it will be in the `DISABLED` Section.



