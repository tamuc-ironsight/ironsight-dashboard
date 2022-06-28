import * as React from "react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import { Rnd } from "react-rnd";

var widgetName = "Widget Template";

function Widget() {
  return (
    <Rnd
      default={{
        x: 10,
        y: 370,
        width: 950,
        height: 350,
      }}
    >
      <Box
        // Add rounded grey border
        borderRadius={1}
        border={7}
        // borderTop={40}
        borderColor="#2f3136"
        borderStyle="solid"
        sx={{ bgcolor: "transparent" }}
        // Minimum width of the widget
        minWidth={350}
        minHeight={400}
      >
        <Box
          sx={{ bgcolor: "#2f3136" }}
          height={30}
          borderStyle="solid"
          borderLeft={10}
          borderColor="#2f3136"
        >
          <Tooltip title="Drag me around" placement="top">
            <strong>{widgetName}</strong>
          </Tooltip>
        </Box>
        <Box sx={{ bgcolor: "background.paper" }} minWidth={350}></Box>
        <Alert severity="info">
          This is a widget template - content would go here
        </Alert>
      </Box>
    </Rnd>
  );
}

export default Widget;
