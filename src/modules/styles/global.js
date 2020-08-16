import { createGlobalStyle } from 'styled-components'

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
ant-popover-placement-top {
  top:5px;
}

`
