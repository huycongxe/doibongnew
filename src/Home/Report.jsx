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
        content: 'Số đội bóng theo khu vực',
      },
    },
  };


  const ageConfig = {
    data: props.age,
    xField: "name",
    yField: "age",
    meta: {
      age: {
        alias: "Tuổi",
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
            type="bottom"
            leaveReverse
            ease={['easeOutQuad', 'easeInOutQuad']}
            key="content"
          >
            <Tabs defaultActiveKey="1" centered>
              <TabPane tab="Chiều cao _ cân nặng" key="1">
              <Tag style={{ marginBottom: "2%", height: "3vh", marginLeft: '39%' }} icon={<BarChartOutlined />} color="error">
                  Biểu đồ chiều cao cân nặng trung bình của các đội bóng
                </Tag>
                <Column style={{ marginBottom: "10%", height: "60vh" }} {...config} />

              </TabPane>
              <TabPane tab="Độ tuổi" key="2">
                <Tag style={{ marginBottom: "2%", height: "3vh", marginLeft: '39%' }} icon={<RadarChartOutlined />} color="error">
                  Biểu đồ độ tuổi trung bình của các đội bóng
                </Tag>
                <Radar style={{ marginBottom: "10%", height: "60vh" }} {...ageConfig} />
              </TabPane>
              <TabPane tab="Khu vực" key="3">
                <div>
                  <Tag style={{ marginBottom: "2%", height: "3vh", marginLeft: '39%' }} icon={<PieChartOutlined />} color="error">
                    Biểu đồ số lượng đội bóng theo khu vực
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
