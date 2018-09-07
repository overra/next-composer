import React from "react";
import PropTypes from "prop-types";
import Component from "@reach/component-component";
import styled, { keyframes } from "react-emotion";
import { css } from "emotion";
import { withTheme } from "emotion-theming";
import Color from "color";
import Busy from "./busy";

const shaded = (color, amount = 1) => {
  try {
    color = Color(color);
  } catch (e) {
    color = Color("#fff");
  }

  if (color.luminosity() < 0.5) {
    color = color.lighten(0.4 * amount);
  } else {
    color = color.darken(0.1 * amount);
  }
  return color.alpha() === 1 ? color.hex() : color.rgb().string();
};

const contrastText = (bgColor, [light, dark], opposite) => {
  let color;
  try {
    color = Color(bgColor);
  } catch (e) {
    color = Color("#ccc");
  }
  return color.contrast(Color(light)) >= 4.5
    ? opposite
      ? dark
      : light
    : opposite
      ? light
      : dark;
};

const c = color => {
  try {
    return Color(color);
  } catch (e) {}
};

const ghost = (props, color) => {
  if (!props.ghost) return "";

  const ghost = css`
    border: 1px transparent solid;
    background-image: none;
    background-color: transparent;
    text-shadow: none;
    color: ${color};

    &:hover,
    &:hover:focus {
      background-color: ${Color(color)
        .desaturate(0.5)
        .fade(0.9)
        .rgb()
        .string()};
    }
    &:focus {
      background-color: ${Color(color)
        .desaturate(0.5)
        .fade(0.9)
        .rgb()
        .string()};
      box-shadow: inset 0 0 0 1px
        ${Color(color)
          .fade(0.5)
          .rgb()
          .string()};
    }
    & svg {
      filter: none !important;
    }
    & circle {
      fill: ${Color(shaded(color, 2))
        .desaturate(0.5)
        .rgb()
        .string()};
    }

    & circle:nth-child(2) {
      stroke: ${Color(shaded(color, 2))
        .desaturate(0.5)
        .rgb()
        .string()} !important;
    }
  `;
  return ghost;
};

const variants = props => {
  const { theme, variant } = props;
  const themeButton = color => {
    if (props.disabled) {
      color = Color(color)
        .desaturate(0.5)
        .rgb()
        .string();
    }
    return css`
      background-color: ${color};
      color: ${contrastText(color, ["white", "black"])};
      text-shadow: 0 1px 0
        ${contrastText(
          color,
          ["rgba(255,255,255,0.25)", "rgba(0,0,0,0.25)"],
          true
        )};
      &:focus:hover {
        background-color: ${shaded(color)};
      }
      &:hover {
        background-color: ${shaded(color)};
      }

      &:focus {
        background-color: ${shaded(color, 0.5)};
      }

      & .busy-spinner {
        filter: invert(${c(color)?.isDark() ? 1 : 0});
      }

      & circle {
        fill: ${shaded(color, 2)};
      }

      ${props.disabled
        ? css`
            cursor: not-allowed;
            pointer-events: auto;
            opacity: 0.5;
          `
        : ""} ${ghost(
        props,
        Color(color)
          .darken(0.5)
          .rgb()
          .string()
      )};
    `;
  };

  const variants = {
    default: themeButton(theme.default),
    primary: themeButton(theme.primary),
    secondary: themeButton(theme.secondary),
    danger: themeButton(theme.danger)
  };
  return variants[variant] ? variants[variant] : "";
};

const ripple = keyframes`
  from {
    r: 0;
    opacity: 1;
  }

  to {
    r: 100px;
    opacity: 0;
  }
`;

const Ripple = styled("svg")`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  & circle {
    animation: ${ripple} 500ms ease-in-out;
  }
`;

const StyledButton = styled("button")`
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  position: relative;
  padding: 4px 8px;
  line-height: 1.4em;
  background-color: #fefefe;
  border-radius: 3px;
  cursor: pointer;
  // prettier-ignore
  transition: 
    background-color 250ms linear,
    box-shadow 150ms linear,
    transform 125ms linear;
  // prettier-ignore
  box-shadow: 
    inset 0 0 0 1px rgba(255, 255, 255, 0),
    inset 0 0 0 1px transparent;
  border: 1px rgba(0, 0, 0, 0.15) solid;
  background-image: linear-gradient(to bottom, #fff, #eee);
  background-blend-mode: multiply;
  z-index: 1;
  box-sizing: border-box;

  &:hover {
    background-color: ${shaded("#fefefe")};
  }
  &:active {
    transform: scale(0.97) translate3d(0, 0, 0);
  }
  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.85),
      inset 0 0 0 1px transparent;
    background-color: ${shaded("#fefefe", 0.5)};
  }
  &:focus:hover {
    background-color: ${shaded("#fefefe")};
    // prettier-ignore
    transition: 
      background-color 250ms linear,
      box-shadow 150ms linear 500ms,
      transform 125ms linear;
  }

  & svg {
    pointer-events: none;
  }

  ${variants};
`;

const BusyIndicatorContainer = styled("span")`
  position: absolute;
  display: flex;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const HiddenChildren = styled("div")`
  visibility: hidden;
`;

const Button = ({ component = "button", children, ...props }) => {
  let Button = StyledButton;
  if (component && component !== "button") {
    Button = StyledButton.withComponent(component);
  }
  const content = props.busy ? (
    <>
      <BusyIndicatorContainer>
        <Busy size={24} thickness={2} />
      </BusyIndicatorContainer>
      <HiddenChildren>{children}</HiddenChildren>
    </>
  ) : (
    children
  );
  return (
    <Component initialState={{ pos: [], timer: null }}>
      {({ setState, state }) => (
        <Button
          {...props}
          onClick={(...args) => {
            if (typeof props.onClick === "function") {
              props.onClick(...args);
            }

            const [{ pageX, pageY }] = args;
            const { target } = args[0];
            const [rect] = target.getClientRects();
            if (state.timer) {
              clearTimeout(state.timer);
            }
            const timer = setTimeout(() => {
              setState(state => ({ pos: [] }));
            }, 5000);
            setState(state => ({
              pos: [...state.pos, [pageX - rect.x, pageY - rect.y]],
              timer
            }));
          }}
        >
          {state.pos ? (
            <Ripple>
              {state.pos.map(pos => (
                <circle cx={pos[0]} cy={pos[1]} />
              ))}
            </Ripple>
          ) : null}
          {content}
        </Button>
      )}
    </Component>
  );
};

Button.propTypes = {
  /** Custom element or component to use as a base */
  component: PropTypes.node,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(["default", "primary", "secondary", "danger"]),
  /** Display busy indicator */
  busy: PropTypes.bool,
  ghost: PropTypes.bool
};

Button.defaultProps = {
  component: "button",
  variant: "default"
};

export default Button;
