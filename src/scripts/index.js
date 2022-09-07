import { Api } from "./models/api.js"

class Login {
    static userLogin() {
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
                email: inputs[0].value,
                password: inputs[1].value
            }
            
            Api.login(body)
        })
    }
}

Login.userLogin()