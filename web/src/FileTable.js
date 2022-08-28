import React from "react";
import {Table} from 'antd';
import * as Setting from "./Setting";
import i18next from "i18next";

class FileTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  updateTable(table) {
    this.props.onUpdateTable(table);
  }

  parseField(key, value) {
    if (key === "data") {
      value = Setting.trim(value, ",");
      return value.split(",").map(i => Setting.myParseInt(i));
    }

    if ([].includes(key)) {
      value = Setting.myParseInt(value);
    }
    return value;
  }

  updateField(table, index, key, value) {
    value = this.parseField(key, value);

    table[index][key] = value;
    this.updateTable(table);
  }

  addRow(table) {
    let row = {no: table.length, name: `New Vector - ${table.length}`, data: []};
    if (table === undefined) {
      table = [];
    }
    table = Setting.addRow(table, row);
    this.updateTable(table);
  }

  deleteRow(table, i) {
    table = Setting.deleteRow(table, i);
    this.updateTable(table);
  }

  upRow(table, i) {
    table = Setting.swapRow(table, i - 1, i);
    this.updateTable(table);
  }

  downRow(table, i) {
    table = Setting.swapRow(table, i, i + 1);
    this.updateTable(table);
  }

  renderTable(table) {
    const columns = [
      {
        title: i18next.t("vectorset:File name"),
        dataIndex: 'title',
        key: 'title',
        // width: '200px',
        sorter: (a, b) => a.title.localeCompare(b.title),
        render: (text, record, index) => {
          return text;
        }
      },
      {
        title: i18next.t("store:Category"),
        dataIndex: 'isLeaf',
        key: 'isLeaf',
        width: '90px',
        sorter: (a, b) => a.isLeaf - b.isLeaf,
        render: (text, record, index) => {
          if (text) {
            return i18next.t("store:File");
          } else {
            return i18next.t("store:Folder");
          }
        }
      },
      {
        title: i18next.t("store:File type"),
        dataIndex: 'fileType',
        key: 'fileType',
        width: '120px',
        sorter: (a, b) => Setting.getExtFromPath(a.title).localeCompare(Setting.getExtFromPath(b.title)),
        render: (text, record, index) => {
          return record.title.split('.')[1];
        }
      },
      {
        title: i18next.t("vectorset:File size"),
        dataIndex: 'size',
        key: 'size',
        width: '120px',
        sorter: (a, b) => a.size - b.size,
        render: (text, record, index) => {
          if (!record.isLeaf) {
            return null;
          }

          return Setting.getFriendlyFileSize(text);
        }
      },
      {
        title: i18next.t("general:Created time"),
        dataIndex: 'createdTime',
        key: 'createdTime',
        width: '160px',
        sorter: (a, b) => a.createdTime.localeCompare(b.createdTime),
        render: (text, record, index) => {
          return Setting.getFormattedDate(text);
        }
      },
      {
        title: i18next.t("store:Collected time"),
        dataIndex: 'collectedTime',
        key: 'collectedTime',
        width: '160px',
        sorter: (a, b) => a.collectedTime.localeCompare(b.collectedTime),
        render: (text, record, index) => {
          const collectedTime = Setting.getCollectedTime(record.title);
          return Setting.getFormattedDate(collectedTime);
        }
      },
      {
        title: i18next.t("store:Subject"),
        dataIndex: 'subject',
        key: 'subject',
        width: '90px',
        sorter: (a, b) => a.subject.localeCompare(b.subject),
        render: (text, record, index) => {
          return Setting.getSubject(record.title);
        }
      },
      // {
      //   title: i18next.t("store:Path"),
      //   dataIndex: 'key',
      //   key: 'key',
      //   width: '100px',
      //   sorter: (a, b) => a.key.localeCompare(b.key),
      // },
    ];

    return (
      <Table rowKey="title" columns={columns} dataSource={table} size="middle" bordered pagination={false} />
    );
  }

  render() {
    return (
      <div>
        {
          this.renderTable(this.props.file.children)
        }
      </div>
    )
  }
}

export default FileTable;
