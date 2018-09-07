import React from "react";
import PropTypes from "prop-types";
import { withTheme } from "emotion-theming";
import styled, { keyframes } from "react-emotion";
import Color from "color";

const spin = size => keyframes`
  from {
    stroke-dashoffset: 0; 
  }
  to {
    stroke-dashoffset: ${Math.PI * 2 * size};
  }
`;

const inverted = props => (props.inverted ? "filter: invert(1);" : "");
const radius = props => props.size / 2 - props.thickness / 2;
const center = props => props.size / 2;

const Spinner = styled("svg")`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  pointer-events: none;
  & circle:nth-child(1) {
    fill: none;
    stroke: ${props =>
      Color(props.color)
        .fade(2 / 3)
        .rgb()
        .string()};
    stroke-width: ${props => props.thickness};
    r: ${radius};
    cy: ${center};
    cx: ${center};
  }
  & circle:nth-child(2) {
    animation: ${props => spin(radius(props))} ${props => props.duration}ms
      linear infinite;
    fill: none;
    stroke: ${props => props.color};
    stroke-width: ${props => props.thickness};
    stroke-dasharray: ${props => {
      const r = radius(props);
      const c = Math.PI * 2 * r;
      const len = c * 0.2;
      return `${len} ${c - len}`;
    }};
    r: ${radius};
    cy: ${center};
    cx: ${center};
  }
`;

const ThemeSpinner = withTheme(({ theme, children }) => children({ theme }));

const Busy = props => (
  <ThemeSpinner>
    {({ theme }) =>
      theme.busyIndicator || (
        <Spinner {...props} className="busy-spinner">
          <circle />
          <circle />
        </Spinner>
      )
    }
  </ThemeSpinner>
);

Busy.propTypes = {
  size: PropTypes.number,
  thickness: PropTypes.number,
  duration: PropTypes.number,
  color: PropTypes.string
};

Busy.defaultProps = {
  size: 32,
  thickness: 4,
  duration: 500,
  color: "rgba(0,0,0,0.3)"
};

export default Busy;
