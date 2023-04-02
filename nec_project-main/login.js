import { doc, getDoc, db, auth, signInWithEmailAndPassword } from "./config.js";

const loginFunction = async () => {
  const username = document.getElementById("username").value;
  const passwd = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, username, passwd)
    .then((userCredential) => {
     location.href = "/dashboard.html"
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
    });
};

const handleKey = (event) => {
  if (event.key === "Enter") loginFunction();
};

document.getElementById("password").addEventListener("keypress", handleKey);

document
  .getElementById("login_Button")
  .addEventListener("click", loginFunction);
