window.addEventListener("load", async () => {
  document.querySelector(".loader").style.display = 'none';
  document.cookie =
            "SMPlace=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
});

document.querySelector(".show-password").addEventListener("click", () => { 
  let password = document.getElementById("password");
  if (password.type === "password") {
      password.type = "text";
  } else {
      password.type = "password";
  };
});

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    document.querySelector(".loader").style.display = 'block';
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var loginData = {
      Username: username,
      Password: password,
    };

    fetch("https://localhost:7286/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({  
        Username: document.getElementById("username").value,
        Password: document.getElementById("password").value
      }),
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          response.json().then(function (Error) {
            displayErrorMessage(Error.errorMessage);
          });
          throw new Error("Error: " + response.status);
        } else {
          throw new Error("Error: " + response.status);
        }
      })
      .then(function (jsonData) {
        setCookie("SMPlace", jsonData.username, jsonData.role);
        window.location.href = "../booking/book-filter/book-filter.html";
      })
      .catch(function (error) {
        console.log("Error:", error);
      });
  });

function displayErrorMessage(message) {
  const errorComponent = document.getElementById("errorComponent");
  errorComponent.textContent = message;
  errorComponent.classList.add("error-component");
  document.querySelector(".loader").style.display = 'none';
}

function setCookie(cookieName, cookieValue, role) {
  const d = new Date();
  d.setTime(d.getTime() + (24*60*60*1000));
  let expires = "expires=" + d.toUTCString();
  
  if (role === 0) {
    var cookieRole = "user";
  }
  else if(role === 1){
    var cookieRole = "admin";
  }

  let cookieData = {
    value: cookieValue,
    role: cookieRole
  };

  let cookieString = cookieName + "=" + encodeURIComponent(JSON.stringify(cookieData)) + ";" + expires + ";path=/";
  document.cookie = cookieString;
}
