import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Table, Tag, Tabs, Modal, Tooltip, Select, InputNumber, Alert, Button, AutoComplete, Badge, Avatar, Typography, message, notification, Spin } from 'antd';
import { RadarChartOutlined, PieChartOutlined, BarChartOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import SecureLS from 'secure-ls';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import QueueAnim from 'rc-queue-anim';
import { getChildrenToRender, isImg } from './InitQR/utils';
import { Column, Pie, measureTextWidth, Radar } from '@ant-design/charts';



const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;




const ReportChart = (props) => {
  console.log(props)
  const { ...tagProps } = props;
  const { dataSource } = tagProps;
  const { wrapper, page, titleWrapper } = dataSource;

  const [loading, setLoading] = useState(true);

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
    // const resp = await DoiBongServices.get();
    // setListDoiBong(resp.data);
    // setLoading(false)
    // props.changeValue();
  }

  const renderStatistic = (containerWidth, text, style) => {
    var _measureTextWidth = (0, measureTextWidth)(text, style),
      textWidth = _measureTextWidth.width,
      textHeight = _measureTextWidth.height;
    var R = containerWidth / 2;
    var scale = 1;
    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))),
        ),
        1,
      );
    }
    var textStyleStr = 'width:'.concat(containerWidth, 'px;');
    return '<div style="'
      .concat(textStyleStr, ';font-size:')
      .concat(scale, 'em;line-height:')
      .concat(scale < 1 ? 1 : 'inherit', ';">')
      .concat(text, '</div>');
  }

  const config = {
    data: props.height_weight,
    isGroup: true,
    xField: 'doibong',
    yField: 'height_weight',
    seriesField: 'name',
    label: {
      position: 'middle',
      content : function content ( item ) {   
        return '' . concat ( item . height_weight. toFixed ( 2 ) ) ;   
      } ,
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
  };

  var config1 = {
    appendPadding: 10,
    data: props.area,
    angleField: 'count',
    colorField: 'area',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: 'S??? ?????i b??ng theo khu v???c',
      },
    },
  };


  const ageConfig = {
    data: props.age,
    xField: "name",
    yField: "age",
    meta: {
      age: {
        alias: "Tu???i",
        min: 0,
        nice: true
      }
    },
    xAxis: {
      line: null,
      tickLine: null
    },
    yAxis: {
      label: false,
      grid: {
        alternateColor: "rgba(0, 0, 0, 0.04)"
      }
    },
    point: {},
    area: {}
  };

  const tableLoading = {
    spinning: loading,
    indicator: <Spin size="large">
    </Spin>,
  }


  return (
    <div {...props} {...wrapper}>
      <div {...page}>
        <div key="title" {...titleWrapper}>
          {titleWrapper.children.map(getChildrenToRender)}
        </div>
        <OverPack {...dataSource.OverPack}>
          <QueueAnim 
          style={{textAlign:'center'}}
            type="bottom"
            leaveReverse
            ease={['easeOutQuad', 'easeInOutQuad']}
            key="content"
          >
            <Tabs defaultActiveKey="1" centered>
              <TabPane tab="Chi???u cao _ c??n n???ng" key="1">
              <Tag style={{ marginBottom: "2%", height: "4vh" }} icon={<BarChartOutlined />} color="error">
                  Bi???u ????? chi???u cao c??n n???ng trung b??nh c???a c??c ?????i b??ng
                </Tag>
                <Column style={{ marginBottom: "10%", height: "60vh" }} {...config} />

              </TabPane>
              <TabPane tab="????? tu???i" key="2" >
                <Tag style={{ marginBottom: "2%", height: "4vh" }} icon={<RadarChartOutlined />} color="error">
                  Bi???u ????? ????? tu???i trung b??nh c???a c??c ?????i b??ng
                </Tag>
                <Radar style={{ marginBottom: "10%", height: "60vh" }} {...ageConfig} />
              </TabPane>
              <TabPane tab="Khu v???c" key="3">
                <div>
                  <Tag style={{ marginBottom: "2%", height: "4vh" }} icon={<PieChartOutlined />} color="error">
                    Bi???u ????? s??? l?????ng ?????i b??ng theo khu v???c
                  </Tag>
                  <Pie style={{ marginBottom: "10%", height: "60vh", marginLeft: '9%' }} {...config1} />

                </div>

              </TabPane>
            </Tabs>
          </QueueAnim>
        </OverPack>
      </div>
    </div>




  );
};

export default ReportChart;
