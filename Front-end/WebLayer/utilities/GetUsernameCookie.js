export function getUsernameFromCookie(cookieName) {

    const cookies = document.cookie.split(";");
    const cookie = cookies[0].trim();
    var isCookieExists = cookie.startsWith(cookieName);
  
    if (isCookieExists) {
      const decodedCookie = decodeURIComponent(cookie.substring(cookie.indexOf('=') + 1));
      const cookieData = JSON.parse(decodedCookie);
      return cookieData.value;
    }
  
    return "";
  }
  