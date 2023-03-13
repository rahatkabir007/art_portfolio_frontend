import React, { useRef } from 'react';
import { useAppState } from '../../src/Overmind/OvermindHelper';
import styles from './ShareMenu.module.css';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { useSnackbar } from 'notistack';
import {
    EmailShareButton,
    // FacebookMessengerShareButton,
    LinkedinShareButton, LineShareButton,
    // PinterestShareButton,
    RedditShareButton, TelegramShareButton, TumblrShareButton, TwitterShareButton, ViberShareButton, WhatsappShareButton, FacebookShareButton, InstapaperShareButton, EmailIcon,
    FacebookIcon,
    // FacebookMessengerIcon,
    InstapaperIcon,
    LineIcon,
    LinkedinIcon,
    // PinterestIcon,
    RedditIcon,
    TelegramIcon,
    TumblrIcon,
    TwitterIcon, ViberIcon, WhatsappIcon,
} from 'react-share';


interface Props {
    url: string;
}

const ShareMenu: React.FC<Props> = () => {

    const states = useAppState()


    const { enqueueSnackbar } = useSnackbar();

    const shareUrl = window.location.href;

    // const shareUrl = `https://art-portfolio-nextjs-rahatkabir04.vercel.app${url}`


    const textAreaRef = useRef<HTMLInputElement>(null);

    function copyToClipboard() {
        if (textAreaRef.current) {
            textAreaRef.current.select();
            document.execCommand('copy');
            // This is just personal preference.
            // I prefer to not show the whole text area selected.
            // e.target.focus();
            enqueueSnackbar("Copied", { variant: 'success', autoHideDuration: 2000 })
        }

    }

    return <>
        <div className={styles['styleMenu']}>
            <div className={styles['copyText']}>
                <input id='stark' type="text" className={styles['text']} defaultValue={shareUrl} ref={textAreaRef} />
                {
                    document.queryCommandSupported('copy') &&
                    <button
                        onClick={copyToClipboard}
                    // onClick={() => {
                    // let input = document.getElementById("stark")
                    // if (input) {
                    //     // @ts-ignore
                    //     input.select();
                    //     document.execCommand("copy");
                    //     // here

                    // }
                    // }}

                    ><FileCopyIcon /></button>

                }
            </div>

            <div className={styles['shareIcons']} style={{ backgroundColor: `${states.userInfo?.color}` }}>
                <EmailShareButton url={shareUrl}>
                    <EmailIcon size={40} round={true} />
                </EmailShareButton>
                <FacebookShareButton url={shareUrl}>
                    <FacebookIcon size={40} round={true} />
                </FacebookShareButton>
                {/* <FacebookMessengerShareButton url={shareUrl}>
                    <FacebookMessengerIcon size={40} round={true} />
                </FacebookMessengerShareButton> */}
                <WhatsappShareButton url={shareUrl}>
                    <WhatsappIcon size={40} round={true} />
                </WhatsappShareButton>
                <ViberShareButton url={shareUrl}>
                    <ViberIcon size={40} round={true} />
                </ViberShareButton>
                <InstapaperShareButton url={shareUrl}>
                    <InstapaperIcon size={40} round={true} />
                </InstapaperShareButton>
                <LinkedinShareButton url={shareUrl}>
                    <LinkedinIcon size={40} round={true} />
                </LinkedinShareButton>
                <LineShareButton url={shareUrl}>
                    <LineIcon size={40} round={true} />
                </LineShareButton>
                <TwitterShareButton url={shareUrl}>
                    <TwitterIcon size={40} round={true} />
                </TwitterShareButton>
                <RedditShareButton url={shareUrl}>
                    <RedditIcon size={40} round={true} />
                </RedditShareButton>
                <TelegramShareButton url={shareUrl}>
                    <TelegramIcon size={40} round={true} />
                </TelegramShareButton>
                <TumblrShareButton url={shareUrl}>
                    <TumblrIcon size={40} round={true} />
                </TumblrShareButton>
                {/* <PinterestShareButton url={shareUrl}>
                    <PinterestIcon size={40} round={true} />
                </PinterestShareButton> */}

            </div>
        </div>
    </>
}

export default ShareMenu;