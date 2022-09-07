import { Api } from "../../scripts/models/api.js"

class Signup {
    static userSignup() {
        const form = document.querySelector("form")
        const inputs = document.querySelectorAll("form .input")

        form.addEventListener("submit", (event) => {
            event.preventDefault()

            for(let i of inputs) {
                if(i.value == "") {
                    return true
                }
            }

            const body = {
                username: inputs[0].value,
                email: inputs[1].value,
                "professional_level": inputs[2].value,
                password: inputs[3].value
            }
            
            Api.signup(body)
        })
    }
}

Signup.userSignup()