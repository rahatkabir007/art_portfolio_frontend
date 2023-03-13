/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import jsPDF from "jspdf";
import Image from 'next/image'


const A4_PAPER_DIMENSIONS = {
  width: 210,
  height: 297,
};

const A4_PAPER_RATIO = A4_PAPER_DIMENSIONS.width / A4_PAPER_DIMENSIONS.height;

interface ImageDimension {
  width: number;
  height: number;
}

export const imageDimensionsOnA4 = (dimensions: ImageDimension) => {
  console.log('dimension', dimensions)
  //ekhane dimensions j parameter sheta actual image gular size
  const isLandscapeImage = dimensions.width >= dimensions.height;

  if (isLandscapeImage) {
    return {
      width: A4_PAPER_DIMENSIONS.width,
      height:
        A4_PAPER_DIMENSIONS.width / (dimensions.width / dimensions.height),
    };
  }

  const imageRatio = dimensions.width / dimensions.height;
  console.log('imageRatio', imageRatio)
  if (imageRatio > A4_PAPER_RATIO) {
    const imageScaleFactor =
      (A4_PAPER_RATIO * dimensions.height) / dimensions.width;

    const scaledImageHeight = A4_PAPER_DIMENSIONS.height * imageScaleFactor;
    console.log('scaledImageHeight', scaledImageHeight)
    return {
      height: scaledImageHeight,
      width: scaledImageHeight * imageRatio,
    };
  }

  return {
    width: A4_PAPER_DIMENSIONS.height / (dimensions.height / dimensions.width),
    height: A4_PAPER_DIMENSIONS.height,
  };
};

class CustomImage extends Image {
  constructor(public mimeType: string) {
    super();
  }

  get imageType(): string {
    return this.mimeType.split("/")[1];
  }
}

export const fileToImageURL = (file: File | undefined): Promise<CustomImage> => {
  console.log('file', file)

  return new Promise((resolve, reject) => {
    if (!file) {
      return
    }
    const image = new CustomImage(file.type);

    image.onload = () => {
      resolve(image);
    };

    image.onerror = () => {
      reject(new Error("Failed to convert File to Image"));
    };

    image.src = URL.createObjectURL(file);
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const generatePdfFromImages = (image, portfolioName) => {

  const doc = new jsPDF();
  doc.deletePage(1);

  images.forEach((image) => {
    const imageDimensions = imageDimensionsOnA4({
      width: image.width,
      height: image.height,
    });
    console.log('imageDimensions',imageDimensions)
    console.log(' image.src image.imageType', image.src, image.imageType);
    doc.addPage();
    doc.addImage(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      image.src,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      image.imageType,
      (A4_PAPER_DIMENSIONS.width - imageDimensions.width) / 2,
      (A4_PAPER_DIMENSIONS.height - imageDimensions.height) / 2,
      imageDimensions.width,
      imageDimensions.height
    );
  });
  // doc.save(`${portfolioName}.pdf`);
  const pdfURL = doc.output("bloburl");
  window.open(pdfURL, "_blank");
};
