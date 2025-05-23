export const isMobile = () => {
    // Determining WHAT to display based on whether the request is coming from a mobile phone/tablet or a desktop device
    // Determining HOW to display it based on media queries in css
    const userAgent = navigator.userAgent;
    let result = false;

    if (/Mobi|iPhone|iPad|Android|Windows Phone/i.test(userAgent)) {
        result = true;
    }

    if (/TV|Xbox|PlayStation|Nintendo|Bot|bot|Windows NT|Macintosh/i.test(userAgent)) {
        result = false;
    }

    // return true; // For development purposes
    return result;
}

export const capitalize = (str) => {
    return `${str.substring(0, 1).toUpperCase()}${str.substring(1, str.length)}`;
}
