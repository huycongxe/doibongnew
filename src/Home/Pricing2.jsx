import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Table, Tag, Tabs, Modal, Tooltip, Select, InputNumber, Space, Button, AutoComplete, Badge, Avatar, Typography, message, notification, Spin } from 'antd';
import { MinusCircleOutlined, PlusOutlined, SmileOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import SecureLS from 'secure-ls';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';
import { getChildrenToRender, isImg } from './utils';


import moment from 'moment';
import DoiBongServices from '../services/doibong.services';
import CauThuServices from '../services/cauthu.services';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;


const ModalForm = ({ isEdit, visible, onCreate, onCancel, recordEdit, onEdit }) => {
  console.log(recordEdit)
  const [form] = Form.useForm();
  const [is_team, setIs_team] = useState(false);
  const [record, setRecord] = useState(recordEdit);
  useResetFormOnCloseModal({
    recordEdit,
    form,
    visible,
  });

  useEffect(() => form.resetFields(), [recordEdit, isEdit]);

  const Ok = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields();
        if (!isEdit) {
          onCreate(values);
        } else {
          onEdit(values, recordEdit?.id);
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  }


  return (
    <Modal
      visible={visible}
      title={isEdit ? "Chỉnh sửa đội bóng" : "Thêm đội bóng"}
      okText="Ok"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={Ok}
    >
      <Form
        form={form}
        layout="vertical"
        name="them_doi_bong"
        initialValues={recordEdit}
      >
        <Form.Item
          label="Tên đội bóng"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên đội bóng!' }]}
        >
          <Input />

        </Form.Item>

        <Form.Item
          label="Mã đội bóng"
          name="short_name"
          rules={[{ required: true, message: 'Vui lòng nhập mã đội bóng!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="area" label="Khu vực" rules={[{ required: true, message: 'Vui lòng chọn khu vực!' }]}>
          <Select
            placeholder="Chọn khu vực"
            allowClear
          >
            <Option value="Asia">Asia</Option>
            <Option value="Africa">Africa</Option>
            <Option value="Europe">Europe</Option>
            <Option value="North America">North America</Option>
            <Option value="South America">South America</Option>
            <Option value="Australia">Australia</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>

  );
};

const CauThuForm = ({ isEdit, visible, onCreateCT, onCancel, recordEdit, onEditCT, doibong }) => {
  console.log(recordEdit)
  const [ct_form] = Form.useForm();
  useResetCTFormOnCloseModal({
    ct_form,
    visible,
  });

  useEffect(() => ct_form.resetFields(), [recordEdit, isEdit, doibong]);

  const Ok = () => {
    ct_form
      .validateFields()
      .then(values => {
        ct_form.resetFields();
        if (!isEdit) {
          onCreateCT(values,doibong?.id);
        } else {
          onEditCT(values, recordEdit?.id);
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  }

  const validateMessages = {
    required: 'Vui lòng nhập ${label} cầu thủ!',
    types: {
      number: '${label} cầu thủ không hợp lệ!',
    },
    number: {
      range: '${label} cầu thủ phải từ ${min} đến ${max}',
    },
  };


  return (
    <Modal
      visible={visible}
      title={isEdit ? "Chỉnh sửa cầu thủ" : "Thêm cầu thủ"}
      okText="Ok"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={Ok}
    >
      <Form
        validateMessages={validateMessages}
        form={ct_form}
        layout="vertical"
        name="them_cau_thu"
        initialValues={recordEdit}
      >
        {!isEdit ? (
          <Form.Item
          name="doibong_id"
          label="Đội tuyển"
          hasFeedback
        >
          <Select defaultValue={doibong?.id} disabled>
            <Option value={doibong?.id}>{doibong?.name}</Option>
          </Select>
        </Form.Item>
        ) : (null)}
        
        <Form.Item
          label="Tên cầu thủ"
          name="name"
          rules={[{ required: true }]}
        >
          <Input />

        </Form.Item>

        <Form.Item
          label="Tuổi"
          name="age"
          rules={[{ required: true, type: 'number', min: 0, max: 99 }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="Số áo"
          name="number"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Chiều cao"
          name="height"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Cân nặng"
          name="weight"
        >
          <Input />
        </Form.Item>


      </Form>
    </Modal>

  );
};

// reset form fields when modal is form, closed
const useResetFormOnCloseModal = ({ form, visible }) => {
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

// reset form fields when modal is form, closed
const useResetCTFormOnCloseModal = ({ ct_form, visible }) => {
  const prevVisibleRef = useRef();
  useEffect(() => {
    prevVisibleRef.current = visible;
  }, [visible]);
  const prevVisible = prevVisibleRef.current;
  useEffect(() => {
    if (!visible && prevVisible) {
      ct_form.resetFields();
    }
  }, [visible]);
};




const DoiBongTable = (props) => {
  console.log(props)
  const { ...tagProps } = props;
  const { dataSource } = tagProps;
  const { Table: table, wrapper, page, titleWrapper } = dataSource;
  const [form] = Form.useForm();
  const [doibong, setDoibong] = useState(null);
  const [is_team, setIs_team] = useState(false);
  const [visibleCT, setVisibleCT] = useState(null);
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
  const [isEdit, setIdEdit] = useState(false);
  const [listDoiBong, setListDoiBong] = useState([]);
  const [recordEdit, setRecordEdit] = useState(null);
  const [isEditCT, setIsEditCT] = useState(false);
  const [recordEditCT, setRecordEditCT] = useState(null);

  const animType = {
    queue: 'bottom',
    one: {
      y: '+=30',
      opacity: 0,
      type: 'from',
      ease: 'easeOutQuad',
    },
  };

  useEffect(() => {
    get_doibong();
  }, []);

  const get_doibong = async () => {
    // var profile = JSON.parse(ls.get('profile'))?.email;
    const resp = await DoiBongServices.get();
    setListDoiBong(resp.data);
    setLoading(false)
    props.changeValue();
  }

  const showDeleteConfirm = async (record) => {
    console.log(record)
    confirm({
      title: 'Bạn có muốn xóa đội này?',
      icon: <ExclamationCircleOutlined />,
      content: `${record?.name}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        const resp = await DoiBongServices.delete(record.id);
        notification.open({
          message: 'Thông báo',
          description:
            'Xóa đội bóng thành công',
          icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
        await get_doibong();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const showDeleteCTConfirm = async (record) => {
    console.log(record)
    confirm({
      title: 'Bạn có muốn xóa cầu thủ này?',
      icon: <ExclamationCircleOutlined />,
      content: `${record?.name}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        const resp = await CauThuServices.delete(record.id);
        notification.open({
          message: 'Thông báo',
          description:
            'Xóa cầu thủ thành công!',
          icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        });
        await get_doibong();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
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

  const onCreate = async (values) => {
    const resp = await DoiBongServices.create(values)
    notification.open({
      message: 'Thông báo',
      description:
        'Tạo đội bóng thành công',
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
    setVisible(false);
    await get_doibong();
  };

  const onEdit = async (values, id) => {
    values.id = id;
    console.log(values);
    const resp = await DoiBongServices.edit(values)
    notification.open({
      message: 'Thông báo',
      description:
        'Chỉnh sửa đội bóng thành công',
      icon: <SmileOutlined style={{ color: '#108ee9' }} />,
    });
    setRecordEdit(null);
    setVisible(false);
    await get_doibong();
  };

  const onCreateCT = async (values,doibong_id) => {
    values.doibong = doibong_id;
    
    const resp = await CauThuServices.create(values)
    if(resp?.data?.status == 200){
      notification.open({
        message: 'Thông báo',
        description:
          'Tạo cầu thủ thành công',
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
      });
      setVisibleCT(false);
      await get_doibong();
    }else {
      notification.open({
        message: 'Thông báo',
        description:
          'Tạo cầu thủ không thành công',
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
      });
    }
    
  };

  const onEditCT = async (values, id) => {
    values.id = id;
    const resp = await CauThuServices.edit(values)
    if(resp?.data?.status == 200){
      notification.open({
        message: 'Thông báo',
        description:
          'Chỉnh sửa cầu thủ thành công',
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
      });
      setRecordEditCT(null);
      setVisibleCT(false);
      await get_doibong();
    }else {
      notification.open({
        message: 'Thông báo',
        description:
          'Chỉnh sửa cầu thủ không thành công',
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
      });
    }
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
      title: 'Tên đội bóng',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
      ...getColumnSearchProps('name'),
      width: 300
    },

    {
      title: 'Mã đội bóng',
      dataIndex: 'short_name',
      key: 'short_name',
      align: 'left',
      ...getColumnSearchProps('short_name'),
      width: 300
    },
    {
      title: 'Khu vực',
      dataIndex: 'area',
      key: 'area',
      render: text => {

        let area = 'geekblue';
        switch (text) {
          case 'Asia':
            area = 'red'
            break;

          case 'Africa':
            area = 'green'
            break;

          case 'Europe':
            area = 'gold'
            break;

          case 'North America':
            area = 'lime'
            break;

          case 'South America':
            area = 'cyan'
            break;

          case 'Australia':
            area = 'blue'
            break;

          default:
            break;
        }

        return (
          <Tag color={area} key={text}>
            {text.toUpperCase()}
          </Tag>
        );
      }
    },

    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          {

            <Space size="middle">
              <a onClick={() => {
                setDoibong(record)
                setVisibleCT(true);
              }}> Thêm cầu thủ</a>
              <a onClick={() => {
                setRecordEdit(record);

                setIdEdit(true);
                setVisible(true);
              }}> Chỉnh sửa</a>
              <a onClick={() => showDeleteConfirm(record)}> Xóa</a>
            </Space>

          }

        </>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const data = record.cauthu_set;

    const columns = [
      {
        title: 'Tên cầu thủ', dataIndex: 'name', key: 'name', align: 'center',
        render: (text) => (
          <a>{text}</a>
        ),
        width: 300
      },
      {
        title: 'Tuổi',
        dataIndex: 'age',
        key: 'age',
        render: text => <a>{text}</a>,
        // ...getColumnSearchProps('age'),
        width: 100
      },
      {
        title: 'Số áo',
        dataIndex: 'number',
        key: 'number',
        render: text => <a>{text}</a>,
        // ...getColumnSearchProps('number'),
        width: 150
      },
      {
        title: 'Chiều cao',
        dataIndex: 'height',
        key: 'height',
        render: text => <a>{text}</a>,
        // ...getColumnSearchProps('height'),
        width: 150
      },
      {
        title: 'Cân nặng',
        dataIndex: 'weight',
        key: 'weight',
        render: text => <a>{text}</a>,
        // ...getColumnSearchProps('weight'),
        width: 150
      },
      {
        title: 'Action',
        key: 'action',
        width: 400,
        render: (text, record) => (
          <>
            {
  
              <Space size="middle">
                
                  <a onClick={() => {
                    setRecordEditCT(record);
    
                    setIsEditCT(true);
                    setVisibleCT(true);
                  }}> Chỉnh sửa</a>
                  <a onClick={() => showDeleteCTConfirm(record)}> Xóa</a>
              </Space>
  
            }
  
          </>
        ),
      },
    ];

    console.log(data);

    return <Table columns={columns} dataSource={data} pagination={false} />;
  };


  const showUserModal = (record) => {
    console.log(record)
    setListEmail(record.attendees.map(x => x.email.trim()).concat(record.bonus.map(x => x.email.trim())));
    setMeetingSelect(record.key);
    setMeetingBonus(record.bonusMeeting)
    setVisible(true);

  };

  const hideUserModal = () => {
    // setListEmail([]);
    setVisible(false);
  };



  const tableLoading = {
    spinning: loading,
    indicator: <Spin size="large">
    </Spin>,
  }


  return (
    <div id="doibong_table" {...props} {...wrapper}>
      <div {...page}>
        <div key="title" {...titleWrapper}>
          {titleWrapper.children.map(getChildrenToRender)}
        </div>
        <OverPack {...dataSource.OverPack}>
          <QueueAnim
            type="bottom"
            leaveReverse
            ease={['easeOutQuad', 'easeInOutQuad']}
            key="content"
          >
            <ModalForm
              isEdit={isEdit}
              visible={visible}
              onCreate={onCreate}
              recordEdit={recordEdit}
              onEdit={onEdit}
              onCancel={() => {
                console.log("abc")
                setRecordEdit(null);
                setVisible(false);
              }}
            />

            <CauThuForm
              isEdit={isEditCT}
              visible={visibleCT}
              onCreateCT={onCreateCT}
              doibong={doibong}
              recordEdit={recordEditCT}
              onEditCT={onEditCT}
              onCancel={() => {
                console.log("abc")
                setRecordEditCT(null);
                setVisibleCT(false);
              }}
            />
            <Button type="primary" style={{ marginLeft: "2%" }} onClick={() => {
              setIdEdit(false);
              setVisible(true);
            }} icon={<PlusOutlined />}>
              Thêm đội bóng
            </Button>
            <Table style={{ height: '100%',padding: "2%", marginBottom: "5%" }}
              columns={columns}
              dataSource={listDoiBong}
              loading={tableLoading}
              expandable={{ expandedRowRender }}

            />
          </QueueAnim>
        </OverPack>
      </div>
    </div>




  );
};

export default DoiBongTable;
