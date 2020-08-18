import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
html,body{
  min-width: 1440px;
  background: #171b26;
  font-size: 16px;
  color: rgba(255,255,255,0.6)
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
  background: #232429;
  border:none;
  > .ant-steps-icon{
    color:#adaeb2;
  }
}
.ant-btn-primary[disabled],.ant-btn-primary[disabled]:hover {
  background:#74daf6;
  opacity: 0.5;
  color: #21222a;
}
.ant-btn-primary,.ant-btn-primary:hover, .ant-btn-primary:focus {
  color: #21222a;
  height: 52px;
}
.ant-form-item-label > label {
  font-size: 20px;
  color:#fff;
  font-weight: 600;
}
.ant-btn-primary {
  font-size: 18px;
}
.anticon-check.ant-steps-finish-icon {
  vertical-align: -4px;
  position: relative;
  left: 1px;
}
.ant-input-affix-wrapper-lg {
  height:52px;
  background-color: #232429;
}
.ant-modal-content,.ant-modal-header {
  border-radius: 20px;
  background: #2b2c34;
}
.ant-modal-header {
  padding-top: 32px;
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
