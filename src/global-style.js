import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
html,body{
    background-color: #f7f7f7;
}

.ant-layout {
    background-color: #f7f7f7;
}

.ant-modal {
    top: 50px;
}

.ant-modal-content {
    display: flex;
    max-height: calc(100vh - 100px);
    flex-direction: column;
}

.ant-modal-body {
    flex: 1;
    overflow-y: auto;
}

.ant-alert-warning {
    border-radius: 10px;
    background: #fff7e6;
    border-width: 0px;
}

.ant-alert-warning .ant-alert-message {
    color: #FAAD15;
}

.ant-alert-warning .ant-alert-description {
    color: #FAAD15;
    font-size: 12px;
}

.ant-statistic-content-value {
    display:block;
    width:100%;
    word-wrap:break-word;
}
`;
