import { IPicture, IPortfolio, IUser } from '../../interfaces/dataInterface';
import { Context } from './OvermindHelper'

export const increase = ({ state }: Context, value: number) => {
    state.counter += value;
}


export const setSelectedFiles = ({ state }: Context, value: Array<File>) => {
    state.selectedFiles = value;
}
export const setRejectedFiles = ({ state }: Context, value: number) => {
    console.log(value);
    state.rejectedFiles = value;
}
export const setDialogLoading = ({ state }: Context, value: boolean) => {
    console.log(value);
    state.dialogLoading = value;
}


export const addToSelectedFiles = ({ state }: Context, value: Array<File>) => {

    const newFilesArr = []
    const newBlobArr = []

    for (let i = 0; i < value.length; i++) {
        newFilesArr.push(value[i])
        newBlobArr.push(URL.createObjectURL(value[i]))
    }

    state.selectedFiles = [...state.selectedFiles, ...newFilesArr]
    state.selectedFileUrls = [...state.selectedFileUrls, ...newBlobArr]
}


// export const deleteSelectedfile = ({ state }: Context, selectedIndex: number) => {
//     state.selectedFiles = state.selectedFiles.filter((file, index) => index !== selectedIndex);
//     state.selectedFileUrls = state.selectedFileUrls.filter((file, index) => index !== selectedIndex);
// }

// export const setImg = ({ state }: Context, value: string) => {
//     state.img = value;
// }
export const positionSet = ({ state }: Context, value: number) => {
    state.position = value;
    console.log('position set value', value)
}

// TODO typescript error fix
export const setColor = ({ state }: Context, value: string) => {
    if (state.userInfo) {
        state.userInfo.color = value;
    }
}

export const setUserInfo = ({ state }: Context, value: IUser) => {
    state.userInfo = value;
    console.log(value)
}

export const setSocialPicture = ({ state }: Context, value: string | null) => {
    state.socialPicture = value;
}

export const setMainTitle = ({ state }: Context, value: string | null) => {
    console.log('main', value)
    state.mainTitle = value;
}

export const setPortfolioNumber = ({ state }: Context, value: number) => {
    state.totalPortfolioNumber = value;
}
export const setPictureNumber = ({ state }: Context, value: number) => {
    state.pictureNumber = value;
}

export const setCoverImagesArray = ({ state }: Context, value: Array<number>) => {
    state.coverImagesArray = value;
}



export const setPortfolioDetailsWithImages = ({ state }: Context, value: IPortfolio) => {
    state.portfolioDetailsWithImages = value;
}

export const setCurrentImageUpdatedData = ({ state }: Context, value: {
    index: number,
    picture: Partial<IPicture>
}) => {
    if (!state.portfolioDetailsWithImages) {
        console.log('unddddeee', state.portfolioDetailsWithImages)
        return
    }
    console.log('action', value.index)
    console.log('action2', value.picture)
    // state.imageCurrentIndex=value.index
    state.portfolioDetailsWithImages.pictures[value.index] = {
        ...state.portfolioDetailsWithImages.pictures[value.index],
        ...value.picture
    }
}
export const setStylePortfolioNumber = ({ state }: Context, value: number) => {
    console.log('value', value)
    state.stylePortfolioNumber = value;
}

export const setInitialStylePortfolioNumber = ({ state }: Context, value: number) => {
    console.log('value', value)
    state.initialStylePortfolioNumber = value;
}


export const setPrivacy = ({ state }: Context, value: string) => {
    state.privacy = value;
}

export const setCountPortfolioPage = ({ state }: Context, value: number) => {
    state.countPortfolioPage = value;
}


export const setStyleDrawer = ({ state }: Context, value: boolean) => {
    state.styleDrawer = value;
}

export const setUserColor = ({ state }: Context, value: string) => {
    state.color = value;
}



// export const setImageCurrentIndex=({ state }: Context, value: number) => {
//     state.imageCurrentIndex = value;
// }


