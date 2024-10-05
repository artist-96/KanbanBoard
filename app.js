const addBtn = document.querySelector(".add-btn");
const modal  = document.querySelector(".modal-container");
const priorityColors = document.querySelectorAll(".priority-color");
const textArea = document.querySelector(".textarea-container");
const pendingContainer = document.querySelector(".pending-container");
const priorityMenuColors = document.querySelectorAll(".color");
const deleteBtn = document.querySelector(".remove-btn");
const colors = ["pink", "blue", "violet", "green"];



let modalDisplay = false;
let deleteBtnisActive = false;



//loading existing tickets to UI from local

loadExistingTickets();

function loadExistingTickets(){

    //get all tickets
    const existingTickets = fetchExistingTickets();

    //display them
    displayTickets(existingTickets);
}

function displayTickets(tickets){

    for(let i = 0; i<tickets.length; i++){
        const ticket = tickets[i];

        console.log(ticket);

        const{id, color, content} = ticket;

        createTicket(id, color, content, false);
        
    }
}


//Handles InputDisplay Event
addBtn.addEventListener('click', event=>{

    if(modalDisplay === false){
        modal.style.display = "flex";
        modalDisplay = true;
    }
    else{
        modal.style.display = "none";
        modalDisplay = false;
    }
})

//Handles Ticket Creation Event

modal.addEventListener("keypress", event=>{

    if(event.key != "Enter"){
        return;
    }
    console.log("Enter is pressed");
    
    //When enter is pressed, find the active selected color and get userInput
    //Create a ticket using this information

    const sColor = findActiveColor();

    const userInput = textArea.value;

    const ticketID = randomTicket();

    createTicket(ticketID,sColor, userInput, true);

    //After creation, clear all contents and close the display
    textArea.value = "";

    modal.style.display = "none";

})

function findActiveColor(){
    for(let i = 0; i<priorityColors.length; i++){

        const priorityElement = priorityColors[i];

        if(priorityElement.classList.contains("active")){
            return priorityElement.classList[1];
        }
    }
}

function createTicket(ticketID, sColor, userInput, addToLocalStorage){

    // console.log(`Create a new ticket with ${sColor} and ${userInput}`);
    
    const ticketContainer = document.createElement("div");
    ticketContainer.setAttribute("class", "ticket-container");

    

    ticketContainer.innerHTML = 
    `       <div class="ticket-color ${sColor}"></div>
            <div class="ticket-id">#${ticketID}</div>
            <div class="ticket-area">${userInput}</div>
            <div class="lock-unlock">
                <i class="fa fa-lock"></i>
            </div>
    `;

    

    const lockBtn = ticketContainer.querySelector(".lock-unlock");
    const ticketArea = ticketContainer.querySelector(".ticket-area");
    const ticketPriority = ticketContainer.querySelector(".ticket-color");
    
    ticketContainer.addEventListener('click', handleTicketContainerClick);
    lockBtn.addEventListener('click', (event)=>handleLockUnlockClick(event, ticketArea));
    ticketPriority.addEventListener('click', handleTicketPriority);

    //ADDS TO UI

    pendingContainer.appendChild(ticketContainer);

    //STORE A LIST OF TICKETS

    if(addToLocalStorage){

        const newTicket = {
            id: ticketID,
            color: sColor,
            content: userInput
        }
    
        addtoExistingTicketsinLocalStorage(newTicket);
    }
}


//Handles Local Storage function

function addtoExistingTicketsinLocalStorage(newTicket){

    //get all tickets
    const existingTickets = fetchExistingTickets();

    //push a new tickets to existing
    existingTickets.push(newTicket);

    //save all tickets
    saveTickets(existingTickets);
}

function fetchExistingTickets(){
    const existingTickets = localStorage.getItem("kanbanTickets");

    const existingTicketsJS = JSON.parse(existingTickets);

    if(existingTicketsJS == null){
        return [];
    }

    return existingTicketsJS;
}

function saveTickets(newTicket){

    const newTicketsJSON = JSON.stringify(newTicket);

    localStorage.setItem("kanbanTickets", newTicketsJSON);
}


//Handles Lock Unlock Event

//The lock unlock feature is available within the ticket container
//Hence its fetching and event occurs within the ticket container creation 

function handleLockUnlockClick(event, ticketArea){
   

    let isLocked = event.target.classList.contains("fa-lock");

    if(isLocked){
        event.target.classList.remove("fa-lock");
        event.target.classList.add("fa-unlock");
        ticketArea.setAttribute("contenteditable", "true");
    }
    else{
        event.target.classList.remove("fa-unlock");
        event.target.classList.add("fa-lock");
        ticketArea.setAttribute("contenteditable", "false");
    }
    
}


//Handles Ticket Deletion Event

//To delete a ticket we need to add click event on ticketContainer --> find the event inside ticket creation

function handleTicketContainerClick(event){
    

    //check if delete btn is activated --> hide or delete ticket
    
    if(deleteBtnisActive === true){
        event.currentTarget.remove();
        // localStorage.removeItem("kanbanTickets");
    }

    //else do nothing
    
    
}

deleteBtn.addEventListener('click', event=>{
    console.log(event.target);

    if(deleteBtnisActive === false){
        deleteBtnisActive = true;
        event.target.classList.add("red");
    }

    else{
        deleteBtnisActive = false;
        event.target.classList.remove("red");
    }
    
})

//Handles Ticket Priority Color of ticketContainer on ColorClick 

function handleTicketPriority(event){
    console.log(event.target);

    const existingColor = event.currentTarget.classList[1];

    const existingColorIndex = colors.indexOf(existingColor);

    console.log(existingColor);
    
    const newColorIndex = (existingColorIndex + 1)%colors.length;
    const newColor = colors[newColorIndex];

    event.currentTarget.classList.remove(existingColor);
    event.currentTarget.classList.add(newColor);
}

//Handles UUID creation

function randomTicket(){
    const UUID = new ShortUniqueId({length: 10});

    const ticketID = UUID.rnd();

    return ticketID;
}

//Handles Border Active Color Event
for(let i = 0; i<priorityColors.length; i++){

    const selectedColor = priorityColors[i];

    selectedColor.addEventListener('click', event=>{
        
        removeActiveFromAll();
        selectedColor.classList.add("active");
    })
}
function removeActiveFromAll(){
    for(let i = 0; i<priorityColors.length; i++){
        priorityColors[i].classList.remove("active");
    }
}

//Handles priority of Menu 

for(let i = 0; i<priorityMenuColors.length; i++){
    const priorityMenuColor = priorityMenuColors[i];

    priorityMenuColor.addEventListener('click', event=>{

        const selectedColor = event.target.classList[1];

        console.log(selectedColor);
        
        
        const allTickets = document.querySelectorAll(".ticket-container");

        for(let i = 0; i<allTickets.length; i++){

            const ticketContainer = allTickets[i];

            const ticketColorElement = ticketContainer.querySelector(".ticket-color");

            const ticketColor = ticketColorElement.classList[1];

            if(ticketColor !== selectedColor){
                ticketContainer.style.display = "none";
            }

            else{
                ticketContainer.style.display = "block";
            }
        }
    })

    priorityMenuColor.addEventListener("dblclick", event=>{
        const allTickets = document.querySelectorAll(".ticket-container");
    
        for(let i = 0; i<allTickets.length; i++){
            const ticketContainer = allTickets[i];
            ticketContainer.style.display = "block";
        }
    })
}

