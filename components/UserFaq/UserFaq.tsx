import React from 'react'
import { useAppState } from '../../src/Overmind/OvermindHelper';
import styles from './UserFaq.module.css';

function UserFaq() {
  const states = useAppState()
  return (
    <div className={styles['container']}>
      <div className={styles['appAbout']}>
        <p>Art Portfolio has been designed, created and coded by photographer/programmer Rogelio Robledo.</p>
        <p>All images shown in the app belong to their respective author. You reserve the rights to all your images while using Art Portfolio.</p>
      </div>
      <div className={styles['appLast']}>
        <p className={styles['appVersion']}>Version V 1.0 Premium</p>
        <p className={styles['appPolicy']} style={{ color: states.userInfo?.color }}>Privacy Policy</p>
        <p>External Libraries</p>
      </div>
    </div>
  )
}

export default UserFaq