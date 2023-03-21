import React, { useEffect, useState } from "react";
import Alert from '@mui/material/Alert';
import Snackbar from "@mui/material/Snackbar";

interface AlertProps {
  visible: boolean;
  message: string;
  severity: 'error' | 'info' | 'success' | 'warning';
}

export default function PhoAlert(props: AlertProps) {
  const { visible, message, severity } = props;

  const [open, setOpen] = useState(visible);
  const [msg, setMsg] = useState(message);
  const [level, setLevel] = useState(severity);

  useEffect(
    () => {
      if (visible !== open || message !== msg || severity !== level) {
        setOpen(visible);
        setMsg(message);
        setLevel(severity);
      }
    },
    [visible, message, severity]
  );

  const vertical = "top";
  const horizontal = "right";

  function handleClose() {
    setOpen(false);
  }

  return (
    <Snackbar anchorOrigin={{ vertical, horizontal }} autoHideDuration={6000} open={open} onClose={handleClose}>
      <Alert onClose={handleClose} severity={level} sx={{ width: '100%' }}>
        {msg}
      </Alert>
    </Snackbar>
  );
}
