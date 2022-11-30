export const checkIOS = () => {
    const u = navigator.userAgent;
    const reg = /\(i[^;]+;( U;)? CPU.+Mac OS X/;
    const isIOS = reg.test(u); //ios终端
    return isIOS;
};

export const isIE = () => {
    // @ts-ignore
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
};