import React from "react";
import { Typography, Box, Paper } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import "./scsStyle/AccessDenied.scss";

const AccessDenied = () => {
  return (
    <Paper elevation={3} className="access-denied-paper">
      <Box textAlign="center">
        <WarningIcon color="warning" fontSize="large" />
        <Typography variant="h4" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1">
          You do not have permission to access this page.
        </Typography>
      </Box>
    </Paper>
  );
};

export default AccessDenied;
