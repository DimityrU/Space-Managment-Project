export function GetParameter(param){
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    const result = searchParams.get(param);
    return result;
}