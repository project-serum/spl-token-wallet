import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
html,body{
  min-width: 1440px;
  background: #171b26;
  font-size: 16px;
  color: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.8)'};
}
.ant-table-tbody > tr.ant-table-row:hover > td {
  background: #273043;
}
.ant-table-tbody > tr > td {
  border-bottom: 8px solid #161b27;
}
.ant-table-container table > thead > tr:first-child th {
  border-bottom: none;
}
.ant-layout {
    background: transparent;
  }
  .ant-table {
    background: #1d2331;
  }
  .ant-table-thead > tr > th {
    background: #161b27;
  }
.ant-select-item-option-content {
  img {
    margin-right: 4px;
  }
}
.ant-popover-inner-content {
  fontsize: 12px;
  color: #fff;
  background: #000;
  padding: 6px 14px;
  border-radius: 2px;
}
.ant-popover-placement-top > .ant-popover-content > .ant-popover-arrow{
  border-right-color: #000;
  border-bottom-color: #000;
}
.ant-popover-placement-bottom > .ant-popover-content > .ant-popover-arrow {
  border-color: #000;
}
.ant-popover-placement-top {
  top:5px;
}
.ant-steps-item-icon {
  width:36px;
  height:36px;
  line-height:36px;
}
.ant-steps-item-icon .ant-steps-icon {
  font-family: Robotoo;
  font-style: italic;
  font-weight: bold;
  font-size: 22px;
  position: relative;
  top:0;
  left: -1px;
}
.ant-steps-item-wait .ant-steps-item-icon{
  background: ${({ theme }) => (theme.mode === 'dark' ? '#232429' : '#9b9b9b')};
  border:none;
  > .ant-steps-icon{
    color: ${({ theme }) => (theme.mode === 'dark' ? '#adaeb2' : '#fff')};
  }
}
.ant-btn-primary[disabled],.ant-btn-primary[disabled]:hover {
  background:#74daf6;
  opacity: 0.5;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#21222a' : '#fff')};
}
.ant-btn-primary,.ant-btn-primary:hover, .ant-btn-primary:focus {
  color: ${({ theme }) => (theme.mode === 'dark' ? '#21222a' : '#fff')};
  height: 52px;
}
.ant-btn-background-ghost.ant-btn-primary{
  color: ${({ theme }) => theme[theme.mode].primaryColor};
  border-color: ${({ theme }) => theme[theme.mode].primaryColor};
  :active,:focus {
    color: ${({ theme }) => theme[theme.mode].primaryColor};
    border-color: ${({ theme }) => theme[theme.mode].primaryColor};
  }
}
.ant-btn {
  height: 52px;
}
.ant-modal-close {
  color: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.45)' : '#000'};
    :hover{
      color: ${({ theme }) =>
        theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.75)' : '#333'};
    }
}
.ant-form-item-label > label {
  font-size: 20px;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#fff' : '#98a1af')};
}
.ant-btn-background-ghost {
  border-color: ${({ theme }) => theme[theme.mode].primaryColor};
  color: ${({ theme }) => theme[theme.mode].primaryColor};
}
.ant-btn-primary {
  font-size: 18px;
  background: ${({ theme }) => theme[theme.mode].primaryColor};
  border-color: ${({ theme }) => theme[theme.mode].primaryColor};
}
.anticon-check.ant-steps-finish-icon {
  vertical-align: -4px;
  position: relative;
  left: 1px;
}
.ant-input-affix-wrapper-lg {
  height:52px;
  background-color: ${({ theme }) =>
    theme.mode === 'dark' ? '#232429' : '#f5efff'};
  border-color: ${({ theme }) =>
    theme.mode === 'dark' ? '#434343' : '#7541eb'};
}
.ant-input-affix-wrapper {
  color: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(255,255,255,0.65)' : '#000'};
}
input::-webkit-input-placeholder {
  color: ${({ theme }) => (theme.mode === 'dark' ? '' : '#4a4a4a')}!important;
}
.ant-modal-content,.ant-modal-header {
  border-radius: 20px;
  background: ${({ theme }) => theme[theme.mode].background};
}
.ant-modal-header {
  padding-top: 32px;
  border:none;
  .ant-modal-title{
     color: ${({ theme }) =>
       theme.mode === 'dark'
         ? 'rgba(255, 255, 255, 0.65)'
         : '#4a4a4a'}!important;
  }
}
.ant-input {
  color: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.65)' : '#4a4a4a'}!important;
  background-color: ${({ theme }) =>
    theme.mode === 'dark' ? 'transparent' : '#f5efff'};
  border-color: ${({ theme }) =>
    theme.mode === 'dark' ? '#434343' : '#3b06b5'};
}
.ant-select-item {
  font-size: 16px;
}
.ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
  color: #fff;
}
.ant-select-item-option-selected:not(.ant-select-item-option-disabled),.ant-select-item-option-active:not(.ant-select-item-option-disabled) {
  background: transparent;
  &:hover {
    color: #fff;
  }
}
.ant-select-item-option-content {
  display: flex;
}
.ant-select-item {
  padding: 0 16px;
}
`;
