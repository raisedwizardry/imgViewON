function ready (fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready (function () {
    const fs = require('fs');
    let rawdata = fs.readFileSync('imgFilePath.json')
    let imagePath = JSON.parse(rawdata);
    const sizeOf = require('image-size');
    let dimensions = sizeOf(imagePath.filePath);
    let theImageInfo = CreateImageInfoObject(dimensions.width, dimensions.height);
    let initialImageDetail = DetermineImgDetail(imagePath.filePath, theImageInfo);
    InitializeImage(initialImageDetail);
    AddHandle(theImageInfo.imageRatio, 'container');
});

function CreateImageInfoObject(origWidth, origHeight){
    let imageInfo = {
        "origImageWidth": origWidth,
        "origImageHeight": origHeight,
        "imageRatio": origWidth/origHeight,
        "screenWidth": window.screen.availWidth,
        "screenHeight": window.screen.availHeight
    }
    return imageInfo
}

function DetermineImgDetail(imageSource, theImageInfo) {
    let resizedWidth = DetermineInitialSizeByWidth(theImageInfo);
    let resizedHeight = FindMissingDimension(resizedWidth, 'wide', theImageInfo.imageRatio)
    let imgDetail = {
        "source": imageSource,
        "initialWidth": resizedWidth,
        "initialHeight": resizedHeight,
        "widthPosition": RandomPosition(theImageInfo.screenWidth, resizedWidth), 
        "heightPosition": RandomPosition(theImageInfo.screenHeight, resizedHeight)
    }
    return imgDetail
}

function DetermineInitialSizeByWidth(imageObject) {
    let resizedImageWidth
    if (IsImageLargerThanScreen(imageObject)) {
        if (IsImageWiderAndHigherThanScreen(imageObject)) {
            let screenSizeScale = 0.9 * Math.min(imageObject.screenWidth/imageObject.origImageWidth, imageObject.screenHeight/imageObject.origImageHeight);
            resizedImageWidth = screenSizeScale * imageObject.origImageWidth;
        }
        else {
            if (IsImageMoreWide(imageObject)) {
                resizedImageWidth = 0.9 * imageObject.screenWidth;
            }    
            else {
                let height = 0.9 * imageObject.screenHeight;
                resizedImageWidth = FindMissingDimension(height,'high',imageObject.imageRatio);
            }
        }
    }
    else {
        resizedImageWidth = imageObject.origImageWidth;
    }
    return resizedImageWidth
}

function IsImageLargerThanScreen(imageObject) {
    if (imageObject.origImageWidth > imageObject.screenWidth) {
        return true
    }
    else if (imageObject.origImageHeight > imageObject.screenHeight) {
        return true
    }
    else {
        return false
    }
}

function IsImageWiderAndHigherThanScreen(imageObject) {
    if ((imageObject.origImageWidth > imageObject.screenWidth) && (imageObject.origImageHeight > imageObject.screenHeight)) 
        return true
    else
        return false
}

function IsImageMoreWide(imageObject) {
    if (imageObject.origImageWidth > imageObject.origImageHeight)
        return true
    else
        return false
}

function FindMissingDimension(distance, highOrWide, ratio) {
    if (highOrWide === 'wide') {
        return distance / ratio
    }
    else if (highOrWide === 'high') {
        return distance * ratio
    }
}

function RandomPosition(whole, offset) {
    let max = whole - offset
    let min = 1
    return Math.floor(Math.random()*(max-min+1)+min);
}

function InitializeImage(imageDetailObject) {
    img = new Image();
    img.id = "main";
    img.src = imageDetailObject.source;
    document.getElementById('container').prepend(img);
    window.resizeTo(imageDetailObject.initialWidth, imageDetailObject.initialHeight);
    window.moveTo(imageDetailObject.widthPosition, imageDetailObject.heightPosition);
}