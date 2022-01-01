import Link from 'next/link';
import { ReactElement } from 'react';
import styles from './header.module.scss';

export default function Header(): ReactElement {
  return (
    <header className={styles.container}>
      <Link href="/">
        <img src="/assets/logo.svg" alt="logo" />
      </Link>
    </header>
  );
}
