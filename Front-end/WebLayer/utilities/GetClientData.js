import { displayPrompt } from "../utilities/Prompt.js";

export default function GetClientData() {
    const name = document.querySelector("#client-name").value;
    if (name === "" || name.length < 3) {
      displayPrompt(
        ".prompt-save",
        "Моля, въведете минимум 3 символа за име на клиент.",
        false
      );
      return;
    }
  
    const pinNumber = document.querySelector("#pin-number").value;
    if (pinNumber === "" || pinNumber.length < 9) {
      displayPrompt(
        ".prompt-save",
        "Моля, въведете минимум 9 символа за ЕГН / ЕИК.",
        false
      );
      return;
    }
  
    const phoneNumberPattern = /^(\+)?[\d]+$/;
    const phoneNumber = document.querySelector("#phone-number").value;
    if (phoneNumber.trim() !== "" && (phoneNumber.trim() === "+" || !phoneNumberPattern.test(phoneNumber))) {
      displayPrompt(".prompt-save",
        "Номерът може да съдържа само цифри и плюс символ (+).",
        false
      );
      return;
    }
    
    const emailPattern = /^[^\s@]+@[^\s@]{2,}\.[^\s@]+$/;
    const email = document.querySelector("#e-mail").value;
    if (email.trim() !== "" && !emailPattern.test(email)) {
      displayPrompt(".prompt-save", "Моля, въведете валиден имейл адрес.", false);
      return;
    }
  
    return { name, pinNumber, phoneNumber, email };
  };