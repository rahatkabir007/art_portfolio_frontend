import React, { useState } from 'react'
import styles from './PortfolioMenu.module.css'
import { useActions, useAppState } from '../../src/Overmind/OvermindHelper';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { Skeleton } from '@material-ui/lab';
import { Grid, Radio } from '@material-ui/core';

interface Props {
    handleClose?: (e: boolean) => void
    styleDrawerOpen?: boolean
}
const PortfolioMenu: React.FC<Props> = (props) => {
    // const [selectedValue, setSelectedValue] = React.useState('a');
    // const [selectBoolean, setSelectBoolean] =useState(true);
    const actions = useActions()
    const states = useAppState()
    const [centerr, setCenter] = useState(2);
    const { handleClose } = props;
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('e', event.target.value)
        console.log('hhhhh', states.stylePortfolioNumber);
        // setYearVisible(true); 
        actions.setStylePortfolioNumber(parseInt(event.target.value));
    };


    const startPortfolioNumber = () => {
        if (states.stylePortfolioNumber == 3) {
            return 1
        }
        return 0
    }


    const onMovePortfolioNumberSet = (ppp: number, ddd: number) => {
        if (ppp < ddd) {
            actions.setStylePortfolioNumber(3);
            setCenter(3)
        }

        else {
            actions.setStylePortfolioNumber(2);
            setCenter(2)
        }
    }

    // useEffect(() => {
    //     if (styleDrawerOpen) {
    //         console.log('heee')
    //         // setTimeout(() => { setSelectBoolean(false) },400)
    //     }
    // }, [styleDrawerOpen])


    const squareImagecolumnNumber = [2, 3];


    return (
        <>
            {
                states?.color && handleClose ?
                    <Grid
                        className={styles['allStylesContainer']}
                    // style={{ height: '322px', width: '100%', marginTop: '50px' }}
                    >
                        <Grid className={styles['originalImagesContainer']}>
                            <Radio
                                checked={states.stylePortfolioNumber == 1}

                                onChange={handleChange}
                                value={1}
                                style={{ color: `${states?.color}` }}
                                name="radio-button-demo"
                                inputProps={{ 'aria-label': 'A' }}

                            />
                            <p>Original Images</p>
                        </Grid>

                        <Grid className={styles['squareImagesWithColumnsContainer']} >
                            <Grid className={styles['squareImagesContainer']}>
                                <Radio
                                    checked={states.stylePortfolioNumber == 2 || states.stylePortfolioNumber == 3}
                                    onChange={handleChange}
                                    value={centerr}
                                    style={{ color: `${states?.color}` }}
                                    name="radio-button-demo"

                                    inputProps={{ 'aria-label': 'B' }}
                                />
                                <p>Square Images</p>
                            </Grid>

                            <Grid className={styles['numberContainer']}>
                                <p >Number of Columns</p>
                            </Grid>

                            {
                                states.styleDrawer ?
                                    <Grid className={styles['columnStyleContainer']} style={{ marginLeft: '0px' }}
                                    >

                                        <Splide
                                            className={styles['columnNumbersContainer']}
                                            options={{
                                                perPage: 3,
                                                perMove: 1,
                                                focus: 'center',
                                                arrows: false,
                                                pagination: false,
                                                gap: '0.3rem',
                                                trimSpace: false,
                                                drag: states.stylePortfolioNumber == 2 || states.stylePortfolioNumber == 3,
                                                start: startPortfolioNumber() ? startPortfolioNumber() : 0,
                                                isNavigation: true,

                                            }}
                                            onMove={(_sss, _iii, ppp, ddd) => {
                                                onMovePortfolioNumberSet(ppp, ddd)
                                            }}


                                        >
                                            {
                                                squareImagecolumnNumber.map((column, index) => {
                                                    return (
                                                        <SplideSlide className={styles['columnNumbers']} key={index}>
                                                            {
                                                                // yearVisible ?
                                                                //     <button disabled>{column}</button>
                                                                //     :
                                                                states.stylePortfolioNumber == column ?
                                                                    <p style={{ color: `${states?.userInfo?.color}`, fontSize: '12.5px', fontWeight: 'bolder', textAlign: 'center' }} >{column}</p>
                                                                    :
                                                                    <p style={{ color: 'grey', fontSize: '12.5px', textAlign: 'center' }}>{column}</p>
                                                            }

                                                        </SplideSlide>

                                                    )
                                                })
                                            }

                                        </Splide>
                                    </Grid>
                                    :
                                    <Grid>
                                        {/* <Grid style={{ display: 'flex', flexDirection: 'row', width: '100px', textAlign: 'center', fontSize: '12.5px', alignItems: 'center', columnGap: '8px', paddingLeft: '8px', height: '38px' }}> */}
                                        {states.stylePortfolioNumber == 3 ?
                                            <>
                                                <Grid style={{ width: '80%', margin: '10px auto' }}>
                                                    <Grid style={{ display: 'flex', flexDirection: 'row', width: '100px', textAlign: 'center', fontSize: '12.5px', alignItems: 'center', columnGap: '8px', marginLeft: '-1px', height: '18px' }}>
                                                        <p style={{ width: '36.5px', color: 'grey', fontFamily: 'Poppins' }}>2</p>
                                                        <p style={{ width: '36.5px', color: `${states?.userInfo?.color}`, fontFamily: 'Poppins', fontWeight: 'bolder' }}>3</p>
                                                    </Grid>
                                                </Grid>
                                            </> :
                                            <>
                                                <Grid style={{ width: '80%', margin: '10px auto' }}>
                                                    <Grid style={{ display: 'flex', flexDirection: 'row', width: '100px', textAlign: 'center', fontSize: '12.5px', alignItems: 'center', columnGap: '8px', marginLeft: '43.5px', height: '18px' }}>
                                                        <p style={{ width: '36.5px', color: states.stylePortfolioNumber == 2 ? `${states?.userInfo?.color}` : 'grey', fontFamily: 'Poppins', fontWeight: states.stylePortfolioNumber == 2 ? 'bolder' : '' }}>2</p>
                                                        <p style={{ width: '36.5px', fontFamily: 'Poppins' }}>3</p>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        }

                                        {/* </Grid> */}
                                    </Grid>
                            }
                        </Grid>



                        <Grid className={styles['staggerdImageContainer']} style={{ marginTop: states.styleDrawer ? "0px" : "0px" }}>
                            <Radio
                                checked={states.stylePortfolioNumber == 4}
                                onChange={handleChange}
                                value={4}
                                style={{ color: `${states?.color}` }}
                                name="radio-button-demo"
                                inputProps={{ 'aria-label': 'C' }}

                            />
                            <p>Staggered Images</p>
                        </Grid>
                        <Grid>
                            <Grid style={{ color: `${states?.color}`, marginTop: '15px', fontSize: '18px', fontFamily: 'sans-serif', fontWeight: 700, textAlign: 'center' }}
                                onClick={() => { handleClose(false) }}>Cancel</Grid>
                        </Grid>

                    </Grid >
                    :
                    <Grid>
                        <Grid>
                            <Skeleton variant="rect" style={{ width: '100%', height: '98vh' }} />
                        </Grid>
                    </Grid>
            }
        </>
        //     </Dialog>
        // </Grid>
    )
}
export default PortfolioMenu



