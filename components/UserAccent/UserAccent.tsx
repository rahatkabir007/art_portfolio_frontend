import React from 'react'
import { useActions, useAppState } from '../../src/Overmind/OvermindHelper';
import styles from './UserAccent.module.css';


function UserAccent() {

  const actions = useActions()
  const states = useAppState()
  const userColor = states.userInfo?.color;

  const colors = [
    {
      color: '#1f1f1f'
    },
    {
      color: '#555555'
    },
    {
      color: '#0899f4'
    },
    {
      color: '#3caea4'
    },
    {
      color: '#c70039'
    },
    {
      color: '#f7c447'
    },

  ]

  const isSelected = (index: number) => {
    return colors[index].color === userColor;
  }

  return (
    <div className={styles['container']}>
      <p style={{ color: states.userInfo?.color }}>Set Accent Color</p>
      <div className={styles['colorSliderContainer']}>

        {
          colors.map((item, index: number) => {
            return <div key={item.color} className={styles['sliderBox']} style={{
              height: isSelected(index) ? 120 : 100,
              backgroundColor: item.color
            }} onClick={() => {

              actions.setColor(item.color)
            }} />
          })
        }
      </div>
    </div>
  )
}

export default UserAccent