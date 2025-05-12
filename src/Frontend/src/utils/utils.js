export const isMobile = () => {
    const userAgent = navigator.userAgent;
    var result = false;

    if (/Mobi|iPhone|iPad|Android|Windows Phone/i.test(userAgent)) {
        result = true;
    }

    if (/TV|Xbox|PlayStation|Nintendo|Bot|bot|Windows NT|Macintosh/i.test(userAgent)) {
        result = false;
    }

    return result;
}
