export function displayPrompt(promptElement, message, question) {
  return new Promise((resolve, reject) => {
    let prompt = document.querySelector(promptElement);
    prompt.innerHTML = `<p>${message}</p>
        ${question ? '<button class="yes btn-custom hoverable">Да</button> <button class="no btn-custom hoverable">Не</button>'
            : '<button class="ok btn-custom hoverable">ОK</button>'}`;

    setTimeout(() => {
      if (question) {
        prompt.querySelector(".yes").addEventListener("click", () => {
          hidePrompt(prompt);
          resolve(true);
        });
        prompt.querySelector(".no").addEventListener("click", () => {
          hidePrompt(prompt);
          resolve(false);
        });
      } else {
        prompt.querySelector(".ok").addEventListener("click", () => {
          hidePrompt(prompt);
          resolve(true);
        });
      }

      prompt.style.display = "block";
    }, 0);
  });
}

function hidePrompt(prompt) {
  prompt.style.display = "none";
  prompt.innerHTML = "";
}
