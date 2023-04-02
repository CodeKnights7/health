import {db,collection,updateDoc,doc,getDocs,arrayUnion} from './config.js'

const logButn = document.getElementById("loginButn")

const getData = async ()=>{
  logButn.innerText = "Booking..."
  const name = document.getElementById("facultyname").value 
  const dept = document.getElementById("facultydepartment").value
  const desg = document.getElementById("facultydesignation").value
  const rdept = document.getElementById("hallrequirementdep").value
  const depthall = document.getElementById("hallrequirementroom").value
  const date = document.getElementById("atdate").value
  const tfrom = document.getElementById("timerangefrom").value
  const tto = document.getElementById("timerangeto").value
  const audioSystem = document.querySelector('input[name="audiosystem"]:checked').value
  const FAP = document.querySelector('input[name="FAP"]:checked').value    
  const TAP = document.querySelector('input[name="TAP"]:checked').value
  const note = document.getElementById("TextBox").value    
  console.log(name,dept,desg,rdept,depthall,date,tfrom,FAP,tto,TAP,audioSystem);
  const ref  = doc(db,"bookingRequests",rdept.toUpperCase()+"_INBOX")
  const sent = new Date()
  await updateDoc(ref, {
      inbox: arrayUnion({"name":name,"note":note,"sent":`${sent.toLocaleString('en-US')}`,"Date":date,"staffDept":dept,"desg":desg,"hallName":depthall,"TimeFrom":`${tfrom} ${FAP}`,"TimeTo":`${tto} ${TAP}`,"audioSystem":audioSystem,})
  }).then(()=>  logButn.innerText = "Booked"
  )

}
const hallData = {
  "IT":[],
  "CSE":[],
  "ECE":[],
  "EEE":[],
  "MECH":[]
}

const getHalls = async ()=>{
  const querySnapshot = await getDocs(collection(db, "HALL"));
  querySnapshot.forEach((doc) => {
    const dept = `${doc.id}`.split('_')[0]
  doc.data()['listHall'].forEach(item=>{
    hallData[dept].push(item)
  })
});
}

getHalls()

const showHalls = ()=>{
  const rdept = document.getElementById("hallrequirementdep")
  const targetList = document.getElementById("hallrequirementroom")
  targetList.innerText = ""
  const getvalue = rdept.options[rdept.selectedIndex].value;  
  hallData[getvalue].forEach(item=>{
    const options = document.createElement('option')
    options.text = options.value = item.hallName
    targetList.add(options)
  })
}


logButn.addEventListener("click",getData)

document.getElementById("hallrequirementdep").addEventListener("change",showHalls)