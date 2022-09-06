import { styled } from "flipper-plugin";
import {
	Row,
	Col,
} from "antd";

export const Item = styled(Row)``;

export const ItemIcon = styled(Col)`
  padding: 12px 0;
`;

export const ItemMain = styled(Col)`
  padding: 12px 0;
`;

export const ItemAction = styled(Col)`
  padding: 12px 0;
`;

export const CodeBlock = styled.div`
  font-family: 'Courier New', Courier, monospace;
  font-size: 12px;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
