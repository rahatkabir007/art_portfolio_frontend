/* eslint-disable react-hooks/rules-of-hooks */
import { AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import { AppProps } from "next/app";
import { config } from "../src/Overmind/OvermindHelper";
import { createOvermind } from "overmind";
import { Provider } from "overmind-react";
import { useRouter } from 'next/router'
// import { animations } from "../interfaces/lib/animations";
import { SnackbarProvider } from "notistack";
import { Fade } from "@mui/material";
import Loader from "../components/Helpers/Loader";
import { Gtag } from '../src/Others/Gtag'

const overmind = createOvermind(config);

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  const router = useRouter();

  useEffect(() => {
    Gtag.fPixelinIt(router)
  }, [router.events])

  // useEffect(() => {

  //   addEventListener("scroll", () => {
  //    console.log('windowwww', window.scrollX, window.scrollY, window.location.pathname, window.location.hostname, window.location.href)
  //    // const scrollY= parseInt(window.scrollY)
  //    if (window.scrollY)
  //    sessionStorage.setItem(window.location.pathname, JSON.stringify(window.scrollY))
  //   })

  // })






  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
    Gtag.inIt()
  }, []);

  // const [animation, setAnimation] = useState(animations[startIndex]);
  // const [exitBefore, setExitBefore] = useState(false);

  return (
    <>
      <Provider value={overmind}>
        <React.Fragment>
          {/* <div className="app-wrap">
          <div className="ui-wrap">
            <Navigation pages={pages} />
          </div>
          <LazyMotion features={domAnimation}>
            <AnimatePresence exitBeforeEnter={!exitBefore}>
              <m.div
                key={router.route.concat(animation.name)}
                className="page-wrap"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animation.variants}
                transition={animation.transition}
              > */}
          <AnimatePresence
            exitBeforeEnter
          >
            <Loader />
            <SnackbarProvider maxSnack={1}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              TransitionComponent={Fade}
              // autoHideDuration={4000}
              dense={false}
            >
              <Component {...pageProps} />
            </SnackbarProvider>
          </AnimatePresence>
          {/* </m.div>
            
          </LazyMotion>
      </div> */}
        </React.Fragment>
      </Provider ></>

  );
}
