import React from "react";

const Loader = () => {
    return (
        <div style={styles.overlay}>
            <div style={styles.loader}></div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)", // semi-transparent dark overlay
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // high z-index to cover everything
        pointerEvents: "auto", // catch pointer events to prevent clicks
    },
    loader: {
        border: "8px solid #f3f3f3", // Light grey
        borderTop: "8px solid #3498db", // Blue
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        animation: "spin 1s linear infinite",
    },
};

// Add keyframe animation to document
const styleSheet = document.styleSheets[0];
const keyframes =
    `@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }`;

styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default Loader;
