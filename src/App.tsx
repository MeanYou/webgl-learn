import { ConfigProvider } from "antd";
import React from 'react';
// import Example from "./examples/Example1";
// import Example from "./examples/01Texture";
import Example from "./examples/02Translation2D";
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import './App.less';
import dayjs from "dayjs";

dayjs.locale('zh-cn');

const App = () => {
    return <ConfigProvider locale={zhCN}>
        <div className="app">
            <Example />
        </div>
    </ConfigProvider>
};

export default App;