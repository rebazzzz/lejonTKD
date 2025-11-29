// chat.js - AI Chat Assistant functionality

document.addEventListener('DOMContentLoaded', function() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatContainer = document.getElementById('chat-container');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    
    // FAQ dataset in Swedish
    const faqData = {
        "hej": "Hej! Hur kan jag hjälpa dig med information om Lejon TKD?",
        "tider": "Våra öppettider är: Måndag-Fredag 16:00-21:00, Söndag 16:00-21:00. Se vårt fullständiga schema på Träningstider-sidan.",
        "priser": "Vi har olika medlemskapsalternativ: Barn (6-12 år) 300 kr/mån, Ungdom (13-17) 350 kr/mån, Vuxen (18+) 400 kr/mån. Familjepriser finns också!",
        "registrering": "För att registrera dig, besök vår registreringssida och fyll i formuläret. Du kan också komma förbi klubben under öppettiderna.",
        "kontakt": "Du hittar oss på Blixtgatan 3, 424 67 Angered. Telefon: +46 76 261 22 77. Klubbansvarig: Ahmed Talabani.",
        "adress": "Vår adress är Blixtgatan 3, 424 67 Angered, Sverige.",
        "telefon": "Vårt telefonnummer är +46 76 261 22 77.",
        "instruktörer": "Våra instruktörer är certifierade och erfarna. Ahmed Talabani är vår huvudinstruktör.",
        "barn": "Vi har grupper för barn från 6 år. Barnen lär sig grunderna i Taekwondo på ett roligt och pedagogiskt sätt.",
        "vuxna": "Även vuxna är välkomna! Oavsett om du är nybörjare eller har erfarenhet har vi grupper för alla nivåer.",
        "tävlingar": "Vi deltar i regionala och nationella tävlingar. Medlemmar som vill tävla får extra träning och stöd.",
        "betydelse": "Tae kwon do betyder 'vägen med fot och hand'. Det är en koreansk kampsport som fokuserar på sparkar och slagtekniker.",
        "utrustning": "För nybörjare räcker det med träningskläder. Senare behöver du en Dobok (träningsdräkt) och skydd.",
        "prov": "Vi har gradprov regelbundet där eleverna kan visa sina färdigheter och avancera i bälten.",
        "tack": "Varsågod! Är det något mer jag kan hjälpa dig med?",
        "nej": "Okej, trevlig dag! Kom gärna tillbaka om du har fler frågor.",
        "default": "Jag förstår inte riktigt din fråga. Kan du förtydliga? Du kan fråga om tider, priser, registrering eller kontakt."
    };
    
    // Toggle chat visibility
    if (chatToggle && chatContainer) {
        chatToggle.addEventListener('click', function() {
            const isExpanded = chatToggle.getAttribute('aria-expanded') === 'true';
            chatToggle.setAttribute('aria-expanded', !isExpanded);
            chatContainer.classList.toggle('active');
            
            if (!isExpanded) {
                chatInput.focus();
            }
        });
        
        chatClose.addEventListener('click', function() {
            chatToggle.setAttribute('aria-expanded', 'false');
            chatContainer.classList.remove('active');
        });
    }
    
    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        
        if (message === '') return;
        
        // Add user message to chat
        addMessage(message, 'user');
        
        // Clear input
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const response = getBotResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const messageText = document.createElement('p');
        messageText.textContent = text;
        
        messageDiv.appendChild(messageText);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Get bot response based on user input
    function getBotResponse(input) {
        const lowerInput = input.toLowerCase();
        
        // Check for matches in FAQ data
        for (const keyword in faqData) {
            if (lowerInput.includes(keyword)) {
                return faqData[keyword];
            }
        }
        
        // Default response
        return faqData.default;
    }
    
    // Event listeners for sending messages
    if (chatSend && chatInput) {
        chatSend.addEventListener('click', sendMessage);
        
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Stub function for API integration
    window.sendMessage = function(payload) {
        // This is a stub function that can be replaced with actual API calls
        console.log('Sending message to API:', payload);
        // In a real implementation, this would send the message to your backend
        // and return a promise with the response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, message: 'Message sent successfully' });
            }, 500);
        });
    };
});