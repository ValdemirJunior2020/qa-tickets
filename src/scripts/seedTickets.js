import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

// ✅ Full list of QA criteria with points
const guidelines = [
  { text: "Agent worked ticket within 24 hours of assignment", points: 5 },
  { text: "Agent clearly understood guest's concern(s); asked follow-up questions when necessary", points: 20 },
  { text: "The Agent researches the concern and provides the best solution possible based on the guidelines while achieving exceptional customer service. If alternatives are necessary then the agent provides those to the guest", points: 10 },
  { text: "Agent contacted the Hotel and/or Rate provider when necessary via phone and/or side conversations.", points: 10 },
  { text: "Agent emailed the necessary internal departments in order to finalize the solution provided to the guest", points: 10 },
  { text: "Agent provided a response to the guest using approved correct macro and/or proper grammar and spelling when communicating to the guest.", points: 10 },
  { text: "Agent follows the escalation matrix when applicable", points: 10 },
  { text: "Agent makes an internal note on the ticket they worked as to what occurred/actions taken to resolve or update the ticket.", points: 20 },
  { text: "Agent selected the correct status when updating the ticket.", points: 5 },
  { text: "PASSING SCORE =/> 90%", points: 100 }
];

const seedTickets = async () => {
  const colRef = collection(db, "tickets");

  for (const { text, points } of guidelines) {
    await addDoc(colRef, {
      text,
      points,
      createdAt: new Date()
    });
  }

  alert("✅ All QA criteria successfully seeded into Firestore!");
};

seedTickets();
