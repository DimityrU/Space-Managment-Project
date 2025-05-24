import { getUsernameFromCookie } from "./GetUsernameCookie.js";

let adminFunctionalities="";
if(document.cookie.includes('admin'))
{
adminFunctionalities = `<li id="admin" class="dropdown navbar-item">
<a href="/WebLayer/components/user/user-index/user-index.html">
<span class="material-symbols-outlined"> manage_accounts </span>
<div class="dropdown-text link">
<p>Мениджъри</p>
<span class="material-symbols-outlined"> expand_more </span>
</div>
</a>
<ul class="dropdown-content">
    <li class="dropdown-item">
      <a class ="action" href="/WebLayer/components/user/user-add/user-add.html" class="link">Добави
      </a>
    </li>
    <li class="dropdown-item">
      <a class ="action" href="/WebLayer/components/user/user-index/user-index.html" class="link">Списък
      </a>
    </li>
  </ul>
</li>`
};


export function Components(selected) {
  window.addEventListener("load", async () => {
    let stylesLink1 = document.createElement("link");
    let stylesLink2 = document.createElement("link");
    let stylesLink3 = document.createElement("link");
    let stylesLink4 = document.createElement("link");

    stylesLink1.rel = "stylesheet";
    stylesLink2.rel = "stylesheet";
    stylesLink3.rel = "preconnect";
    stylesLink4.rel = "preconnect";

    stylesLink1.href =
      "https://fonts.googleapis.com/icon?family=Material+Icons+Outlined";
    stylesLink2.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";
    stylesLink3.href = "https://fonts.googleapis.com";
    stylesLink4.href = "https://fonts.gstatic.com";

    document.head.appendChild(stylesLink1);
    document.head.appendChild(stylesLink2);
    document.head.appendChild(stylesLink3);
    document.head.appendChild(stylesLink4);

    let navbar = document.createElement("nav");
    navbar.classList.add("navbar");
    navbar.innerHTML = `<img class="logo" src="/WebLayer/assets/images/logo.svg" />
    <ul>
      ${adminFunctionalities}
      <li id="statistic" class="navbar-item dropdown">
      <a href="/WebLayer/components/statistic/statistic.html">
        <span class="material-symbols-outlined"> person </span>
        <div>
          <p>Статистика</p>
        </div>
        </a>
      </li>
      <li id="book" class="dropdown navbar-item">
      <a href="/WebLayer/components/booking/book-filter/book-filter.html">
        <span class="material-symbols-outlined dropdown-icon">
          import_contacts
        </span>
        <div class="dropdown-text link">
          <p>Резервирай</p>
          <span class="material-symbols-outlined"> expand_more </span>
        </div>
        </a>
        <ul class="dropdown-content">
          <li class="dropdown-item">
            <a class ="action" href="/WebLayer/components/booking/book-filter/book-filter.html" class="link"
              >Резервирай</a
            >
          </li>
          <li class="dropdown-item">
            <a class ="action" href="/WebLayer/components/booking/book-index/booking.html" class="link"
              >Peзepвaции</a>
          </li>
        </ul>
      </li>
      <li id="spaces" class="dropdown navbar-item">
      <a href="/WebLayer/components/space/space-index/spaces.html">
        <span class="material-symbols-outlined dropdown-icon">
          apartment
        </span>
        <div class="dropdown-text link">
          <p>Помещения</p>
          <span class="material-symbols-outlined"> expand_more </span>
          </div>
          </a>
        <ul class="dropdown-content">
          <li class="dropdown-item">
            <a class ="action" href="/WebLayer/components/space/space-index/spaces.html" class="link"
              >Помещения</a
            >
          </li>
          <li class="dropdown-item">
            <a class ="action" href="/WebLayer/components/consumables/consumables.html" class="link"
              >Консумативи</a
            >
          </li>
        </ul>
      </li>
      <li id="clients" class="navbar-item dropdown">
      <a href="/WebLayer/components/client/client-index/clients.html">
        <span class="material-symbols-outlined"> person </span>
        <div>
          <p>Клиенти</p>
        </div>
        </a>
      </li>
      <li id="invoices" class="navbar-item dropdown">
      <a href="/WebLayer/components/invoice/invoice-index/invoice.html">
        <span class="material-symbols-outlined"> receipt_long </span>
        <div>
        <p>Фактури</p>
        </div>
      </a>
      </li>
      <li class="dropdown navbar-item">
      <a href="/WebLayer/components/space/space-index/spaces.html">
        <span class="material-symbols-outlined"> shield_person </span>
        <div class="dropdown-text">
            <p>${username}</p>
            <span class="material-symbols-outlined"> expand_more </span>
          </div>
          </a>
        <ul class="dropdown-content">
          <li class="dropdown-item">
          <a class ="action" href="/WebLayer/components/login/login.html" class="logout">
            <span class="material-symbols-outlined dropdown-icon"> logout </span>
            <div>
              <p>Излез</p>
            </div>
          </a>
          </li>
        </ul>
      </li>
    </ul>`;

    document.body.prepend(navbar);

    activeTab(selected);
  });
}

var username = getUsernameFromCookie("SMPlace");

function activeTab(selected) {
  var bookElement = document.getElementById(selected);
  if (bookElement) {
    bookElement.classList.add("selected");
  }
}
  