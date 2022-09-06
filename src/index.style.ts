import { styled } from "flipper-plugin";
import { Select } from "antd";
import {
	Layout,
} from 'flipper-plugin';

export const Shell = styled(Layout.Container)`
  height: 100vh;
`;

export const Toolbar = styled(Layout.Container)`
  flex: 0 0 auto;
`;

export const Main = styled(Layout.ScrollContainer)`
  flex: 1 1 100%;
`;

export const Container = styled(Layout.Container)`
  width: 100%;
  padding: 16px;
`;

export const Item = styled.div`
  width: 100%;
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  margin: 0 -8px;
  
  background: red;
  
  & > * {
    padding: 0 16px;
  }
`;

export const ItemIcon = styled.div`
  order: 0;
  flex: 0 0 auto;
  align-self: auto;
  background: pink;
`;

export const ItemMain = styled.div`
  flex: 1 1 50%;
  align-self: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  background: blue;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direct: column;
  max-width: 100vh;
`;

export const ControlContainer = styled(Layout.Horizontal)`
  padding: 16px;
`;

export const Loader = styled.div`
  display: flex;
  height: 90vh;
`;

export const SSpan = styled.span`
  margin: auto;
`;

export const SSelect = styled(Select)`
  width: 100%;
`

export const SPre = styled.pre`
  display: inline-block;
  margin-bottom: 0;
`;
