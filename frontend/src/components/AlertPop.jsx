import React from "react";
import { useEffect } from "react";

const AlertPop = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return <div className="AlertPopop">{message}</div>;
};

export default AlertPop;