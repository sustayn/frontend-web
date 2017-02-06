import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LineChart, XAxis, YAxis, Line, CartesianGrid } from 'recharts';

import {
  findNodeReq,
  openNodeChannel,
  closeNodeChannel,
} from 'actions/actions';

const mapStateToProps = (state, ownProps) => {
  const node = state.entities.nodes[parseInt(ownProps.params.id)] || {};
  return { node };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return bindActionCreators({
    findNodeReq,
    openNodeChannel,
    closeNodeChannel,
  }, dispatch);
};

export class NodesShow extends Component {
  componentDidMount() {
    if(this.props.findNodeReq) this.props.findNodeReq(this.props.params.id);
    if(this.props.openNodeChannel) this.props.openNodeChannel(this.props.params.id);
  }

  componentWillUnmount() {
    if(this.props.closeNodeChannel) this.props.closeNodeChannel(this.props.params.id);
  }

  render() {
    const node = this.props.node || {};
    const temperatures = node.temperatures || [];

    let formattedTemps = [];
    let ticks = [];
    if(temperatures.length > 0) {
      const firstDate = new Date(temperatures[0].time);
      const lastDate = new Date(temperatures[temperatures.length - 1].time);
      formattedTemps = temperatures.map((vObj) =>  {
        const d = new Date(vObj.time);
        const secOffset = Math.round(+d / 100 - +firstDate / 100) / 10;
        const time = secOffset;
        return { ...vObj, time };
      });

      const range = Math.round(+lastDate / 100 - +firstDate / 100) / 10;
      ticks = [0, 1, 2, 3, 4, 5].map((numerator) => `+${numerator * range / 5}`);
    }
    console.log(temperatures);
    console.log(ticks);
    return (
      <div>
        <div>{node.name}</div>
        <LineChart width={500} height={250} data={formattedTemps}>
          <XAxis dataKey='time' type='number' ticks={ticks} domain={[0, 'dataMax']} />
          <YAxis />
          <CartesianGrid strokeDasharray='3 3' />
          <Line type='monotone' dataKey='value' stroke='#8884d8' dot={false} isAnimationActive={false} />
        </LineChart>
      </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(NodesShow);