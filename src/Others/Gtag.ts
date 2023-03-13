import { NextRouter } from 'next/router';
import TagManager, { TagManagerArgs } from 'react-gtm-module';



export class Gtag {
  static inIt() {
    const gtmId = "GTM-NMT6GRP";
    const tagManagerArgs: TagManagerArgs = {
      gtmId,
    }


    TagManager.initialize(tagManagerArgs)
  }
  static fPixelinIt(router: NextRouter) {
    import('react-facebook-pixel')
      .then((x) => { return x.default })
      .then((ReactPixel) => {
        // eslint-disable-next-line id-length
        // const advancedMatching = { em: 'sayem.mahmud97@gmail.com' }; // optional, more info: https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching
        const options = {
          autoConfig: true, // set pixel's autoConfig. More info: https://developers.facebook.com/docs/facebook-pixel/advanced/
          debug: false, // enable log
        };
        if (process.env['NEXT_PUBLIC_FPIXEL_INIT_KEY']) {
          ReactPixel.init(process.env['NEXT_PUBLIC_FPIXEL_INIT_KEY'], undefined, options) // facebookPixelId
        }
        ReactPixel.pageView()

        router.events.on('routeChangeComplete', () => {
          ReactPixel.pageView()

        })
      })
  }

  static send(name: string) {
    if (!process.env['NEXT_PUBLIC_FPIXEL_GTMID']) {
      return
    }
    const tagManagerArgs: TagManagerArgs = {
      gtmId: process.env['NEXT_PUBLIC_FPIXEL_GTMID'],
      events: {
        sendUserInfo: name
      }
    }

    TagManager.initialize(tagManagerArgs)
  }
}