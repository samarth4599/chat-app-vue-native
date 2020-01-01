import firebase from 'react-native-firebase'

var messages = [];

async function sendMessage(userId,friendId,text) {
    try{
        await firebase.firestore().collection('messages').doc().set({
            message: text,
            time: new Date(),
            timestamp: Date.now(),
            sender: userId,
            sentTo: friendId
        })
    } catch(e) {
        return null
    }
  return {
      message: text,
      time: new Date(),
      timestamp: Date.now(),
      sender: userId,
      sentTo: friendId
  }
    
}
async function getMessages(userId, friendId) {
    messages = [];
    console.log(friendId,userId)
//  
//     await firebase.firestore().collection('messages').where("sender", "==", userId).where("sentTo", "==", friendId).onSnapshot(function (querySnapshot) {
//         querySnapshot.forEach(function (doc) {
//             messages.push(doc.data());
//         })
//     }); 
    await firebase.firestore().collection('messages').where("sender", "==", friendId).where("sentTo", "==", userId).get().then(function (querySnapshot) {
        querySnapshot.forEach(function(doc) {
            messages.push(doc.data());
        })
    });
    await firebase.firestore().collection('messages').where("sender", "==", userId).where("sentTo", "==", friendId).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            messages.push(doc.data());
        })
    });
    messages.sort((message1,message2)=>{
        return (message1.timestamp > message2.timestamp ? 1 : message1.timestamp < message2.timestamp ?-1:0)}) 
   return messages;
}
async function addListener(userId,friendId) {

    await firebase.firestore().collection('messages').where("sender", "==", friendId).where("sentTo", "==", userId).onSnapshot(async function(querySnapshot) {
      console.log(querySnapshot);
      console.log(querySnapshot._changes);
       await querySnapshot._changes.forEach(function(doc) {
           if(doc._type == 'added') {
               console.log(doc,doc.doc.data());
               messages.push(doc.doc.data())
           }
        })
    });
    await firebase.firestore().collection('messages').where("sender", "==", userId).where("sentTo", "==", friendId).onSnapshot(async function (querySnapshot) {
        console.log(querySnapshot);
        console.log(querySnapshot._changes);
        await querySnapshot._changes.forEach(function (doc) {
            if (doc._type == 'added')
            {
                console.log(doc, doc.doc.data());
                messages.push(doc.doc.data())
            }
        })
    });
    messages.sort((message1, message2) => {
        return (message1.timestamp > message2.timestamp ? 1 : message1.timestamp < message2.timestamp ? -1 : 0)
    }) 
    return messages;
}

export  {sendMessage, getMessages, addListener};
