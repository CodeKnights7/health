import {
  auth,
  db,
  createUserWithEmailAndPassword,
  doc,
  updateProfile,
  setDoc,
} from "./config.js";

document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const userType = e.target.doctor.checked ? "doctor" : "patient";
    const gender = e.target.male.checked ? "male" : "female";
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, {
        displayName: name,
      });
      const currentUser = userCredential.user;
      await setDoc(doc(db, "users", currentUser.uid), {
        name,
        email,
        userType,
        gender,
      });
      console.log("all success");
      location.href = "/dashboard.html";
    } catch (error) {
      console.log(error);
    }
  });
