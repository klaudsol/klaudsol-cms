import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';

const GeneralHoverTooltip = ({ className, icon, text, tooltipText, position }) => (
  <OverlayTrigger
    placement={position}
    overlay={<Tooltip id="button-tooltip-2">{tooltipText}</Tooltip>}
   >
    {({ ref, ...triggerHandler }) => (
      <Button
        variant="light"
        {...triggerHandler}
        ref={ref}
        className={className}
      > {text} {icon}
      </Button>
    )}
  </OverlayTrigger>   
);

export default GeneralHoverTooltip;