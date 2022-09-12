import { Api } from "../../scripts/models/api.js"
import { Modal } from "../../scripts/models/modal.js"
import { Render } from "../../scripts/models/render.js"

class DashboardLogado {
    static alterarBotoesHeader() {
        const btnHeader = document.querySelectorAll("header li .text-2")
        btnHeader.forEach(btn => btn.classList.toggle("hidden"))

        DashboardLogado.logout()
    }

    static logout() {
        const btnHeader = document.querySelector("header li button")
        btnHeader.addEventListener("click", () => {
            localStorage.removeItem("@kenzieEmpresas:token")
            localStorage.removeItem("@kenzieEmpresas:is_admin")
            localStorage.removeItem("@kenzieEmpresas:uuid")
            window.location.replace("../../../index.html")
        })
    }

    static async gerenciarUsuarioComum() {
        const company = await Api.getCompanyOfUserActual()
        const userInfomations = await Api.getCoWorkers()
        
        if(company) {
            userInfomations[0].companies = company
            Render.createHomePageUser(userInfomations[0], "normalUser")
        }
    }

    static eventCreateCompany() {
        const btn = document.querySelector("button[data-create-company]")
        btn.addEventListener("click", () => {
            Modal.createCompany()
        })
    }
}


function verifyUser() {
    const body = document.querySelector("body")
    const token = localStorage.getItem("@kenzieEmpresas:token")
    const isAdmin = JSON.parse(localStorage.getItem("@kenzieEmpresas:is_admin"))
    
    if(token) {
        DashboardLogado.alterarBotoesHeader()
        if(isAdmin) {
            // AdminUser
            body.classList.add("body__admin")
            Render.getAllCompanies("admin")
            DashboardLogado.eventCreateCompany()
        } else {
            // NormalUser
            DashboardLogado.gerenciarUsuarioComum()
        }
    } else {
        // AnonymousUser
        Render.getAllCompanies()
    }
}

verifyUser()
