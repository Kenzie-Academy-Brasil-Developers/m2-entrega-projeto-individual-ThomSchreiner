import { Api } from "../../scripts/models/api.js"
import { Render } from "../../scripts/models/render.js"

class AnonymousUser {
    
}

class AdminUser {

}

class NormalUser {

}

function verifyUser() {
    const body = document.querySelector("body")
    const token = localStorage.getItem("@kenzieEmpresas:token")
    const isAdmin = JSON.parse(localStorage.getItem("@kenzieEmpresas:is_admin"))

    if(token) {
        if(isAdmin) {
            // AdminUser
            body.classList.add("body__admin")
            Render.getAllCompanies("admin")
        } else {
            // NormalUser
            Render.getAllCompanies()
        }
    } else {
        // AnonymousUser
        Render.getAllCompanies()
    }
}

verifyUser()

