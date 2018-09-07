import React from "react";
import { ThemeProvider } from "emotion-theming";
import { injectGlobal } from "emotion";
import Component from "@reach/component-component";
import styled from "react-emotion";

injectGlobal`
  html {
    touch-action: manipulation;
    /* Adjust font size */
    font-size: 100%;
    -webkit-text-size-adjust: 100%;
    /* Font varient */
    font-variant-ligatures: none;
    -webkit-font-variant-ligatures: none;
    /* Smoothing */
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;
    text-shadow: rgba(0, 0, 0, .01) 0 0 1px;
  }
`;

const theme = {
  default: "#fefefe",
  primary: "teal",
  secondary: "rebeccapurple",
  danger: "#a00"
  // busyIndicator: "Loading..."
};

export const Row = styled("div")`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;
`;

const ThemeSettings = styled("div")`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 16px;
  background-color: #eee;
  & > div {
    margin-bottom: 8px;
  }
  & input {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
    border: 0;
    padding: 4px 8px;
    line-height: 1.4;
    font-size: 12px;
    transition: border 125ms linear;
  }

  & input:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.75);
  }
`;

export default ({ children }) => (
  <Component initialState={{ theme, open: false }}>
    {({ setState, state }) => (
      <>
        {/* <ThemeSettings>
          <strong>Theme Settings</strong>
          {Object.keys(state.theme).map(key => (
            <div key={key}>
              <label>
                {key}:{" "}
                <input
                  type="text"
                  value={state.theme[key]}
                  onChange={evt => {
                    const { value } = evt.target;
                    console.log(value);
                    setState(({ theme }) => ({
                      theme: {
                        ...theme,
                        [key]: value
                      }
                    }));
                  }}
                />
              </label>
            </div>
          ))}
        </ThemeSettings> */}
        <ThemeProvider theme={state.theme}>{children}</ThemeProvider>
      </>
    )}
  </Component>
);
