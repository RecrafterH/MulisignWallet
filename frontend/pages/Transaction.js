import styles from "@/styles/Home.module.css";

export default function Transaction({ destination, value, executed, data }) {
  return (
    <div>
      <ul className={styles.ul}>
        <li className={styles.li}>
          <div>Destinationaddress: </div>
          {<span>&nbsp;&nbsp;</span>}
          <div className={styles.data}>{destination}</div>
        </li>
        <li className={styles.li}>
          <div>Value: </div>
          {<span>&nbsp;&nbsp;</span>}
          <div>{value}</div>
        </li>
        <li className={styles.li}>
          <div>Status: </div>
          {<span>&nbsp;&nbsp;</span>}
          <div>{executed}</div>
        </li>
        <li className={styles.li}>
          <div>Data: </div>
          {<span>&nbsp;&nbsp;</span>}
          <div className={styles.data}>{data}</div>
        </li>
      </ul>
    </div>
  );
}
