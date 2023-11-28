import { useState } from 'react';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import logo from '../assets/logo/always_around_me.png';

const useImageConversion = (elementRef) => {
    const [isConverting, setIsConverting] = useState(false);

    const convertToImage = async (title) => {

        if (!elementRef.current || isConverting) return;

        setIsConverting(true);

        const logoImage = document.createElement('img');
        logoImage.src = logo;
        elementRef.current.prepend(logoImage);

        try {
            const canvas = await domtoimage.toPng(elementRef.current);
            if (canvas) {
                saveAs(canvas, `${title}.png`);
            }
        } catch (error) {
            console.error('Error converting to image', error);
        } finally {
            elementRef.current.removeChild(logoImage);
            setIsConverting(false);
        }
    };

    return { convertToImage };
};

export default useImageConversion;
