import React from "react";
import styles from "./styles.module.css";

const Loader = () => (
    <div className={styles.overlay}>
        <div className={styles.loader}></div>
    </div>
);

export default Loader;
