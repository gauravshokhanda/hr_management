
import { forwardRef } from "react";
import PropTypes from "prop-types";
import SoftInputRoot from "components/SoftInput/SoftInputRoot";
import SoftInputWithIconRoot from "components/SoftInput/SoftInputWithIconRoot";
import SoftInputIconBoxRoot from "components/SoftInput/SoftInputIconBoxRoot";
import SoftInputIconRoot from "components/SoftInput/SoftInputIconRoot";
import { useSoftUIController } from "context";

const SoftInput = forwardRef(({ size, icon, error, success, disabled, ...rest }, ref) => {
  const [controller] = useSoftUIController();
  const { direction } = controller;
  const iconDirection = icon.direction;

  const handleIconClick = () => {
    if (icon.onClick) {
      icon.onClick();
    }
  };

  let template;

  if (icon.component && icon.direction === "left") {
    template = (
      <SoftInputWithIconRoot ref={ref} ownerState={{ error, success, disabled }}>
        <SoftInputIconBoxRoot ownerState={{ size }} onClick={handleIconClick}>
          <SoftInputIconRoot fontSize="small" ownerState={{ size }}>
            {icon.component}
          </SoftInputIconRoot>
        </SoftInputIconBoxRoot>
        <SoftInputRoot
          {...rest}
          ownerState={{ size, error, success, iconDirection, direction, disabled }}
        />
      </SoftInputWithIconRoot>
    );
  } else if (icon.component && icon.direction === "right") {
    template = (
      <SoftInputWithIconRoot ref={ref} ownerState={{ error, success, disabled }}>
        <SoftInputRoot
          {...rest}
          ownerState={{ size, error, success, iconDirection, direction, disabled }}
        />
        <SoftInputIconBoxRoot ownerState={{ size }} onClick={handleIconClick}>
          <SoftInputIconRoot fontSize="small" ownerState={{ size }}>
            {icon.component}
          </SoftInputIconRoot>
        </SoftInputIconBoxRoot>
      </SoftInputWithIconRoot>
    );
  } else {
    template = (
      <SoftInputRoot {...rest} ref={ref} ownerState={{ size, error, success, disabled }} />
    );
  }

  return template;
});


SoftInput.defaultProps = {
  size: "medium",
  icon: {
    component: false,
    direction: "none",
    onClick: null,
  },
  error: false,
  success: false,
  disabled: false,
};

SoftInput.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  icon: PropTypes.shape({
    component: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    direction: PropTypes.oneOf(["none", "left", "right"]),
    onClick: PropTypes.func,
  }),
  error: PropTypes.bool,
  success: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default SoftInput;