/* eslint no-undef: 0 */
/* eslint arrow-parens: 0 */
import React from 'react';
import { enquireScreen } from 'enquire-js';

import Nav3 from './Nav3';
import Banner5 from './Banner5';
import Feature6 from './Feature6';
import DoiBongTable from './Pricing2'; 
import Teams4 from './Teams4';
import Footer2 from './Footer2';

import {
  Nav30DataSource,
  Banner50DataSource,
  ReportChartDataSource,
  Pricing20DataSource,
  Teams40DataSource,
  Footer20DataSource,
} from './data.source';
import './less/antMotionStyle.less';
import DoiBongServices from '../services/doibong.services';
import ReportChart from './Report';

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

const { location = {} } = typeof window !== 'undefined' ? window : {};

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile,
      show: !location.port, 
      age: [],
      area: [],
      height_weight: [],
      overallDataSource: {
        wrapper: { className: 'home-page-wrapper feature6-wrapper' },
        OverPack: { className: 'home-page feature6', playScale: 0.3 },
        Carousel: {
          className: 'feature6-content',
          dots: false,
          wrapper: { className: 'feature6-content-wrapper' },
          titleWrapper: {
            className: 'feature6-title-wrapper',
            barWrapper: {
              className: 'feature6-title-bar-wrapper',
              children: { className: 'feature6-title-bar' },
            },
            title: { className: 'feature6-title' },
          },
          children: [
            {
              title: {
                className: 'feature6-title-text',
                children: (
                  <span>
                    <span>
                      <span>
                        <p>TỔNG QUAN</p>
                        <p>
                          <br />
                        </p>
                      </span>
                    </span>
                  </span>
                ),
              },
              className: 'feature6-item',
              name: 'block0',
              children: [
                {
                  md: 8,
                  xs: 24,
                  className: 'feature6-number-wrapper',
                  name: 'child0',
                  number: {
                    className: 'feature6-number',
                    unit: {
                      className: 'feature6-unit',
                      children: (
                        <span>
                          <p>
                            <br />
                          </p>
                        </span>
                      ),
                    },
                    toText: true,
                    children: '0',
                  },
                  children: {
                    className: 'feature6-text',
                    children: (
                      <span>
                        <span>
                          <span>
                            <p>Đội bóng</p>
                          </span>
                        </span>
                      </span>
                    ),
                  },
                },
                {
                  md: 8,
                  xs: 24,
                  className: 'feature6-number-wrapper',
                  name: 'child1',
                  number: {
                    className: 'feature6-number',
                    unit: {
                      className: 'feature6-unit',
                      children: (
                        <span>
                          <p>
                            <br />
                          </p>
                        </span>
                      ),
                    },
                    toText: true,
                    children: '0',
                  },
                  children: {
                    className: 'feature6-text',
                    children: (
                      <span>
                        <span>
                          <p>Khu vực</p>
                        </span>
                      </span>
                    ),
                  },
                },
                {
                  md: 8,
                  xs: 24,
                  className: 'feature6-number-wrapper',
                  name: 'child2',
                  number: {
                    className: 'feature6-number',
                    unit: {
                      className: 'feature6-unit',
                      children: (
                        <span>
                          <p>
                            <br />
                          </p>
                        </span>
                      ),
                    },
                    toText: true,
                    children: '0',
                  },
                  children: {
                    className: 'feature6-text',
                    children: (
                      <span>
                        <span>
                          <p>Cầu thủ</p>
                        </span>
                      </span>
                    ),
                  },
                },
              ],
            },
            
          ],
        },
      },
    };
  }

  componentDidMount() {
    // 适配手机屏幕;
    enquireScreen((b) => {
      this.setState({ isMobile: !!b });
    });
    // dva 2.0 样式在组件渲染之后动态加载，导致滚动组件不生效；线上不影响；
    /* 如果不是 dva 2.0 请删除 start */
    if (location.port) {
      // 样式 build 时间在 200-300ms 之间;
      setTimeout(() => {
        this.setState({
          show: true,
        });
      }, 500);
    }
    /* 如果不是 dva 2.0 请删除 end */
  }

  changeValue = async () => {
    const resp = await DoiBongServices.overall();
    this.setState({
      overallDataSource: {
        wrapper: { className: 'home-page-wrapper feature6-wrapper' },
        OverPack: { className: 'home-page feature6', playScale: 0.3 },
        Carousel: {
          className: 'feature6-content',
          dots: false,
          wrapper: { className: 'feature6-content-wrapper' },
          titleWrapper: {
            className: 'feature6-title-wrapper',
            barWrapper: {
              className: 'feature6-title-bar-wrapper',
              children: { className: 'feature6-title-bar' },
            },
            title: { className: 'feature6-title' },
          },
          children: [
            {
              title: {
                className: 'feature6-title-text',
                children: (
                  <span>
                    <span>
                      <span>
                        <p>TỔNG QUAN</p>
                        <p>
                          <br />
                        </p>
                      </span>
                    </span>
                  </span>
                ),
              },
              className: 'feature6-item',
              name: 'block0',
              children: [
                {
                  md: 8,
                  xs: 24,
                  className: 'feature6-number-wrapper',
                  name: 'child0',
                  number: {
                    className: 'feature6-number',
                    unit: {
                      className: 'feature6-unit',
                      children: (
                        <span>
                          <p>
                            <br />
                          </p>
                        </span>
                      ),
                    },
                    toText: true,
                    children: `${resp.data.doibongs}`,
                  },
                  children: {
                    className: 'feature6-text',
                    children: (
                      <span>
                        <span>
                          <span>
                            <p>Đội bóng</p>
                          </span>
                        </span>
                      </span>
                    ),
                  },
                },
                {
                  md: 8,
                  xs: 24,
                  className: 'feature6-number-wrapper',
                  name: 'child1',
                  number: {
                    className: 'feature6-number',
                    unit: {
                      className: 'feature6-unit',
                      children: (
                        <span>
                          <p>
                            <br />
                          </p>
                        </span>
                      ),
                    },
                    toText: true,
                    children: `${resp.data.areas}`,
                  },
                  children: {
                    className: 'feature6-text',
                    children: (
                      <span>
                        <span>
                          <p>Khu vực</p>
                        </span>
                      </span>
                    ),
                  },
                },
                {
                  md: 8,
                  xs: 24,
                  className: 'feature6-number-wrapper',
                  name: 'child2',
                  number: {
                    className: 'feature6-number',
                    unit: {
                      className: 'feature6-unit',
                      children: (
                        <span>
                          <p>
                            <br />
                          </p>
                        </span>
                      ),
                    },
                    toText: true,
                    children: `${resp.data.cauthus}`,
                  },
                  children: {
                    className: 'feature6-text',
                    children: (
                      <span>
                        <span>
                          <p>Cầu thủ</p>
                        </span>
                      </span>
                    ),
                  },
                },
              ],
            },
            
          ],
        },
      }
    })
    const age = await DoiBongServices.age();
    this.setState({
      age: age.data
    })
    const area = await DoiBongServices.area();
    this.setState({
      area: area.data
    })

    const height_weight = await DoiBongServices.get_height_weight();
    this.setState({
      height_weight: height_weight.data
    })
  }

  render() {
    const children = [
      // <Nav3
      //   id="Nav3_0"
      //   key="Nav3_0"
      //   dataSource={Nav30DataSource}
      //   isMobile={this.state.isMobile}
      // />,
      <Banner5
        id="Banner5_0"
        key="Banner5_0"
        dataSource={Banner50DataSource}
        isMobile={this.state.isMobile}
      />,
      <Feature6
        id="Feature6_0"
        key="Feature6_0"
        dataSource={this.state.overallDataSource}
        isMobile={this.state.isMobile}
      />,
      
      <DoiBongTable
        id="Pricing2_0"
        key="Pricing2_0"
        changeValue={this.changeValue}
        dataSource={Pricing20DataSource}
        isMobile={this.state.isMobile}
      />,
      <ReportChart
        id="Pricing2_0"
        key="Pricing2_0"
        age = {this.state.age}
        area = {this.state.area}
        height_weight= {this.state.height_weight}
        dataSource={ReportChartDataSource}
        isMobile={this.state.isMobile}
      />,
      <Teams4
        id="Teams4_0"
        key="Teams4_0"
        dataSource={Teams40DataSource}
        isMobile={this.state.isMobile}
      />,
      <Footer2
        id="Footer2_0"
        key="Footer2_0"
        dataSource={Footer20DataSource}
        isMobile={this.state.isMobile}
      />,
    ];
    return (
      <div
        className="templates-wrapper"
        ref={(d) => {
          this.dom = d;
        }}
      >
        {/* 如果不是 dva 2.0 替换成 {children} start */}
        {this.state.show && children}
        {/* 如果不是 dva 2.0 替换成 {children} end */}
      </div>
    );
  }
}
