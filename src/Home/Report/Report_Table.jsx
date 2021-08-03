import React, { useState, useEffect, useRef } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { Input, Tag, Tabs, Select, DatePicker, Button, Space, Typography, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import SecureLS from 'secure-ls';
import { Table } from "ant-table-extensions";
import MeetingServices from '../../services/meeting.services';
import UserServices from '../../services/user.services';
import useSound from 'use-sound';
import qrSound from '../../../src/qr.mp3';
import ReportServices from '../../services/report.services';
import api from '../../services/api';
import moment from 'moment';
import appsettings from '../../appsetting.json';


const { TabPane } = Tabs;
const { Option } = Select;
var ls = new SecureLS({ encodingType: 'aes', isCompression: false, encryptionSecret: appsettings.encryption_secret });

const ReportTable = () => {
    const [play] = useSound(qrSound);
    const inputRef = React.useRef(null)
    const { RangePicker } = DatePicker;
    const { Text, Link } = Typography;
    const [user,setUser] = useState('');
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    useEffect(async () => {
        var profile = JSON.parse(ls.get('profile'))?.email;
        console.log(profile)
        setUser(profile);
        const resp = await ReportServices.guest_from_to({
            fromDate: moment().startOf('month'),
            toDate: moment().endOf('month'),
            user: profile,
        });
        setData(resp.data)
    }, []);

    const get_meeting = async () => {
        const resp = await MeetingServices.get();
    }

    const get_users = async () => {
        const resp = await UserServices.get();
        console.log(resp);
    }

    const handleClick = () => {
        play();
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };


    const handleSearchTable = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input

                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearchTable(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearchTable(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
              </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
              </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);

                        }}
                    >
                        Filter
              </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {

        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'STT',
            key: 'index',
            render: (text, record, index) => index+1,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'),
            width: 400
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
            ...getColumnSearchProps('subject'),
        },
        {
            title: 'Host',
            dataIndex: 'host',
            key: 'host',
            ...getColumnSearchProps('host'),
        },
        {
            title: 'Host',
            dataIndex: 'room',
            key: 'room',
            ...getColumnSearchProps('room'),
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Check in', dataIndex: 'checkin', key: 'checkin', align: 'center',
        },
        {
            title: 'Check out', dataIndex: 'checkout', key: 'checkout', align: 'center',
        },
    ];

    const onChange = async (dates, dateStrings) => {
        const resp = await ReportServices.guest_from_to({
            fromDate: dates[0],
            toDate: dates[1],
            user: user
        })
        setData(resp.data)
        console.log('From: ', dates[0], ', to: ', dates[1]);
        console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    }

    return (
        <Tabs defaultActiveKey="1" centered >
            <TabPane tab="Danh sách khách hôm nay" style={{ textAlign: 'center' }} key="1">
                <Text strong>Chọn Ngày Xem Báo Cáo: </Text>
                <RangePicker size='large' style={{ marginBottom: '2%' }}
                    defaultValue={[moment().startOf('month'), moment().endOf('month')]}
                    ranges={{
                        Today: [moment(), moment()],
                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                    }}
                    onChange={onChange}
                />
                <Table columns={columns} dataSource={data} exportable />
                <div style={{ display: 'none' }} ref={inputRef} onClick={handleClick}>
                    hello
                </div>
            </TabPane>
            <TabPane tab="Báo cáo" key="2">

            </TabPane>

        </Tabs>
    );
};

export default ReportTable;
