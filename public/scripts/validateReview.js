const inputWithValueZero = document.querySelector("#no-rate");
const reviewForm = document.querySelector("#reviewForm");
if(reviewForm) {
    reviewForm.addEventListener("submit", (event) => {
        if(inputWithValueZero.checked) {            
            const alert = document.querySelector("#zeroStarsAlert");
            if(alert.classList.contains("visually-hidden")) {
                alert.classList.toggle("visually-hidden");
            }
            event.preventDefault();
        }
        if(!alert.classList.contains("visually-hidden")) {
            alert.classList.toggle("visually-hidden");
        }
    })
    
}
