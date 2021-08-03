/* eslint no-undef: 0 */
/* eslint arrow-parens: 0 */
import React from 'react';
import { enquireScreen } from 'enquire-js';

import Banner2 from './Banner2';

import { Banner20DataSource } from './data.source';
import './less/antMotionStyle.less';
import ReportTable from './Report_Table';

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

const { location = {} } = typeof window !== 'undefined' ? window : {};

export default class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile,
      show: !location.port,
    };
  }

  componentDidMount() {
  
  }

  render() {
    const children = [
      <Banner2
        id="Banner2_0"
        key="Banner2_0"
        dataSource={Banner20DataSource}
        isMobile={this.state.isMobile}
      />,
      <ReportTable/>
    ];
    return (
      <div
        className="templates-wrapper"
        ref={(d) => {
          this.dom = d;
        }}
      >
        {children}
      </div>
    );
  }
}
