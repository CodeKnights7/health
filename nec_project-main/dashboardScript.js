const cookies = document.cookie.split(";").toString().split("=")[1];

import {
  doc,
  getDoc,
  db,
  collection,
  updateDoc,
  onAuthStateChanged,
  auth,
  signOut,
  query,
  where,
  getDocs,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "./config.js";

const inboxPage = document.getElementById("inboxPage");
const addHallPage = document.getElementById("addHallPage");
const historyPage = document.getElementById("historyPage");
const reservedPage = document.getElementById("reservedPage");

const pageDiv1 = document.getElementById("page1");
const pageDiv2 = document.getElementById("page2");
const pageDiv3 = document.getElementById("page3");
const pageDiv4 = document.getElementById("page4");

const currentUser = {};

function handlePageButn() {
  if (currentUser.userType === "doctor") {
    reservedPage.style.display = "none";
    inboxPage.style.display = "block";
    pageDiv1.style.display = "block";
    pageDiv2.style.display = "block";
    pageDiv3.style.display = "block";
  } else {
    pageDiv4.style.display = "block";
    pageDiv2.style.display = "block";
    getHalls();
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.getElementById("loginID").innerText = user.displayName;
    const docRef = await doc(db, "users", user.uid);
    const text = await getDoc(docRef);
    Object.assign(currentUser, text.data());
    console.log(currentUser);
    handlePageButn();
    fetchData();
  } else {
  }
});

async function getHalls() {
  const collRef = await collection(db, "users");

  const q = query(collRef);

  const data = await getDocs(q);
  const rdept = document.getElementById("facultydepartment");
  rdept.innerHTML = "";
  data.forEach((item) => {
    if (item.data().userType === "doctor") {
      const options = document.createElement("option");
      options.setAttribute("id", item.id);
      options.text = options.value = item.data().name;
      rdept.add(options);
    }
  });
}

// logButn.addEventListener("click",getData)

const form = document.getElementById("dataForm");
async function handleForm(event) {
  event.preventDefault();
  const name = document.getElementById("facultyname").value;
  const doctor = document.getElementById("facultydepartment");
  const date = document.getElementById("atdate").value;
  const time = document.getElementById("time").value;
  const ACTD = document.getElementById("PAS").value;
  const symp = document.getElementById("TextBox").value;

  const docuid = doctor.options[doctor.selectedIndex].id;

  try {
    const coll = await doc(
      db,
      "users",
      docuid,
      "clients",
      auth.currentUser.uid
    );
    await setDoc(coll, {
      name,
      date,
      time,
      ACTD,
      symp,
    });
    document.getElementById("dataForm").reset();
  } catch (error) {
    console.log(error);
  }
}

form.addEventListener("submit", handleForm);

// document.getElementById("hallrequirementdep").addEventListener("change",showHalls)

// dashboard page

const addHallClick = document.getElementById("addHallButn");

const logoutFunction = () => {
  signOut(auth)
    .then(() => {
      location.href = "index.html";
    })
    .catch((error) => {
      console.log("user logOut error", error);
    });
};

document
  .getElementsByClassName("logoutButn")[0]
  .addEventListener("click", logoutFunction);

const clearHall = async (event, str, target) => {
  target.style.display = "none";
  const ref = doc(db, "HALL", cookies.split("@")[1].toUpperCase() + "_HALL");
  await updateDoc(ref, {
    listHall: arrayRemove({ hallName: str, status: "free" }),
  });
  console.log(str + " removed");
};

let currentTagValue = "";

const hallEdit = async (tag) => {
  if (currentTagValue !== tag.innerText) {
    const ref = doc(db, "HALL", cookies.split("@")[1].toUpperCase() + "_HALL");
    await updateDoc(ref, {
      listHall: arrayRemove({ hallName: currentTagValue, status: "free" }),
    });
    await updateDoc(ref, {
      listHall: arrayUnion({ hallName: tag.innerText, status: "free" }),
    });
    console.log("hall edited");
  }
};

const showHall = async () => {
  const target = document.getElementsByClassName("myHallDiv")[0];
  const ref = doc(db, "HALL", cookies.split("@")[1].toUpperCase() + "_HALL");
  const text = await getDoc(ref);
  target.innerText = "";
  text.data().listHall.forEach((item) => {
    const newDiv = document.createElement("div");
    const butn = document.createElement("button");
    butn.addEventListener("click", (event) =>
      clearHall(event, item.hallName, newDiv)
    );
    const ParagraphTag = document.createElement("p");
    ParagraphTag.contentEditable = true;
    butn.innerText = "X";
    ParagraphTag.spellcheck = false;
    ParagraphTag.addEventListener(
      "focus",
      () => (currentTagValue = ParagraphTag.innerText)
    );
    ParagraphTag.addEventListener("focusout", () => hallEdit(ParagraphTag));
    butn.className = "delButn";
    newDiv.className = "showHall";
    ParagraphTag.innerText = item.hallName;
    newDiv.append(ParagraphTag);
    newDiv.append(butn);
    target.append(newDiv);
  });
  addHallClick.innerText = "Add";
};

const addHall = async () => {
  const hallName = document.getElementById("newHallName");
  if (hallName.value.trim() === "") {
    console.log("Hall Name is empty");
    return;
  }
  addHallClick.innerText = "Adding...";
  const ref = doc(db, "HALL", cookies.split("@")[1].toUpperCase() + "_HALL");
  await updateDoc(ref, {
    listHall: arrayUnion({ hallName: hallName.value, status: "free" }),
  }).then(() => console.log("successfully new hall added"));
  hallName.value = "";
  showHall();
};

const indata = document.getElementById("inboxData");

const openDiv = document.getElementById("openDiv");

const togglePage = (pid) => {
  inboxPage.style.display = "none";
  addHallPage.style.display = "none";
  historyPage.style.display = "none";
  reservedPage.style.display = "none";
  if (pid == 1) {
    displayInbox();
    inboxPage.style.display = "block";
  } else if (pid == 2) addHallPage.style.display = "block";
  else if (pid == 3) {
    showHistory();
    historyPage.style.display = "block";
  } else if ((pid = 4)) reservedPage.style.display = "block";
};

togglePage(4);

const serverData = [
  //     {id:101,name:"ram krishna",hall:"IT seminor hall",time:"8:05 AM",Ftime:"3:10 PM",Tto:"5:30 PM",desg:"AP/IT",dept:"CSE",Date1:"12.05.2022",Note:"Welcome to my website and welcome you all and have a fun"},
  //     {id:102,name:"vijay",hall:"CSE semonir hall",time:"10:35 AM",Ftime:"12:50 PM",Tto:"4:30 PM",desg:"AP/IT SG",dept:"IT",Date1:"25.05.2022",Note:"best platfrom for learning programming"},
  //     {id:103,name:"tamil kannan",hall:"Apple inc",time:"11:05 AM",Ftime:"3:10 PM",Tto:"5:30 PM",desg:"AP/IT",dept:"ECE",Date1:"12.05.2022",Note:"thank and welcome you all and have a fun"},
];

async function fetchData() {
  const coll = await collection(db, "users", auth.currentUser.uid, "clients");

  const docs = await getDocs(coll);

  docs.forEach((item) => {
    serverData.push({ ...item.data(), uid: item.id });
  });
  console.log(serverData);

  displayInbox();
}

const alertBox = document.getElementById("alertbox");
const alertMessage = document.getElementById("alertMsg");

function alertFunc(str = "responce accetped") {
  alertMessage.innerText = str;
  if (alertBox.style.display == "none") alertBox.style.display = "";
  else {
    alertBox.style.display = "none";
    // window.location.href = "index.html"
  }
}

const briefToggle = (sid = 0) => {
  if (openDiv.style.display == "block" && sid == 1)
    openDiv.style.display = "none";
  else {
    openDiv.style.display = "block";
  }
};
/*
 <div class="openText">
    <span class="openTextH">descignation</span>
    <span class="openTextD">AP/IT</span>
</div>
*/

let messageID;

let currentPatient;

const infoBrief = (infoData) => {
  // console.log(infoData);
  document.getElementById("openDiv").style.display = "block";
  currentPatient = infoData;
};


const displayInbox = () => {
  indata.innerText = "";
  let index = 1;
  for (let data of serverData) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "temp_msg";
    const H1 = document.createElement("h3");
    const H2 = document.createElement("h3");
    const H3 = document.createElement("h3");
    const H4 = document.createElement("h3");
    const H5 = document.createElement("h3");
    const butn = document.createElement("img");
    butn.setAttribute("src", "./assets/folder.png");
    butn.className = "butnImg";
    H1.innerText = index++;
    H2.innerText = data.name;
    H3.innerText = data.date;
    H4.innerText = data.time;
    H5.innerText = data.symp;
    msgDiv.append(H1);
    msgDiv.append(H2);
    msgDiv.append(H3);
    msgDiv.append(H4);
    msgDiv.append(H5);
    msgDiv.append(butn);
    butn.addEventListener("click", () => infoBrief(data.uid));
    indata.append(msgDiv);
  }
};

displayInbox();

const masterDiv = document.getElementById("historyDataId");
const getHistory = (firebaseData) => {
  const newDiv = document.createElement("div");
  newDiv.className = "historyData";
  newDiv.setAttribute("title", firebaseData.adminText);
  const div1 = document.createElement("div");
  const div2 = document.createElement("div");
  const div3 = document.createElement("div");
  const div4 = document.createElement("div");
  const div5 = document.createElement("div");
  const div6 = document.createElement("div");
  const div7 = document.createElement("div");
  div1.className = "historytext";
  div2.className = "historytext";
  div3.className = "historytext";
  div4.className = "historytext";
  div5.className = "historytext";
  div6.className = "historytext";
  div7.className = "historytext";
  div1.innerText = firebaseData["name"];
  div2.innerText = firebaseData["staffDept"];
  div3.innerText = firebaseData["bookedDept"];
  div4.innerText = firebaseData["hallName"];
  div5.innerText = firebaseData["Date"];
  div6.innerText = `${firebaseData["TimeFrom"]} - ${firebaseData["TimeTo"]}`;
  div7.innerText = firebaseData["status"];
  newDiv.append(div1);
  newDiv.append(div2);
  newDiv.append(div3);
  newDiv.append(div4);
  newDiv.append(div5);
  newDiv.append(div6);
  newDiv.append(div7);
  masterDiv.append(newDiv);
};

const showHistory = async () => {
  masterDiv.innerHTML = "";
  const logs = [];
  const ref = collection(db, "bookingRequests");
  const text = await getDocs(ref);
  text.forEach((item1) => {
    item1.data().inbox.forEach((item) => {
      item["bookedDept"] = item1.id.split("_")[0];
      logs.push(item);
    });
    item1.data().view.forEach((item) => {
      item["bookedDept"] = item1.id.split("_")[0];
      logs.push(item);
    });
  });
  logs.sort(function (a, b) {
    const dateA = new Date(a.sent.replace(",", " ")).getTime();
    const dateB = new Date(b.sent.replace(",", " ")).getTime();
    return dateA < dateB ? 1 : -1;
  });

  logs.forEach((item) => getHistory(item));
};

showHistory();

const statusFunction = async (num) => {
  const docRef = doc(db,"users",auth.currentUser.uid,"clients",currentPatient);
  const textBox = document.getElementById("openTextBox")
  updateDoc(docRef,{
    "status": num ==1?"Accept":"Reject",
    "message": textBox.value
  })
  textBox.value = ""
  
};

document
  .getElementsByClassName("appButn")[0]
  .addEventListener("click", () => statusFunction(1));
document
  .getElementsByClassName("decButn")[0]
  .addEventListener("click", () => statusFunction(2));

document.getElementById("page1").addEventListener("click", () => togglePage(1));
document.getElementById("page2").addEventListener("click", () => togglePage(2));
document.getElementById("page3").addEventListener("click", () => togglePage(3));
document.getElementById("page4").addEventListener("click", () => {
  togglePage(4);
  getHalls();
});

document
  .getElementsByClassName("actionButn")[0]
  .addEventListener("click", () => alertFunc());
document
  .getElementsByClassName("actionButn")[1]
  .addEventListener("click", () => alertFunc());
document
  .getElementsByClassName("actionButn")[2]
  .addEventListener("click", () => alertFunc());
document.getElementById("addHallButn").addEventListener("click", addHall);

document
  .querySelector(".openTitle span")
  .addEventListener("click", () => briefToggle(1));
