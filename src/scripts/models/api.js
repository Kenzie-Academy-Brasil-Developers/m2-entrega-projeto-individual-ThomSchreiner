import { Toast } from "./toast.js"

export class Api {
    static urlBase = "http://localhost:6278"
    static token = localStorage.getItem("@kenzieEmpresas:token")
    static header = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`
    }
    static tratarErroFetch(resp) {
        if(resp.ok) {
            return resp.json()
        } else {
            resp.json().then(response => {
                Toast.erro(response.error)
                throw new Error(response.error)
            })
        }
    }

    static login(body) {
        fetch(`${this.urlBase}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
        .then(resp => this.tratarErroFetch(resp))
        .then(resp => {
            if(resp) {
                localStorage.setItem("@kenzieEmpresas:token", resp.token)
                localStorage.setItem("@kenzieEmpresas:is_admin", resp.is_admin)
                localStorage.setItem("@kenzieEmpresas:uuid", resp.uuid)
                window.location.replace("./src/pages/dashboard/dashboard.html")
                return resp
            }
        })
        .catch(erro => console.log(erro))
    }

    static signup(body) {
        fetch(`${this.urlBase}/auth/register/user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
        .then(resp => this.tratarErroFetch(resp))
        .then(resp => {
            if(resp) {
                console.log(resp)
                return resp
            }
        })
        .catch(erro => console.log(erro))
    }
}