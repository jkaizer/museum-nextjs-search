
const IMG_RESTRICTED_BASE_URL = 'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size1/'
const IMG_SM_BASE_URL = 'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size3/'
const IMG_LG_BASE_URL = 'https://d1lfxha3ugu3d4.cloudfront.net/images/opencollection/objects/size4/'

export function isImageRestricted(item) {
  return item.copyrightRestricted;
}

export function getSmallOrRestrictedImageUrl(item) {
  if (item.copyrightRestricted)
    return getRestrictedImageUrl(item.image);
  return getSmallImageUrl(item.image);
}

function getSmallImageUrl(image) {
  return `${IMG_SM_BASE_URL}${image}`;
}

function getRestrictedImageUrl(image) {
  return `${IMG_RESTRICTED_BASE_URL}${image}`;
}

export function getLargeImageUrl(image) {
  return `${IMG_LG_BASE_URL}${image}`;
}