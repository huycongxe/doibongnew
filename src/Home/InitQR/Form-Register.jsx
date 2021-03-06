import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Table, Tag, Tabs, Modal, Checkbox, Select, Row, Space, Col, DatePicker, Button, AutoComplete, Badge, Avatar, Typography, message, notification, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined, SmileOutlined, SmileTwoTone, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import SecureLS from 'secure-ls';
import { HubConnectionBuilder } from '@microsoft/signalr';

import MeetingServices from '../../services/meeting.services';
import UserServices from '../../services/user.services';
import api from '../../services/api';
import appsettings from '../../appsetting.json';
import { ListDomain } from '../domain';

import moment from 'moment';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
// const baseURL = 'http://localhost:51790/';
const baseURL = 'http://172.16.160.51:8083/';
var ls = new SecureLS({ encodingType: 'aes', isCompression: false, encryptionSecret: appsettings.encryption_secret });


const ModalForm = ({ visible, listEmail, onCancel, onSubmit }) => {
    const [form] = Form.useForm();
    const [is_team, setIs_team] = useState(false);
    useResetFormOnCloseModal({
        form,
        visible,
        listEmail
    });


    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
        },
    };
    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 },
        },
    };

    const onFinish = (values) => {
        console.log(values);
        // if (Array.isArray(values.names)) {
        //     listEmail.push(...values.names);
        // }
        onSubmit(values.names, is_team);
        setIs_team(false);
        console.log('Success:', values);
    };

    const onChange = (e) => {
        setIs_team(e.target.checked);
    }

    const onClose = () => {
        setIs_team(false);
        onCancel();
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    // const onFinish = values => {
    //     onSubmit(values);
    //     console.log('Received values of form:', values);
    // };

    const onOk = () => {
        form.submit();
    };

    return (
        <Modal title="Danh s??ch Email nh???n QR" visible={visible} listEmail={listEmail} onOk={onOk} onCancel={onClose}>
            <Form form={form} onFinish={onFinish}
                onFinishFailed={onFinishFailed} {...formItemLayoutWithOutLabel}
            >
                <Form.Item {...formItemLayout}
                    label="Kh??ch m???i"
                >
                    {listEmail.length ? (
                        <ul style={{ listStyleType: 'none' }}>
                            {listEmail.map((user, index) => (
                                <li style={{ marginBottom: '3px' }} key={index} className="user">
                                    <Avatar icon={<SmileTwoTone />} />
                                    {user}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <Typography.Text className="ant-form-text" type="secondary">
                            ( <SmileOutlined /> Ch??a c?? kh??ch m???i n??o. )
                        </Typography.Text>
                    )
                    }
                </Form.Item>
                <Form.List
                    name="names"
                    rules={[
                        {
                            validator: async (_, names) => {
                                var length = !names ? 0 : names.length;
                                if (length < 1) {
                                    return Promise.reject(new Error('Ph???i c?? ??t nh???t 1 email'));
                                }
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map((field, index) => (
                                <Form.Item
                                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                    label={index === 0 ? 'Email' : ''}
                                    required={false}
                                    key={field.key}
                                >
                                    <Form.Item
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                type: 'email',
                                                message: "Vui l??ng nh???p email",
                                            },
                                            {
                                                pattern: /^[A-Za-z0-9._%+-]+@(?!(datvietvac.vn|dongtay.com.vn|dzones.vn|hn.datvietvac.vn|media.datvietvac.vn|mediatechgroup.vn|mtpictures.vn|nomadmgmt.vn|ooh.datvietvac.vn|tkl.vn|viechannel.vn|viedata.vn|viedigital.vn|vienetwork.vn|vienews.vn|vieon.vn|vieshop.vn|viezone.vn|thenamkhang.vn|namphuongfoundation.org|thinamphuong.vn))[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                                                message: "Vui l??ng kh??ng nh???p Email thu???c ?????tVi???tVAC"
                                            }
                                        ]}
                                        noStyle
                                    >
                                        <Input placeholder="Email kh??ch" style={{ width: '60%' }} />
                                    </Form.Item>
                                    {fields.length > 0 ? (
                                        <MinusCircleOutlined
                                            style={{ marginLeft: '3%' }}
                                            className="dynamic-delete-button"
                                            onClick={() => remove(field.name)}
                                        />
                                    ) : null}
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    style={{ width: '60%' }}
                                    icon={<PlusOutlined />}
                                >
                                    Th??m Email
                                </Button>

                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                            <Form.Item name="is_team">
                                {
                                    (listEmail.length + fields.length) < 3 ? null : (
                                        <Checkbox onChange={onChange} disabled={(listEmail.length + fields.length) < 3}>
                                            Kh??ch ??o??n
                                        </Checkbox>
                                    )
                                }

                            </Form.Item>
                        </>
                    )}
                </Form.List>

            </Form>
        </Modal >
    );
};

// reset form fields when modal is form, closed
const useResetFormOnCloseModal = ({ form, visible, listEmail }) => {
    const prevVisibleRef = useRef();
    useEffect(() => {
        prevVisibleRef.current = visible;
    }, [visible]);
    const prevVisible = prevVisibleRef.current;
    useEffect(() => {
        if (!visible && prevVisible) {
            form.resetFields();
        }
    }, [visible]);
};


const formItemLayout = {
    labelCol: {
        xs: {
            span: 20,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
            span: 20,
        },
        sm: {
            span: 14,
        },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 12,
        },
        sm: {
            span: 16,
            offset: 10,
        },
    },
};

const nextFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 24,
            offset: 0,
        },
    },
};

const Dropdown = (props) => {
    const handleChange = value => {
        props.setSelectedKeys([value]);
        // NOTE: the problem is that setState is async so calling confirm here doesn't work
        props.confirm();
        // works if you set timeout
        // setTimeout(() => this.props.confirm(), 10);
    };
    return (
        <DatePicker.RangePicker
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            placeholder={["from", "to"]}
            onChange={handleChange}
            ranges={{
                "2 days": [
                    moment()
                        .subtract(2, "days")
                        .startOf("day"),
                    moment().endOf("day")
                ]
            }}
        />
    )
}

const RegistrationForm = () => {
    const [form] = Form.useForm();
    const [result, setResult] = useState([]);
    const [is_team, setIs_team] = useState(false);
    const [profile, setProfile] = useState(null);
    const [visible, setVisible] = useState(false);
    const [listEmail, setListEmail] = useState([]);
    const [listMeeting, setListMeeting] = useState([]);
    const [listUsers, setListUsers] = useState([]);
    const [meetingSelect, setMeetingSelect] = useState(null);
    const [meetingBonus, setMeetingBonus] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [loading, setLoading] = useState(true);
    const [connection, setConnection] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const [nameError, setNameError] = useState(false);

    useEffect(() => {
        get_users();

        var profile = JSON.parse(ls.get('profile'));
        setProfile(profile);
        // Update the document title using the browser API
        get_meeting();
        setTimeout(() => {
            const newConnection = new HubConnectionBuilder()
                .withUrl(`${baseURL}${api.lobby.hub}?email=${profile?.email}`)
                .withAutomaticReconnect()
                .build();

            setConnection(newConnection);

        }, 1000);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');

                    connection.on('NewMeeting', message => {
                        get_meeting();
                        notification.open({
                            message: 'Th??ng b??o',
                            description:
                                'V???a c?? ng?????i t???o QR.',
                            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                        });
                    });

                    connection.on('UpdateCheckInOut', message => {
                        get_meeting();
                        notification.open({
                            message: 'Th??ng b??o',
                            description:
                                'V???a c?? ng?????i check in/check out.',
                            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
                        });
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const get_meeting = async () => {
        var profile = JSON.parse(ls.get('profile'))?.email;
        const resp = await MeetingServices.get(profile);
        setListMeeting(resp.data.data);
    }

    const get_users = async () => {
        const resp = await UserServices.get();
        setListUsers(resp.data);
        setLoading(false);

    }

    const onChange = (e) => {
        setIs_team(e.target.checked);
    }

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
            title: 'T??n cu???c h???p',
            dataIndex: 'subject',
            key: 'subject',
            render: text => <a>{text}</a>,
            ...getColumnSearchProps('subject'),
            width: 300
        },
        
        {
            title: 'Host',
            dataIndex: 'createBy',
            key: 'createBy',
            align: 'left',
            ...getColumnSearchProps('createBy'),
            width: 300
        },
        
        {
            title: 'Meeting',
            key: 'bonusMeeting',
            dataIndex: 'bonusMeeting',
            render: (state) => (
                <>
                    {state ? (
                        <span>
                            <Badge status="processing" />
                        T???o b??? sung
                        </span>
                    ) : (
                        <span>
                            <Badge status="default" />
                    T??? Outlook
                        </span>
                    )}

                </>
            ),
        },
        {
            title: 'Th???i gian',
            dataIndex: 'startDate',
            key: 'startDate',
            align: 'left',
            // filterDropdown: props => <Dropdown {...props} />,
        },
        {
            title: 'S??? ng?????i tham gia',
            key: 'attendees',
            align: 'center',
            render: record => <a>{record.attendees.length + record.bonus.length}</a>,
        },
        {
            title: '?????a ??i???m',
            dataIndex: 'resource',
            key: 'resource',
            render: text => {

                let color = 'geekblue';
                switch (text) {
                    case 'G???m Hoa':
                        color = 'red'
                        break;

                    case 'Bi???n B???c':
                        color = 'green'
                        break;

                    case 'N??i v??ng':
                        color = 'gold'
                        break;

                    case 'Ch??u L???c':
                        color = 'lime'
                        break;

                    case 'Con H???ng':
                        color = 'cyan'
                        break;

                    case 'M???t Nh??':
                        color = 'blue'
                        break;

                    case 'Th???nh Tr???':
                        color = 'purple'
                        break;

                    case 'Ng??n N??m':
                        color = 'magenta'
                        break;

                    case 'Demo Room':
                        color = 'orange'
                        break;

                    default:
                        break;
                }

                return (
                    <Tag color={color} key={text}>
                        {text.toUpperCase()}
                    </Tag>
                );
            }
        },

        {
            title: 'Tr???ng th??i',
            key: 'createdQR',
            dataIndex: 'createdQR',
            render: (state) => (
                <>
                    {state ? (
                        <span>
                            <Badge status="success" />
                        ???? t???o QR
                        </span>
                    ) : (
                        <span>
                            <Badge status="warning" />
                    Ch??a t???o QR
                        </span>
                    )}

                </>
            ),
        },

        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                    {
                        moment(record.startDate) > moment() ? (<Space size="middle">
                            <a onClick={() => showUserModal(record)}> T???o QR</a>
                        </Space>) : null
                    }

                </>
            ),
        },
    ];

    const expandedRowRender = (record) => {


        const data = [];


        record.attendees.forEach(element => {
            data.push({
                key: `ori_${element}_${record.key}`,
                email: element.email.trim(),
                checkin: element.checkin,
                checkout: element.checkout,
                isOriginal: true,
            })
        });

        record.bonus.forEach(element => {
            data.push({
                key: `bonus_${element}_${record.key}`,
                email: element.email.trim(),
                checkin: element.checkin,
                checkout: element.checkout,
                isOriginal: false,
            })
        });

        const columns = [
            {
                title: 'Email', dataIndex: 'email', key: 'email', align: 'center',
                render: (text) => (
                    <a>{text}</a>
                )
            },
            {
                title: 'Lo???i',
                align: 'center',
                key: 'isOriginal',
                dataIndex: 'isOriginal',
                render: (isOriginal) => (
                    <>
                        {isOriginal ? (
                            <span>
                                <Tag color="blue">T??? Outlook</Tag>
                            </span>
                        ) : (
                            <span>
                                <Tag color="magenta">
                                    B??? sung
                                </Tag>
                            </span>
                        )}

                    </>
                ),
            },
            {
                title: 'Check in', dataIndex: 'checkin', key: 'checkin', align: 'center',
            },
            {
                title: 'Check out', dataIndex: 'checkout', key: 'checkout', align: 'center',
            },
        ];

        console.log(data);

        return <Table columns={columns} dataSource={data} pagination={false} />;
    };

    const onFinish = async (values) => {
        var name = document.getElementById("rc_select_0") ? document.getElementById("rc_select_0").value : undefined;
        var name1 = document.getElementById("rc_select_1")? document.getElementById("rc_select_1").value : undefined;
        if (!name && !name1) {
            setNameError(true);
        }
        else {
            const model = {
                Email_organize: values.Email,
                Attendees: values.users,
                Is_team: values.users.length >= 3 ? is_team : false,
                Meeting_date: values.time,
                Meeting_room: showInput ? values.another_room : values.room,
                Meeting_context: values.content
            }
            try {
                const resp = await MeetingServices.create_qr(model);
                if (resp.status == 200) {
                    message.success('T???o QR th??nh c??ng');
                    form.resetFields(["another_room", "time", "room", "content", "users"])
                    setIs_team(false);
                }
            } catch (error) {
                message.error(error.response.data);
            }
        }

    };

    const config = {
        rules: [
            {
                type: 'object',
                required: true,
                message: 'Vui l??ng ch???n ng??y h???p!',
            },
        ],
    };

    const showUserModal = (record) => {
        console.log(record)
        setListEmail(record.attendees.map(x => x.email.trim()).concat(record.bonus.map(x => x.email.trim())));
        setMeetingSelect(record.key);
        setMeetingBonus(record.bonusMeeting)
        setVisible(true);

    };

    const hideUserModal = () => {
        setListEmail([]);
        setVisible(false);
    };

    const childSubmit = async (value, is_team) => {
        console.log(value, meetingBonus, is_team);
        if(meetingBonus) {
            try {
                const model = {
                    accessId: meetingSelect,
                    Attendees: value,
                    Is_team: value.length >= 3 ? is_team : false
                }
                const resp = await MeetingServices.create_qr_bonus_meeting(model);
                if (resp.status == 200) {
                    message.success('T???o QR th??nh c??ng');
                    setVisible(false);
                    get_meeting();
                }
            } catch (error) {
                message.error(error.response.data);
            }
        } else {
            const model = {
                Reservations_id: meetingSelect,
                Email_organize: profile?.email,
                Attendees: value,
                Is_team: value.length >= 3 ? is_team : false
            }
            try {
                const resp = await MeetingServices.create_qr_by_meeting(model);
                if (resp.status == 200) {
                    message.success('T???o QR th??nh c??ng');
                    setVisible(false);
                    get_meeting();
                }
            } catch (error) {
                message.error(error.response.data);
            }
        }
        


    }

    const handleSearch = (value) => {
        if (!value) {
            setNameError(true)
        }
        console.log(value)
        let res = listUsers.filter(x => x.display_name != undefined && x.email != undefined && x.display_name.toLowerCase().includes(value.toLowerCase()));
        console.log(res);
        setResult(res);
    };

    const handleSelect = (value, option) => {
        let res = listUsers.find(x => x.email != undefined && x.email == option.key);
        setNameError(false);
        form.setFieldsValue({
            Phone: res?.mobile,
            Email: res?.email,
            Company: res?.company,
            Department: res?.department
        })
        console.log(value, option)

    };

    const tableLoading = {
        spinning: loading,
        indicator: <Spin size="large">
        </Spin>,
    }

    const changeTab = (activeKey) => {
        if (activeKey == 2) {
            let res = listUsers.find(x => x.email != undefined && x.email == profile?.email);
            form.setFieldsValue({
                Phone: res?.mobile,
                Email: res?.email,
                Company: res?.company,
                Department: res?.department
            })
        }
    }

    const onRoomChange = (value) => {
        if (value == 'khac') {
            setShowInput(true);
        }
    }

    return (
        <Tabs defaultActiveKey="1" onChange={changeTab} centered>
            <TabPane tab="???? book ph??ng" key="1">
                <ModalForm visible={visible} listEmail={listEmail} onSubmit={childSubmit} onCancel={hideUserModal} />
                <Table style={{ padding: "2%" }}
                    columns={columns}
                    dataSource={listMeeting}
                    loading={tableLoading}
                    expandable={{ expandedRowRender }}
                // expandable={{
                //     expandedRowRender: record => <p style={{ marginLeft: '4%' }}>Danh s??ch ng?????i tham d???: {record.attendees.map(x => ` ${x}`)}</p>,
                // }} 
                />


            </TabPane>
            <TabPane tab="Ch??a book ph??ng" key="2">
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    initialValues={{
                        residence: ['zhejiang', 'hangzhou', 'xihu'],
                        prefix: '86',
                    }}
                    scrollToFirstError
                >
                    <Row>
                        <Col span={10}>
                            <Form.Item
                                name="name_nv"
                                label="T??n nh??n vi??n"
                            >
                                <AutoComplete
                                    // style={{
                                    //     width: 200,
                                    // }}
                                    defaultValue={profile?.display_name}
                                    onSearch={handleSearch}
                                    onSelect={handleSelect}
                                    placeholder="Nh???p t??n"
                                >
                                    {result.map((email) => (
                                        <Option key={email.email} value={email.display_name}>
                                            {email.display_name}
                                        </Option>
                                    ))}
                                </AutoComplete>
                                {nameError ? (
                                    <div class="ant-form-item-explain ant-form-item-explain-error"><div role="alert">Vui l??ng ch???n nh??n vi??n!</div></div>
                                ) : null}

                            </Form.Item>

                            <Form.Item
                                name="Phone"
                                label="S??? ??i???n tho???i"
                            >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                                name="Email"
                                label="Email nh??n vi??n"
                            >
                                <Input disabled />
                            </Form.Item>

                            <Form.Item
                                name="Company"
                                label="C??ng ty"
                            >
                                <Input disabled />
                            </Form.Item>

                            <Form.Item
                                name="Department"
                                label="Ph??ng ban"
                            >
                                <Input disabled />
                            </Form.Item>



                            <Form.Item name="time" label="Ng??y h???p" {...config}>
                                <DatePicker placeholder="Ch???n ng??y" showTime format="YYYY-MM-DD HH:mm" />
                            </Form.Item>

                            <Form.Item name="room" label="Ph??ng h???p" rules={[{ required: true, message: 'Vui l??ng ch???n ph??ng h???p!', }]}>
                                <Select
                                    onChange={onRoomChange}
                                    placeholder="Vui l??ng ch???n ph??ng h???p"
                                    allowClear
                                >
                                    <Option value="gamhoa">G???M HOA</Option>
                                    <Option value="bienbac">BI???N B???C</Option>
                                    <Option value="thinhtri">TH???NH TR???</Option>
                                    <Option value="chaulac">CH??U L???C</Option>
                                    <Option value="conhong">CON H???NG</Option>
                                    <Option value="pantry">PANTRY</Option>
                                    <Option value="khac">KH??C</Option>
                                </Select>
                            </Form.Item>
                            {
                                showInput ? (<Form.Item
                                    name="another_room"
                                    label="?????a ??i???m h???p"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui l??ng nh???p n??i h???p!',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                                ) : null
                            }

                            {/* <Form.Item
                        name="residence"
                        label="Habitual Residence"
                        rules={[
                            {
                                type: 'array',
                                required: true,
                                message: 'Please select your habitual residence!',
                            },
                        ]}
                    >
                        <Cascader options={residences} />
                    </Form.Item> */}

                            <Form.Item
                                name="content"
                                label="N???i dung"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui l??ng nh???p n???i dung li??n h???!',
                                    },
                                ]}
                            >
                                <TextArea
                                    placeholder="Nh???p n???i dung li??n h???"
                                    rows={4} />
                            </Form.Item>
                        </Col>
                        <Col span={13}>
                            <Form.List name="users" rules={[
                                {
                                    validator: async (_, users) => {
                                        if (!users || users.length < 1) {
                                            return Promise.reject(new Error('Ph???i c?? ??t nh???t 1 kh??ch'));
                                        }
                                    },
                                },
                            ]}>
                                {(fields, { add, remove }, { errors }) => (
                                    <>
                                        {fields.map(field => (
                                            <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                <Row gutter={16}>
                                                    <Col className="gutter-row" span={6}>
                                                        <Form.Item
                                                            {...field}
                                                            {...nextFormItemLayout}
                                                            name={[field.name, 'name']}
                                                            fieldKey={[field.fieldKey, 'name']}
                                                        >
                                                            <Input placeholder="H??? t??n" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col className="gutter-row" span={6}>
                                                        <Form.Item
                                                            {...field}
                                                            {...nextFormItemLayout}
                                                            name={[field.name, 'phone']}
                                                            fieldKey={[field.fieldKey, 'phone']}
                                                            rules={[
                                                                { required: true, message: 'Vui l??ng nh???p s??? ??i???n tho???i' },
                                                                {
                                                                    min: 9, max: 13, message: 'S??? ??i???n tho???i kh??ng h???p l???'
                                                                }]}
                                                        >
                                                            <Input placeholder="S??? ??i???n tho???i" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col className="gutter-row" span={6}>
                                                        <Form.Item
                                                            {...field}
                                                            {...nextFormItemLayout}
                                                            name={[field.name, 'email']}
                                                            fieldKey={[field.fieldKey, 'email']}
                                                            rules={[
                                                                { required: true, type: 'email', message: 'Vui l??ng nh???p Email' },
                                                                {
                                                                    pattern: /^[A-Za-z0-9._%+-]+@(?!(datvietvac.vn|dongtay.com.vn|dzones.vn|hn.datvietvac.vn|media.datvietvac.vn|mediatechgroup.vn|mtpictures.vn|nomadmgmt.vn|ooh.datvietvac.vn|tkl.vn|viechannel.vn|viedata.vn|viedigital.vn|vienetwork.vn|vienews.vn|vieon.vn|vieshop.vn|viezone.vn|thenamkhang.vn|namphuongfoundation.org|thinamphuong.vn))[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                                                                    message: "Kh??ng nh???p Email thu???c ?????tVi???tVAC"
                                                                }
                                                            ]}
                                                        >
                                                            <Input placeholder="Email" />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col className="gutter-row" span={6}>
                                                        <Form.Item
                                                            {...field}
                                                            {...nextFormItemLayout}
                                                            name={[field.name, 'company']}
                                                            fieldKey={[field.fieldKey, 'company']}
                                                        >
                                                            <Input placeholder="C??ng ty" />
                                                        </Form.Item>
                                                    </Col>

                                                </Row>


                                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Th??m kh??ch
                                            </Button>
                                            <Form.ErrorList errors={errors} />

                                        </Form.Item>

                                        <Form.Item name="is_team">
                                            <Checkbox onChange={onChange} disabled={(listEmail.length + fields.length) < 3}>
                                                Kh??ch ??o??n
                                            </Checkbox>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Col>
                    </Row>



                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            ????ng K??
                    </Button>
                    </Form.Item>
                </Form>




            </TabPane>

        </Tabs>
    );
};

export default RegistrationForm;
