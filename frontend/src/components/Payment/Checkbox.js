import React from "react";
// import styled from ‘styled-components’

class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      checked: !!this.props.initialState,
    };

    // Hide checkbox visually but remain accessible to screen readers.
    this.HiddenCheckbox_style = {
      border: "0",
      clip: "rect(0 0 0 0)",
      clippath: "inset(50%)",
      height: "1px",
      margin: "-1px",
      overflow: "hidden",
      padding: "0",
      position: "absolute",
      whiteSpace: "nowrap",
      width: "1px",
    };

    this.CheckboxContainer_style = {
      display: "inline-block",
      verticalAlign: "middle",
    };

    this.Icon_style = {
      fill: "none",
      strokeWidth: "3px",
    };

    this.StyledCheckbox_style = {
      display: "inline-block",
      width: "18px",
      height: "18px",
      borderRadius: "3px",
      transition: "all 150ms",
    };
  }

  onBlur() {
    this.setState({ focused: false });
  }

  onFocus() {
    this.setState({ focused: true });
  }

  onStateChange(event) {
    // console.log(this.props.id);
    // this.props.onStateChange && this.props.onStateChange(event.target.checked);
    this.setState({ checked: event.target.checked });
    this.props.onChange(event, this.props.id);
  }

  render() {
    const { accountKeyId, ownerName, status, usage, bban, iban } = this.props;
    let focusBorderColor = this.props.focusBorderColor || "#f69b25";
    let backgroundWhenChecked = this.props.backgroundWhenChecked || "#232528";
    let backgroundWhenNotChecked = this.props.backgroundWhenNotChecked || "papayawhip";

    return (
      <label className="mb-0 mt-1 ml-2 text-left" style={{ cursor: "pointer", userSelect: "none" }}>
        <div // CheckboxContainer
          style={this.CheckboxContainer_style}
          className={this.props.className}
        >
          {/*console.log(this.props.checkedBoxes)*/}
          {!this.props.checkedBoxes.every((c) => c === false) && this.props.checkedBoxes[this.props.id] === false ? (
            ""
          ) : !this.props.displayAccountButton ? (
            ""
          ) : (
            <input // HiddenCheckbox
              id="hiddenCheckbox"
              type="checkbox"
              checked={this.state.checked}
              onFocus={this.onFocus.bind(this)}
              onBlur={this.onBlur.bind(this)}
              onChange={this.onStateChange.bind(this)}
              style={this.HiddenCheckbox_style}
            ></input>
          )}

          <div // StyledCheckbox
            checked={this.state.checked}
            style={{
              ...this.StyledCheckbox_style,
              boxShadow: this.state.focused ? "0 0 0 2px " + focusBorderColor : "1px 1px 1px 1px " + focusBorderColor,
              background: this.state.checked ? backgroundWhenChecked : backgroundWhenNotChecked,
            }}
          >
            <svg // Icon
              viewBox="0 0 24 24"
              style={{
                ...this.Icon_style,
                stroke: this.props.v_color || "white",
                visibility: this.state.checked ? "visible" : "hidden",
              }}
            >
              <polyline points="20 0 9 11 4 6" />
            </svg>
          </div>
        </div>

        <span style={{ marginLeft: 8 }}>{this.props.label || "Select"}</span>
        <div className="mx-auto text-center">
          <div>
            {accountKeyId}. {ownerName}
          </div>
          <div>
            Status: <span style={{ color: "green" }}>{status}</span>{" "}
          </div>

          <div>
            Type: <span style={{ color: "green" }}>{usage}</span> <br />
          </div>

          {bban === undefined || bban === "" ? (
            ""
          ) : (
            <div>
              Bban: <span>{bban}</span>
            </div>
          )}

          <div className="mb-2">
            Iban: <span>{iban}</span>{" "}
          </div>
        </div>
      </label>
    );
  }
}

export default Checkbox;
