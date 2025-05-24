import {displayPrompt} from "./Prompt.js";

export async function checkCookieExists(cookieName) {
    const cookies = document.cookie.split(";");
  
      const cookie = cookies[0].trim();
      var isCookieExists = cookie.startsWith(cookieName);
      if (!isCookieExists) {
          await displayPrompt('.prompt-save', 'Вашата сесия изтече, моля влезте отново!', false);
          window.location.href = "/WebLayer/components/login/login.html";
        }
    }