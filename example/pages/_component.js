import React, { Component } from "react";
import dynamic from "next/dynamic";

class LoadComponent extends Component {
  static async getInitialProps({ query }) {
    const { component } = query;
    return { component };
  }

  state = {
    Component: null
  };

  componentDidMount() {
    const Component = System.import(
      /*  webpackInclude: /\.js$/,  webpackMode: "lazy" */

      "../components/" + this.props.component
    ).then(res => this.setState({ Component: res.default }));
  }

  render() {
    const { Component } = this.state;
    if (!Component) return null;
    return <Component />;
  }
}

export default LoadComponent;
